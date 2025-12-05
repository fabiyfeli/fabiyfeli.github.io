import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import Icon from '../../components/AppIcon';
import MessageCard from './components/MessageCard';
import MessageForm from './components/MessageForm';
import FilterBar from './components/FilterBar';
import StatsSection from './components/StatsSection';
import LanguageToggle from './components/LanguageToggle';
import { 
  loadMessages, 
  addMessage, 
  toggleLike, 
  updateMessage,
  addMessageHybrid,
  loadMessagesFromGitHub,
  syncWithGitHub
} from '../../utils/guestBookStorage';

const GuestBook = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    relationship: 'all',
    search: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ syncing: false, message: '' });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Load messages from localStorage first (fast)
    const loadedMessages = loadMessages();
    setMessages(loadedMessages);
    setFilteredMessages(loadedMessages);
    
    // Try to load from GitHub in background (slower but has all messages)
    loadMessagesFromGitHub()
      .then(githubMessages => {
        if (githubMessages.length > 0) {
          // Merge with local messages
          const localIds = new Set(loadedMessages.map(m => m.githubUrl).filter(Boolean));
          const newFromGitHub = githubMessages.filter(m => !localIds.has(m.githubUrl));
          
          if (newFromGitHub.length > 0) {
            const merged = [...githubMessages, ...loadedMessages.filter(m => !m.githubUrl)];
            setMessages(merged);
            setFilteredMessages(merged);
            console.log(`Loaded ${githubMessages.length} messages from GitHub`);
          }
        }
      })
      .catch(error => {
        console.error('Failed to load from GitHub, using local storage only:', error);
      });
  }, []);

  // Removed old mock messages - now using localStorage

  useEffect(() => {
    // This useEffect is no longer needed but kept for reference
    const skipMockMessages = [
    {}];
    // Mock messages code kept above for reference but not used
  }, []);

  useEffect(() => {
    let filtered = [...messages];

    if (filters?.category !== 'all') {
      const categoryMap = {
        'memory': currentLanguage === 'es' ? 'Recuerdo Especial' : 'Special Memory',
        'wish': currentLanguage === 'es' ? 'Buenos Deseos' : 'Well Wishes',
        'advice': currentLanguage === 'es' ? 'Consejo' : 'Advice',
        'congratulations': currentLanguage === 'es' ? 'Felicitaciones' : 'Congratulations'
      };
      filtered = filtered?.filter((msg) => msg?.category === categoryMap?.[filters?.category]);
    }

    if (filters?.relationship !== 'all') {
      const relationshipMap = {
        'family': currentLanguage === 'es' ? 'Familia' : 'Family',
        'friend': currentLanguage === 'es' ? 'Amigo' : 'Friend',
        'colleague': currentLanguage === 'es' ? 'Colega' : 'Colleague'
      };
      filtered = filtered?.filter((msg) => msg?.relationship === relationshipMap?.[filters?.relationship]);
    }

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter((msg) =>
      msg?.name?.toLowerCase()?.includes(searchLower) ||
      msg?.message?.toLowerCase()?.includes(searchLower)
      );
    }

    setFilteredMessages(filtered);
  }, [filters, messages, currentLanguage]);

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('wedding_language', lang);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleSearchChange = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleSubmitMessage = async (formData) => {
    const newMessageData = {
      name: formData?.name,
      email: formData?.email,
      relationship: formData?.relationship === 'family' ?
        currentLanguage === 'es' ? 'Familia' : 'Family' :
        formData?.relationship === 'friend' ?
        currentLanguage === 'es' ? 'Amigo' : 'Friend' :
        formData?.relationship === 'colleague' ?
        currentLanguage === 'es' ? 'Colega' : 'Colleague' :
        currentLanguage === 'es' ? 'Otro' : 'Other',
      category: formData?.category ?
        formData?.category === 'memory' ?
        currentLanguage === 'es' ? 'Recuerdo Especial' : 'Special Memory' :
        formData?.category === 'wish' ?
        currentLanguage === 'es' ? 'Buenos Deseos' : 'Well Wishes' :
        formData?.category === 'advice' ?
        currentLanguage === 'es' ? 'Consejo' : 'Advice' :
        currentLanguage === 'es' ? 'Felicitaciones' : 'Congratulations' :
        '',
      message: formData?.message,
      photo: formData?.photo ? URL.createObjectURL(formData?.photo) : null,
      photoAlt: formData?.photo ? "Guest uploaded photo shared with wedding message" : null,
      language: currentLanguage
    };

    // Show syncing status
    setSyncStatus({ syncing: true, message: 'Guardando mensaje...' });

    // Add message to localStorage + Firebase (immediate)
    const savedMessage = await addMessage(newMessageData);
    
    // Try to sync to GitHub (get token from admin if available)
    const githubToken = localStorage.getItem('github_token');
    if (githubToken) {
      try {
        await addMessageHybrid(newMessageData, githubToken);
        setSyncStatus({ syncing: false, message: '✓ Mensaje guardado y sincronizado' });
        setTimeout(() => setSyncStatus({ syncing: false, message: '' }), 3000);
      } catch (error) {
        console.error('Failed to sync to GitHub:', error);
        setSyncStatus({ syncing: false, message: '✓ Mensaje guardado localmente' });
        setTimeout(() => setSyncStatus({ syncing: false, message: '' }), 3000);
      }
    } else {
      setSyncStatus({ syncing: false, message: '✓ Mensaje guardado' });
      setTimeout(() => setSyncStatus({ syncing: false, message: '' }), 2000);
    }
    
    // Reload messages from storage
    const updatedMessages = loadMessages();
    setMessages(updatedMessages);
    setFilteredMessages(updatedMessages);
    
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReply = (messageId, replyData) => {
    const messages = loadMessages();
    const message = messages.find(msg => msg.id === messageId);
    
    if (message) {
      // Initialize replies array if it doesn't exist
      const replies = message.replies || [];
      
      // Add new reply
      const newReply = {
        text: replyData.text,
        isCouple: replyData.isCouple,
        replierName: replyData.replierName,
        date: new Date().toISOString()
      };
      
      replies.push(newReply);
      
      // Update message in localStorage
      updateMessage(messageId, { replies });
    }
    
    // Reload messages from storage
    const updatedMessages = loadMessages();
    setMessages(updatedMessages);
    setFilteredMessages(updatedMessages);
  };

  const handleLike = (messageId) => {
    // Toggle like in localStorage
    toggleLike(messageId);
    
    // Reload messages from storage
    const updatedMessages = loadMessages();
    setMessages(updatedMessages);
    setFilteredMessages(updatedMessages);
  };

  const stats = {
    totalMessages: messages?.length,
    uniqueGuests: messages?.length,
    photosShared: messages?.filter((m) => m?.photo)?.length,
    totalLikes: messages?.reduce((sum, m) => sum + (m?.likes || 0), 0)
  };

  const content = {
    en: {
      title: "Guest Book - Fabi & Feli",
      heading: "Guest Book",
      subheading: "Share Your Love & Memories",
      description: "Leave your heartfelt messages, share cherished memories, and express your excitement for our special day. Your words mean the world to us!",
      writeMessage: "Write a Message",
      viewMessages: "View All Messages",
      noMessages: "No messages found",
      noMessagesDesc: "Be the first to leave a message!"
    },
    es: {
      title: "Libro de Invitados - Fabi & Feli",
      heading: "Libro de Invitados",
      subheading: "Comparte tu Amor y Recuerdos",
      description: "Deja tus mensajes sinceros, comparte recuerdos preciados y expresa tu emoción por nuestro día especial. ¡Tus palabras significan el mundo para nosotros!",
      writeMessage: "Escribir un Mensaje",
      viewMessages: "Ver Todos los Mensajes",
      noMessages: "No se encontraron mensajes",
      noMessagesDesc: "¡Sé el primero en dejar un mensaje!"
    }
  };

  const t = content?.[currentLanguage];

  return (
    <>
      <Helmet>
        <title>{t?.title}</title>
        <meta name="description" content={t?.description} />
      </Helmet>
      <Header />
      <div className="main-content min-h-screen bg-background">
        <div className="romantic-gradient py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                  <Icon name="BookHeart" size={20} color="var(--color-primary)" />
                  <span className="text-sm font-medium text-primary">{t?.heading}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-headline font-bold text-foreground mb-4">
                  {t?.subheading}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {t?.description}
                </p>
              </div>
              <LanguageToggle
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange} />

            </div>

            <StatsSection stats={stats} currentLanguage={currentLanguage} />

            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-cta text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

                <Icon name={showForm ? "X" : "PenLine"} size={20} />
                <span>{showForm ? t?.viewMessages : t?.writeMessage}</span>
              </button>
            </div>

            {showForm ?
            <div className="max-w-3xl mx-auto mb-12">
                <MessageForm
                onSubmit={handleSubmitMessage}
                currentLanguage={currentLanguage} />

              </div> :

            <>
                <FilterBar
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
                currentLanguage={currentLanguage}
                totalMessages={filteredMessages?.length} />


                {filteredMessages?.length > 0 ?
              <div className="space-y-6">
                    {filteredMessages?.map((message) =>
                <MessageCard
                  key={message?.id}
                  message={message}
                  onReply={handleReply}
                  onLike={handleLike}
                  currentLanguage={currentLanguage} />

                )}
                  </div> :

              <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Icon name="MessageSquare" size={40} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{t?.noMessages}</h3>
                    <p className="text-muted-foreground">{t?.noMessagesDesc}</p>
                  </div>
              }
              </>
            }
          </div>
        </div>
      </div>
    </>);

};

export default GuestBook;