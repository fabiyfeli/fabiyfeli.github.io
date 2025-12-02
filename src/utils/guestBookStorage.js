// Guest Book Storage Utilities
const STORAGE_KEY = 'wedding_guestbook_messages';

// Load messages from localStorage
export const loadMessages = () => {
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
    // Return empty array if no messages exist
    return [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
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

// Add a new message
export const addMessage = (newMessage) => {
  const messages = loadMessages();
  const messageWithId = {
    ...newMessage,
    id: Date.now(), // Use timestamp as unique ID
    date: new Date(),
    likes: 0
  };
  const updatedMessages = [messageWithId, ...messages];
  saveMessages(updatedMessages);
  return messageWithId;
};

// Update a message (for likes, replies, etc)
export const updateMessage = (messageId, updates) => {
  const messages = loadMessages();
  const updatedMessages = messages.map(msg => 
    msg.id === messageId ? { ...msg, ...updates } : msg
  );
  saveMessages(updatedMessages);
  return updatedMessages.find(msg => msg.id === messageId);
};

// Delete a message
export const deleteMessage = (messageId) => {
  const messages = loadMessages();
  const updatedMessages = messages.filter(msg => msg.id !== messageId);
  saveMessages(updatedMessages);
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
