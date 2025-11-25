import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import Icon from '../../components/AppIcon';
import MessageCard from './components/MessageCard';
import MessageForm from './components/MessageForm';
import FilterBar from './components/FilterBar';
import StatsSection from './components/StatsSection';
import LanguageToggle from './components/LanguageToggle';

const GuestBook = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    relationship: 'all',
    search: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('wedding_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const mockMessages = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1985c262f-1763294244026.png",
      avatarAlt: "Professional headshot of blonde woman with warm smile wearing light blue blouse",
      relationship: currentLanguage === 'es' ? 'Amiga' : 'Friend',
      category: currentLanguage === 'es' ? 'Recuerdo Especial' : 'Special Memory',
      message: currentLanguage === 'es' ?
      "Recuerdo cuando nos conocimos en la universidad. Siempre supe que encontrarías a tu alma gemela. Ver tu amor florecer ha sido una de las mayores alegrías de mi vida. ¡No puedo esperar para celebrar con ustedes!" :
      "I remember when we first met in college. I always knew you would find your soulmate. Watching your love story unfold has been one of the greatest joys of my life. Can't wait to celebrate with you both!",
      date: new Date('2025-11-20T14:30:00'),
      likes: 24,
      photo: "https://images.unsplash.com/photo-1695141482705-7df6fb3df273",
      photoAlt: "Two young women laughing together at outdoor cafe with coffee cups on sunny day",
      coupleReply: currentLanguage === 'es' ?
      "¡Sarah! Tus palabras nos llenan de alegría. Gracias por ser parte de nuestro viaje. ¡Te queremos!" : "Sarah! Your words fill our hearts with joy. Thank you for being part of our journey. Love you!"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cb933d20-1763293416126.png",
      avatarAlt: "Professional headshot of Asian man with black hair wearing navy suit and glasses",
      relationship: currentLanguage === 'es' ? 'Colega' : 'Colleague',
      category: currentLanguage === 'es' ? 'Buenos Deseos' : 'Well Wishes',
      message: currentLanguage === 'es' ?
      "Trabajar contigo ha sido un placer, pero verte tan feliz es aún mejor. Les deseo una vida llena de amor, risas y aventuras increíbles. ¡Felicidades a la hermosa pareja!" :
      "Working with you has been a pleasure, but seeing you this happy is even better. Wishing you both a lifetime filled with love, laughter, and amazing adventures. Congratulations to the beautiful couple!",
      date: new Date('2025-11-21T10:15:00'),
      likes: 18
    },
    {
      id: 3,
      name: "María García",
      email: "maria.g@email.com",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19ad23742-1763295892621.png",
      avatarAlt: "Professional headshot of Hispanic woman with long dark hair wearing elegant red dress",
      relationship: currentLanguage === 'es' ? 'Familia' : 'Family',
      category: currentLanguage === 'es' ? 'Consejo' : 'Advice',
      message: currentLanguage === 'es' ?
      "Mis queridos, el matrimonio es un viaje hermoso. Recuerden siempre comunicarse con amor, reír juntos todos los días y nunca irse a dormir enojados. Su amor es una inspiración para todos nosotros. ¡Los amamos profundamente!" :
      "My dear ones, marriage is a beautiful journey. Always remember to communicate with love, laugh together every day, and never go to bed angry. Your love is an inspiration to all of us. We love you deeply!",
      date: new Date('2025-11-22T16:45:00'),
      likes: 42,
      photo: "https://images.unsplash.com/photo-1610507381659-3dc8612d5452",
      photoAlt: "Extended Hispanic family gathering around dinner table with warm lighting and smiling faces",
      coupleReply: currentLanguage === 'es' ?
      "Tía María, tus consejos siempre han sido nuestra guía. Gracias por tu amor incondicional." :
      "Aunt María, your advice has always been our guide. Thank you for your unconditional love."
    },
    {
      id: 4,
      name: "David Thompson",
      email: "d.thompson@email.com",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e893ff19-1763296800030.png",
      avatarAlt: "Professional headshot of Caucasian man with brown hair wearing casual blue shirt",
      relationship: currentLanguage === 'es' ? 'Amigo' : 'Friend',
      category: currentLanguage === 'es' ? 'Felicitaciones' : 'Congratulations',
      message: currentLanguage === 'es' ?
      "¡Hermano! Desde nuestros días de escuela hasta ahora, has sido mi mejor amigo. Ver cómo has encontrado tu felicidad me llena de orgullo. ¡Que su amor crezca más fuerte cada día!" :
      "Bro! From our school days to now, you've been my best friend. Seeing you find your happiness fills me with pride. May your love grow stronger with each passing day!",
      date: new Date('2025-11-23T09:20:00'),
      likes: 31
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c56710a9-1763300346689.png",
      avatarAlt: "Professional headshot of young woman with curly brown hair wearing white blouse",
      relationship: currentLanguage === 'es' ? 'Familia' : 'Family',
      category: currentLanguage === 'es' ? 'Recuerdo Especial' : 'Special Memory',
      message: currentLanguage === 'es' ?
      "Prima, recuerdo cuando éramos niñas y soñábamos con nuestras bodas. Ver tu sueño hacerse realidad es mágico. Tu novio es increíble y juntos son perfectos. ¡Los amo a ambos!" :
      "Cousin, I remember when we were little girls dreaming about our weddings. Seeing your dream come true is magical. Your fiancé is amazing and together you're perfect. Love you both!",
      date: new Date('2025-11-23T18:30:00'),
      likes: 27,
      photo: "https://images.unsplash.com/photo-1695152979271-a8927a3b2700",
      photoAlt: "Two young women in white dresses sitting on grass laughing together at outdoor wedding venue"
    },
    {
      id: 6,
      name: "James Wilson",
      email: "j.wilson@email.com",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1faa738ad-1763294932464.png",
      avatarAlt: "Professional headshot of African American man with short hair wearing formal black suit",
      relationship: currentLanguage === 'es' ? 'Colega' : 'Colleague',
      category: currentLanguage === 'es' ? 'Buenos Deseos' : 'Well Wishes',
      message: currentLanguage === 'es' ?
      "Es un honor ser parte de este día especial. Su amor y dedicación mutua son evidentes en todo lo que hacen. Les deseo toda la felicidad del mundo. ¡Felicidades!" :
      "It's an honor to be part of this special day. Your love and dedication to each other is evident in everything you do. Wishing you all the happiness in the world. Congratulations!",
      date: new Date('2025-11-24T11:00:00'),
      likes: 15
    },
    {
      id: 7,
      name: "Isabella Martínez",
      email: "isabella.m@email.com",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1beb85774-1763294878934.png",
      avatarAlt: "Professional headshot of young Hispanic woman with long black hair wearing elegant pink dress",
      relationship: currentLanguage === 'es' ? 'Amiga' : 'Friend',
      category: currentLanguage === 'es' ? 'Consejo' : 'Advice',
      message: currentLanguage === 'es' ?
      "Queridos amigos, el secreto de un matrimonio feliz es mantener viva la chispa. Sigan teniendo citas, sorpréndanse mutuamente y nunca dejen de cortejarse. Su amor es hermoso. ¡Bendiciones!" :
      "Dear friends, the secret to a happy marriage is keeping the spark alive. Keep dating each other, surprise one another, and never stop courting. Your love is beautiful. Blessings!",
      date: new Date('2025-11-24T15:45:00'),
      likes: 22
    },
    {
      id: 8,
      name: "Robert Anderson",
      email: "r.anderson@email.com",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ee6ab722-1763294988340.png",
      avatarAlt: "Professional headshot of middle-aged man with gray hair wearing formal gray suit",
      relationship: currentLanguage === 'es' ? 'Familia' : 'Family',
      category: currentLanguage === 'es' ? 'Felicitaciones' : 'Congratulations',
      message: currentLanguage === 'es' ?
      "Como su tío, he visto crecer su amor desde el principio. Es un privilegio ver cómo se convierten en esposos. Que Dios bendiga su unión con amor eterno y felicidad sin fin." : "As your uncle, I've watched your love grow from the beginning. It's a privilege to see you become husband and wife. May God bless your union with eternal love and endless happiness.",
      date: new Date('2025-11-25T08:30:00'),
      likes: 35,
      photo: "https://images.unsplash.com/photo-1732269224039-b476095df44a",
      photoAlt: "Extended family group photo at outdoor gathering with multiple generations smiling together"
    }];


    setMessages(mockMessages);
    setFilteredMessages(mockMessages);
  }, [currentLanguage]);

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

  const handleSubmitMessage = (formData) => {
    const newMessage = {
      id: messages?.length + 1,
      name: formData?.name,
      email: formData?.email,
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b47d599d-1763299033167.png",
      avatarAlt: "Default avatar showing friendly person with warm smile",
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
      date: new Date(),
      likes: 0,
      photo: formData?.photo ? URL.createObjectURL(formData?.photo) : null,
      photoAlt: formData?.photo ? "Guest uploaded photo shared with wedding message" : null
    };

    setMessages((prev) => [newMessage, ...prev]);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReply = (messageId, replyText) => {
    setMessages((prev) => prev?.map((msg) =>
    msg?.id === messageId ?
    { ...msg, coupleReply: replyText } :
    msg
    ));
  };

  const stats = {
    totalMessages: messages?.length,
    uniqueGuests: messages?.length,
    photosShared: messages?.filter((m) => m?.photo)?.length,
    totalLikes: messages?.reduce((sum, m) => sum + (m?.likes || 0), 0)
  };

  const content = {
    en: {
      title: "Guest Book - Eternal Vows",
      heading: "Guest Book",
      subheading: "Share Your Love & Memories",
      description: "Leave your heartfelt messages, share cherished memories, and express your excitement for our special day. Your words mean the world to us!",
      writeMessage: "Write a Message",
      viewMessages: "View All Messages",
      noMessages: "No messages found",
      noMessagesDesc: "Be the first to leave a message!"
    },
    es: {
      title: "Libro de Invitados - Eternal Vows",
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