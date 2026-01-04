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

// Helper function to generate safe email key for guest book
const getGuestEmailKey = (message) => {
  try {
    if (!message) return null;
    
    // Check if has valid email
    if (message.email && typeof message.email === 'string' && message.email.trim() !== '') {
      return message.email.toLowerCase();
    }
    
    // Generate placeholder email from name and id
    const name = (message.name || 'anonymous').toLowerCase().replace(/\s+/g, '-');
    const id = message.id || Date.now();
    
    return `guest-${name}-${id}@placeholder.com`;
  } catch (error) {
    console.error('Error generating guest email key:', error);
    return null;
  }
};

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  try {
    return db && db !== undefined;
  } catch {
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
    likes: 0,
    firebaseId: null // Will be populated after Firebase sync
  };
  const updatedMessages = [messageWithId, ...messages];
  saveMessages(updatedMessages);
  
  // Try to sync to Firebase in background
  if (isFirebaseConfigured()) {
    try {
      console.log('🔄 Attempting to sync message to Firebase...');
      const emailKey = getGuestEmailKey(messageWithId);
      if (emailKey) {
        console.log('📝 Adding to Firebase with email:', emailKey);
        const docRef = await addDoc(collection(db, FIREBASE_COLLECTION), {
          id: messageWithId.id,
          name: messageWithId.name || '',
          email: emailKey,
          message: messageWithId.message || '',
          date: Timestamp.fromDate(new Date(messageWithId.date)),
          likes: 0,
          language: messageWithId.language || 'es'
        });
        console.log('✓ Message synced to Firebase with ID:', docRef.id);
        
        // Update localStorage with the Firebase ID for future reference
        const updatedMessageWithFirebaseId = {
          ...messageWithId,
          firebaseId: docRef.id
        };
        const messagesWithUpdated = updatedMessages.map(msg => 
          msg.id === messageWithId.id ? updatedMessageWithFirebaseId : msg
        );
        saveMessages(messagesWithUpdated);
        console.log('✓ Updated localStorage with firebaseId:', docRef.id);
        return updatedMessageWithFirebaseId;
      } else {
        console.warn('⚠️ Could not generate email key for guest');
      }
    } catch (error) {
      console.error('❌ Failed to sync message to Firebase:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    }
  } else {
    console.warn('⚠️ Firebase not configured, message saved to localStorage only');
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
  
  // Try to sync to Firebase
  if (updatedMessage && isFirebaseConfigured()) {
    try {
      const emailKey = getGuestEmailKey(updatedMessage);
      if (emailKey) {
        const q = query(collection(db, FIREBASE_COLLECTION), where('email', '==', emailKey));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, updates);
          console.log('✓ Message updated in Firebase');
        }
      }
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
  
  if (!messageToDelete) {
    console.warn('⚠️ Message not found for deletion:', messageId);
    return false;
  }
  
  // Always delete from localStorage first
  const updatedMessages = messages.filter(msg => msg.id !== messageId);
  saveMessages(updatedMessages);
  console.log('✓ Message deleted from localStorage:', messageId);
  
  // Try to delete from Firebase
  if (isFirebaseConfigured()) {
    try {
      console.log('🗑️ Attempting to delete message from Firebase...');
      console.log('Message to delete:', {
        id: messageToDelete.id,
        firebaseId: messageToDelete.firebaseId,
        email: messageToDelete.email,
        name: messageToDelete.name
      });
      
      // Try using firebaseId first if available
      if (messageToDelete.firebaseId) {
        const docRef = doc(db, FIREBASE_COLLECTION, messageToDelete.firebaseId);
        await deleteDoc(docRef);
        console.log('✓ Message deleted from Firebase via firebaseId:', messageToDelete.firebaseId);
      } else {
        // Fallback to email search
        const emailKey = getGuestEmailKey(messageToDelete);
        if (!emailKey) {
          console.warn('⚠️ Cannot delete from Firebase: invalid email key');
          return true; // Local delete succeeded
        }
        
        console.log('🔍 Searching Firebase by email:', emailKey);
        const q = query(collection(db, FIREBASE_COLLECTION), where('email', '==', emailKey));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          for (const firebaseDoc of querySnapshot.docs) {
            await deleteDoc(firebaseDoc.ref);
            console.log('✓ Message deleted from Firebase via email:', emailKey, 'Document ID:', firebaseDoc.id);
          }
        } else {
          console.warn('⚠️ Message not found in Firebase for deletion:', emailKey);
        }
      }
    } catch (error) {
      console.error('❌ Failed to delete from Firebase:', error);
      console.error('Error code:', error.code, 'Message:', error.message);
      console.error('Full error:', error);
      // Continue anyway - local delete already succeeded
    }
  } else {
    console.log('⚠️ Firebase not configured, delete only from localStorage');
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

// Diagnose duplicate messages and missing data
export const diagnoseDuplicateMessages = async () => {
  console.log('🔍 Starting duplicate messages diagnosis...');
  
  // Load from Firebase to get the true count
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured');
    return { error: 'Firebase not configured' };
  }
  
  try {
    const q = query(collection(db, FIREBASE_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const firebaseMessages = [];
    const emailCounts = new Map();
    const duplicates = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const email = data.email ? data.email.toLowerCase() : 'NO_EMAIL';
      
      firebaseMessages.push({
        ...data,
        firebaseDocId: doc.id,
        date: data.date?.toDate() || new Date()
      });
      
      // Track email occurrences
      if (!emailCounts.has(email)) {
        emailCounts.set(email, []);
      }
      emailCounts.get(email).push({
        id: data.id,
        firebaseDocId: doc.id,
        name: data.name,
        email: data.email,
        date: data.date?.toDate()
      });
    });
    
    // Find duplicates
    for (const [email, records] of emailCounts) {
      if (records.length > 1) {
        duplicates.push({
          email,
          count: records.length,
          records: records.sort((a, b) => new Date(b.date) - new Date(a.date))
        });
      }
    }
    
    // Get localStorage data
    const localMessages = loadMessagesFromLocalStorage();
    
    const diagnosis = {
      firebaseTotal: firebaseMessages.length,
      localTotal: localMessages.length,
      uniqueEmails: emailCounts.size,
      duplicateCount: duplicates.length,
      totalDuplicateRecords: firebaseMessages.length - emailCounts.size,
      duplicates: duplicates
    };
    
    console.log('📊 Diagnosis Results:');
    console.log(`  Firebase total: ${diagnosis.firebaseTotal}`);
    console.log(`  Unique emails: ${diagnosis.uniqueEmails}`);
    console.log(`  Duplicate groups: ${diagnosis.duplicateCount}`);
    console.log(`  Total duplicate records: ${diagnosis.totalDuplicateRecords}`);
    console.log(`  Missing from local: ${diagnosis.firebaseTotal - diagnosis.localTotal}`);
    
    if (duplicates.length > 0) {
      console.log('\n📋 Duplicates found:');
      duplicates.forEach((dup, idx) => {
        console.log(`  ${idx + 1}. ${dup.email}: ${dup.count} records`);
        dup.records.forEach((rec, recIdx) => {
          console.log(`     ${recIdx + 1}. ${rec.name} (${rec.firebaseDocId}) - ${rec.date}`);
        });
      });
    }
    
    return diagnosis;
  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
    return { error: error.message };
  }
};

// Remove duplicate messages keeping the most recent one
export const removeDuplicateMessages = async () => {
  console.log('🗑️ Starting duplicate messages removal...');
  
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured');
    return { error: 'Firebase not configured' };
  }
  
  try {
    // Get diagnosis first
    const diagnosis = await diagnoseDuplicateMessages();
    if (diagnosis.error) {
      return diagnosis;
    }
    
    if (diagnosis.totalDuplicateRecords === 0) {
      console.log('✅ No duplicates found');
      return { success: true, removed: 0, message: 'No duplicates found' };
    }
    
    let removedCount = 0;
    
    // Process each duplicate group
    for (const duplicate of diagnosis.duplicates) {
      const records = duplicate.records;
      
      // Keep the first one (most recent), delete the rest
      const toDelete = records.slice(1);
      
      console.log(`\n🗑️ Processing ${duplicate.email}:`);
      console.log(`  Keeping: ${records[0].firebaseDocId} (${records[0].date})`);
      
      for (const record of toDelete) {
        try {
          const docRef = doc(db, FIREBASE_COLLECTION, record.firebaseDocId);
          await deleteDoc(docRef);
          console.log(`  ✓ Deleted: ${record.firebaseDocId} (${record.date})`);
          removedCount++;
        } catch (error) {
          console.error(`  ❌ Error deleting ${record.firebaseDocId}:`, error);
        }
      }
    }
    
    console.log(`\n✅ Duplicate removal complete. Removed: ${removedCount} records`);
    
    // Refresh the local cache
    const firebaseMessages = await loadMessagesFromFirebase();
    saveMessages(firebaseMessages);
    
    return {
      success: true,
      removed: removedCount,
      newTotal: firebaseMessages.length,
      message: `Removed ${removedCount} duplicate records`
    };
  } catch (error) {
    console.error('❌ Error during duplicate removal:', error);
    return { error: error.message };
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
