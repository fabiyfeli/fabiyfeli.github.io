// Guest Book Storage Utilities
import { db } from '../config/firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  where,
  Timestamp 
} from 'firebase/firestore';

const STORAGE_KEY = 'wedding_guestbook_messages';
const FIREBASE_COLLECTION = 'guestBook';
const GITHUB_REPO = 'fabiyfeli/fabiyfeli.github.io';
const GITHUB_API = 'https://api.github.com';

// GitHub GraphQL endpoint for discussions
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

// Public token with read-only access to discussions (safe to expose)
// This will be used for reading discussions only
const PUBLIC_GITHUB_TOKEN = 'github_pat_public_readonly'; // Placeholder - needs to be configured

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  try {
    return db !== null && db !== undefined;
  } catch (error) {
    return false;
  }
};

// Load messages from Firebase
export const loadMessagesFromFirebase = async () => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, using localStorage only');
    return [];
  }

  try {
    const q = query(collection(db, FIREBASE_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        ...data,
        id: data.id || doc.id,
        date: data.date?.toDate() || new Date(),
        firebaseId: doc.id
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error loading messages from Firebase:', error);
    return [];
  }
};

// Merge messages from localStorage and Firebase
const mergeMessages = (localMessages, firebaseMessages) => {
  const merged = new Map();
  
  // Add local messages first
  localMessages.forEach(msg => {
    merged.set(msg.id, msg);
  });
  
  // Override with Firebase data (source of truth)
  firebaseMessages.forEach(msg => {
    merged.set(msg.id, msg);
  });
  
  // Convert back to array, sorted by date (newest first)
  return Array.from(merged.values())
    .sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB - dateA;
    });
};

