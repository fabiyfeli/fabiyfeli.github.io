// Guest Book Storage Utilities
const STORAGE_KEY = 'wedding_guestbook_messages';

// Initial mock messages
const getInitialMessages = (language = 'es') => [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1985c262f-1763294244026.png",
    avatarAlt: "Professional headshot of blonde woman with warm smile wearing light blue blouse",
    relationship: language === 'es' ? 'Amiga' : 'Friend',
    category: language === 'es' ? 'Recuerdo Especial' : 'Special Memory',
    message: language === 'es' ?
      "Recuerdo cuando nos conocimos en la universidad. Siempre supe que encontrarías a tu alma gemela. Ver tu amor florecer ha sido una de las mayores alegrías de mi vida. ¡No puedo esperar para celebrar con ustedes!" :
      "I remember when we first met in college. I always knew you would find your soulmate. Watching your love story unfold has been one of the greatest joys of my life. Can't wait to celebrate with you both!",
    date: new Date('2025-11-20T14:30:00').toISOString(),
    likes: 24,
    photo: "https://images.unsplash.com/photo-1695141482705-7df6fb3df273",
    photoAlt: "Two young women laughing together at outdoor cafe with coffee cups on sunny day",
    coupleReply: language === 'es' ?
      "¡Sarah! Tus palabras nos llenan de alegría. Gracias por ser parte de nuestro viaje. ¡Te queremos!" : 
      "Sarah! Your words fill our hearts with joy. Thank you for being part of our journey. Love you!"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cb933d20-1763293416126.png",
    avatarAlt: "Professional headshot of Asian man with black hair wearing navy suit and glasses",
    relationship: language === 'es' ? 'Colega' : 'Colleague',
    category: language === 'es' ? 'Buenos Deseos' : 'Well Wishes',
    message: language === 'es' ?
      "Trabajar contigo ha sido un placer, pero verte tan feliz es aún mejor. Les deseo una vida llena de amor, risas y aventuras increíbles. ¡Felicidades a la hermosa pareja!" :
      "Working with you has been a pleasure, but seeing you this happy is even better. Wishing you both a lifetime filled with love, laughter, and amazing adventures. Congratulations to the beautiful couple!",
    date: new Date('2025-11-21T10:15:00').toISOString(),
    likes: 18
  },
  {
    id: 3,
    name: "María García",
    email: "maria.g@email.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19ad23742-1763295892621.png",
    avatarAlt: "Professional headshot of Hispanic woman with long dark hair wearing elegant red dress",
    relationship: language === 'es' ? 'Familia' : 'Family',
    category: language === 'es' ? 'Consejo' : 'Advice',
    message: language === 'es' ?
      "Mis queridos, el matrimonio es un viaje hermoso. Recuerden siempre comunicarse con amor, reír juntos todos los días y nunca irse a dormir enojados. Su amor es una inspiración para todos nosotros. ¡Los amamos profundamente!" :
      "My dear ones, marriage is a beautiful journey. Always remember to communicate with love, laugh together every day, and never go to bed angry. Your love is an inspiration to all of us. We love you deeply!",
    date: new Date('2025-11-22T16:45:00').toISOString(),
    likes: 42,
    photo: "https://images.unsplash.com/photo-1610507381659-3dc8612d5452",
    photoAlt: "Extended Hispanic family gathering around dinner table with warm lighting and smiling faces",
    coupleReply: language === 'es' ?
      "Tía María, tus consejos siempre han sido nuestra guía. Gracias por tu amor incondicional." :
      "Aunt María, your advice has always been our guide. Thank you for your unconditional love."
  }
];

// Load messages from localStorage
export const loadMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const messages = JSON.parse(stored);
      // Convert date strings back to Date objects
      return messages.map(msg => ({
        ...msg,
        date: new Date(msg.date)
      }));
    }
    // If no messages exist, initialize with default messages
    const initialMessages = getInitialMessages();
    saveMessages(initialMessages);
    return initialMessages.map(msg => ({
      ...msg,
      date: new Date(msg.date)
    }));
  } catch (error) {
    console.error('Error loading messages:', error);
    return getInitialMessages().map(msg => ({
      ...msg,
      date: new Date(msg.date)
    }));
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