// Internal function to load from localStorage only
const loadMessagesFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const messages = JSON.parse(stored);
      
      // Check if these are old mock messages (detect by known mock names)
      const mockNames = ['Sarah Johnson', 'Michael Chen', 'María García', 'David Thompson', 'Emily Rodriguez', 'James Wilson', 'Isabella Martínez', 'Robert Anderson'];
      const hasMockMessages = messages.some(msg => mockNames.includes(msg.name));
      
      // If mock messages detected, clear storage and return empty
      if (hasMockMessages) {
        localStorage.removeItem(STORAGE_KEY);
        return [];
      }
      
      // Convert date strings back to Date objects
      return messages.map(msg => ({
        ...msg,
        date: new Date(msg.date)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
};

// Load messages with Firebase sync (async version for admin panels)
export const loadMessagesWithSync = async () => {
  // Try to load from Firebase first
  if (isFirebaseConfigured()) {
    try {
      const firebaseMessages = await loadMessagesFromFirebase();
      if (firebaseMessages.length > 0) {
        console.log('✓ Loaded', firebaseMessages.length, 'messages from Firebase');
        // Merge with localStorage
        const localMessages = loadMessagesFromLocalStorage();
        const merged = mergeMessages(localMessages, firebaseMessages);
        saveMessages(merged); // Save to localStorage as cache
        return merged;
      }
    } catch (err) {
      console.warn('Failed to load from Firebase, using localStorage:', err);
    }
  }
  
  // Fallback to localStorage
  return loadMessagesFromLocalStorage();
};

// Load messages from localStorage (with Firebase sync in background)
export const loadMessages = () => {
  // Sync from Firebase in background (non-blocking)
  if (isFirebaseConfigured()) {
    loadMessagesFromFirebase()
      .then(firebaseMessages => {
        if (firebaseMessages.length > 0) {
          const localMessages = loadMessagesFromLocalStorage();
          const merged = mergeMessages(localMessages, firebaseMessages);
          saveMessages(merged);
          console.log('✓ Synced', firebaseMessages.length, 'messages from Firebase');
        }
      })
      .catch(err => console.warn('Background Firebase sync failed:', err));
  }
  
  // Return local data immediately (don't block UI)
  return loadMessagesFromLocalStorage();
};

// Save messages to localStorage
export const saveMessages = (messages) => {
  try {
    // Convert Date objects to ISO strings for storage
    const messagesForStorage = messages.map(msg => ({
      ...msg,
      date: msg.date instanceof Date ? msg.date.toISOString() : msg.date
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesForStorage));
    return true;
  } catch (error) {
    console.error('Error saving messages:', error);
    return false;
  }
};

// Save message to Firebase
const saveMessageToFirebaseDB = async (messageData) => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    const docRef = await addDoc(collection(db, FIREBASE_COLLECTION), {
      ...messageData,
      date: Timestamp.now(),
      likes: messageData.likes || 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving message to Firebase:', error);
    return null;
  }
};

// Add a new message (Hybrid: localStorage + Firebase)
export const addMessage = async (newMessage) => {
  const messages = loadMessagesFromLocalStorage();
  const messageWithId = {
    ...newMessage,
    id: Date.now(), // Use timestamp as unique ID
    date: new Date(),
    likes: 0
  };
  const updatedMessages = [messageWithId, ...messages];
  saveMessages(updatedMessages);
  
  // Try to sync to Firebase in background
  try {
    const firebaseId = await saveMessageToFirebaseDB(messageWithId);
    if (firebaseId) {
      console.log('✓ Message synced to Firebase');
      // Update local copy with Firebase ID
      messageWithId.firebaseId = firebaseId;
      const withFirebaseId = updatedMessages.map(m => 
        m.id === messageWithId.id ? messageWithId : m
      );
      saveMessages(withFirebaseId);
    }
  } catch (error) {
    console.warn('Failed to sync message to Firebase:', error);
  }
  
  return messageWithId;
};

// Update message in Firebase
const updateMessageInFirebase = async (firebaseId, updates) => {
  if (!isFirebaseConfigured() || !firebaseId) {
    return false;
  }
  
  try {
    const docRef = doc(db, FIREBASE_COLLECTION, firebaseId);
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating Firebase message:', error);
    return false;
  }
};

// Update a message (for likes, replies, etc) - Hybrid: localStorage + Firebase
export const updateMessage = async (messageId, updates) => {
  const messages = loadMessagesFromLocalStorage();
  const updatedMessages = messages.map(msg => 
    msg.id === messageId ? { ...msg, ...updates } : msg
  );
  saveMessages(updatedMessages);
  
  const updatedMessage = updatedMessages.find(msg => msg.id === messageId);
  
  // Try to sync to Firebase if firebaseId exists
  if (updatedMessage && updatedMessage.firebaseId) {
    try {
      await updateMessageInFirebase(updatedMessage.firebaseId, updates);
      console.log('✓ Message updated in Firebase');
    } catch (error) {
      console.warn('Failed to update in Firebase:', error);
    }
  }
  
  return updatedMessage;
};

// Delete message from Firebase
const deleteMessageFromFirebase = async (firebaseId) => {
  if (!isFirebaseConfigured() || !firebaseId) {
    return false;
  }
  
  try {
    const docRef = doc(db, FIREBASE_COLLECTION, firebaseId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting from Firebase:', error);
    return false;
  }
};

// Delete a message - Hybrid: localStorage + Firebase
export const deleteMessage = async (messageId) => {
  const messages = loadMessagesFromLocalStorage();
  const messageToDelete = messages.find(m => m.id === messageId);
  const firebaseId = messageToDelete?.firebaseId;
  
  const updatedMessages = messages.filter(msg => msg.id !== messageId);
  saveMessages(updatedMessages);
  
  // Try to delete from Firebase if firebaseId exists
  if (firebaseId) {
    try {
      await deleteMessageFromFirebase(firebaseId);
      console.log('✓ Message deleted from Firebase');
    } catch (error) {
      console.warn('Failed to delete from Firebase:', error);
    }
  }
  
  return true;
};

// Toggle like on a message
export const toggleLike = (messageId) => {
  const messages = loadMessages();
  const message = messages.find(msg => msg.id === messageId);
  if (message) {
    const currentLikes = message.likes || 0;
    return updateMessage(messageId, { likes: currentLikes + 1 });
  }
  return null;
};

// Clear all messages (for resetting/cleaning)
export const clearAllMessages = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing messages:', error);
    return false;
  }
};

// Export messages to CSV
export const exportMessagesToCSV = () => {
  const messages = loadMessages();
  
  // CSV Headers
  const headers = ['ID', 'Nombre', 'Email', 'Mensaje', 'Fecha', 'Likes', 'Idioma'];
  
  // Convert messages to CSV rows
  const rows = messages.map(msg => [
    msg.id,
    msg.name || '',
    msg.email || '',
    `"${(msg.message || '').replace(/"/g, '""')}"`, // Escape quotes in message
    new Date(msg.date).toISOString(),
    msg.likes || 0,
    msg.language || 'es'
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `guestbook-messages-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Import messages from CSV
export const importMessagesFromCSV = (csvContent) => {
  try {
    const lines = csvContent.trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error('El archivo CSV está vacío o no tiene datos');
    }
    
    // Skip header line
    const dataLines = lines.slice(1);
    const newMessages = [];
    
    dataLines.forEach((line, index) => {
      try {
        // Simple CSV parsing (handles quoted fields)
        const values = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
              currentValue += '"';
              i++;
            } else {
              insideQuotes = !insideQuotes;
            }
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim());
        
        if (values.length < 7) {
          console.warn(`Línea ${index + 2} tiene ${values.length} columnas (esperadas: 7), saltando...`);
          return;
        }
        
        const message = {
          id: parseInt(values[0]) || Date.now() + index,
          name: values[1] || '',
          email: values[2] || '',
          message: values[3] || '',
          date: new Date(values[4]),
          likes: parseInt(values[5]) || 0,
          language: values[6] || 'es'
        };
        
        newMessages.push(message);
      } catch (error) {
        console.error(`Error procesando línea ${index + 2}:`, error);
      }
    });
    
    if (newMessages.length === 0) {
      throw new Error('No se pudieron procesar mensajes del CSV');
    }
    
    // Replace existing messages
    saveMessages(newMessages);
    return { success: true, count: newMessages.length };
  } catch (error) {
    console.error('Error importing CSV:', error);
    return { success: false, error: error.message };
  }
};

// Get guest book statistics
export const getGuestBookStats = () => {
  const messages = loadMessages();
  
  return {
    totalMessages: messages.length,
    totalLikes: messages.reduce((sum, msg) => sum + (msg.likes || 0), 0),
    languages: {
      es: messages.filter(m => m.language === 'es').length,
      en: messages.filter(m => m.language === 'en').length
    }
  };
};

// ============================================
// GitHub Discussions Integration (Proof of Concept)
// ============================================

// Load messages from GitHub Discussions
export const loadMessagesFromGitHub = async () => {
  try {
    // For now, we'll use GitHub Issues as a simpler alternative to Discussions
    // Each message will be an issue with a specific label "guest-book"
    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_REPO}/issues?labels=guest-book&state=all&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch messages from GitHub');
    }

    const issues = await response.json();
    
    // Convert GitHub issues to message format
    const messages = issues.map(issue => {
      // Parse message data from issue body (we'll use JSON in the body)
      try {
        const bodyData = JSON.parse(issue.body || '{}');
        return {
          id: issue.number,
          name: bodyData.name || issue.user.login,
          email: bodyData.email || '',
          message: bodyData.message || issue.title,
          date: new Date(issue.created_at),
          likes: issue.reactions?.['+1'] || 0,
          language: bodyData.language || 'es',
          githubUrl: issue.html_url
        };
      } catch (e) {
        // Fallback if body is not JSON
        return {
          id: issue.number,
          name: issue.user.login,
          email: '',
          message: issue.title,
          date: new Date(issue.created_at),
          likes: issue.reactions?.['+1'] || 0,
          language: 'es',
          githubUrl: issue.html_url
        };
      }
    });

    return messages;
  } catch (error) {
    console.error('Error loading messages from GitHub:', error);
    return [];
  }
};

// Save message to GitHub Issues (requires authentication)
export const saveMessageToGitHub = async (messageData, githubToken) => {
  try {
    if (!githubToken) {
      throw new Error('GitHub token is required');
    }

    // Create message body with full data as JSON
    const issueBody = JSON.stringify({
      name: messageData.name,
      email: messageData.email,
      message: messageData.message,
      language: messageData.language,
      submittedAt: new Date().toISOString()
    }, null, 2);

    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_REPO}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${messageData.name}: ${messageData.message.substring(0, 50)}...`,
          body: issueBody,
          labels: ['guest-book']
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save message to GitHub');
    }

    const issue = await response.json();
    
    return {
      success: true,
      id: issue.number,
      url: issue.html_url
    };
  } catch (error) {
    console.error('Error saving message to GitHub:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Hybrid approach: Save locally AND try to sync to GitHub
export const addMessageHybrid = async (newMessage, githubToken = null) => {
  // Always save to localStorage first (immediate feedback)
  const localMessage = addMessage(newMessage);
  
  // Try to sync to GitHub if token is available
  if (githubToken) {
    try {
      const result = await saveMessageToGitHub(newMessage, githubToken);
      if (result.success) {
        console.log('Message synced to GitHub:', result.url);
        // Update local message with GitHub ID
        updateMessage(localMessage.id, { 
          githubId: result.id,
          githubUrl: result.url,
          synced: true 
        });
      }
    } catch (error) {
      console.error('Failed to sync to GitHub, but saved locally:', error);
    }
  }
  
  return localMessage;
};

// Sync local messages with GitHub (for admin)
export const syncWithGitHub = async (githubToken) => {
  try {
    // Load messages from GitHub
    const githubMessages = await loadMessagesFromGitHub();
    const localMessages = loadMessages();
    
    // Merge: prefer GitHub messages, keep local ones that aren't on GitHub
    const githubIds = new Set(githubMessages.map(m => m.githubUrl));
    const localOnlyMessages = localMessages.filter(m => !m.githubUrl || !githubIds.has(m.githubUrl));
    
    // Combine and save
    const mergedMessages = [...githubMessages, ...localOnlyMessages];
    saveMessages(mergedMessages);
    
    return {
      success: true,
      total: mergedMessages.length,
      fromGitHub: githubMessages.length,
      localOnly: localOnlyMessages.length
    };
  } catch (error) {
    console.error('Error syncing with GitHub:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
