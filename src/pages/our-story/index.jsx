import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import StoryHero from './components/StoryHero';
import LanguageToggle from './components/LanguageToggle';
import TimelineEvent from './components/TimelineEvent';
import MobileTimelineEvent from './components/MobileTimelineEvent';
import StoryStats from './components/StoryStats';
import FutureVision from './components/FutureVision';
import Icon from '../../components/AppIcon';

const OurStory = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const timelineEvents = {
    en: [
    {
      id: 1,
      date: "Spring 2021",
      title: "The First Meeting",
      description: "Our paths crossed at a mutual friend\'s art gallery opening in Manhattan.",
      fullDescription: "Our paths crossed at a mutual friend's art gallery opening in Manhattan. Among the crowd and the artwork, our eyes met across the room. What started as a casual conversation about abstract art turned into hours of deep connection. We talked until the gallery closed, and neither of us wanted the night to end.",
      icon: "Sparkles",
      image: "public/assets/images/0001245_teleferico-doble-oasis_415.webp",
      imageAlt: "Elegant art gallery interior with modern paintings on white walls, soft ambient lighting, and well-dressed couple having conversation near abstract artwork",
      location: "Cerro San Cristobal, Santiago",
      quote: "It felt like I had known you my entire life"
    },
    {
      id: 2,
      date: "Summer 2021",
      title: "Moving In Together",
      description: "We found our first home together in Brooklyn.",
      fullDescription: "We found our first home together in Brooklyn. A cozy brownstone apartment that we turned into our sanctuary. We spent weekends painting walls, arranging furniture, and creating a space that reflected both of us. It was the beginning of building our life together, one room at a time.",
      icon: "Home",
      image: "https://images.unsplash.com/photo-1585541676309-d149bdbe4261",
      imageAlt: "Charming Brooklyn brownstone apartment interior with exposed brick walls, vintage furniture, warm lighting, and couple unpacking boxes together",
      location: "Brooklyn, New York",
      quote: "Home is wherever I\'m with you"
    },
    {
      id: 3,
      date: "Winter 2020",
      title: "First Adventure Together",
      description: "A spontaneous road trip to the Hamptons that sealed our connection.",
      fullDescription: "A spontaneous road trip to the Hamptons that sealed our connection. We packed our bags on a Friday afternoon and drove with no real plan, just the desire to spend time together. We watched the sunset on the beach, shared our dreams under the stars, and realized we wanted to share all our adventures together.",
      icon: "Plane",
      image: "/assets/images/hero-wedding.png",
      imageAlt: "Scenic coastal road with convertible car driving along ocean highway during golden hour sunset with waves crashing on sandy beach",
      location: "The Hamptons, New York",
      quote: "Every adventure is better with you by my side"

    },
    {
      id: 4,
      date: "Fall 2021",
      title: "Meeting the Families",
      description: "Thanksgiving brought our families together for the first time.",
      fullDescription: "Thanksgiving brought our families together for the first time. We hosted both families at our apartment, blending traditions and creating new ones. Watching our loved ones connect and seeing the joy on everyone's faces confirmed what we already knew - we were meant to be a family.",
      icon: "Users",
      image: "https://images.unsplash.com/photo-1591609168397-719e1674f180",
      imageAlt: "Warm family gathering around dining table with multiple generations sharing Thanksgiving meal, smiling faces, festive decorations, and abundant food",
      location: "Our Home, Brooklyn",
      quote: "Two families becoming one"
    },
    {
      id: 5,
      date: "Spring 2022",
      title: "The Proposal",
      description: "A surprise proposal in Central Park where our story began.",
      fullDescription: "A surprise proposal in Central Park where our story began. I planned everything meticulously, choosing the spot where we had our first picnic. As the sun set and the park glowed with golden light, I got down on one knee. When you said yes, it was the happiest moment of my life. Our journey from that first meeting to this moment felt like destiny.",
      icon: "Heart",
      image: "https://images.unsplash.com/photo-1731515672828-98558a463705",
      imageAlt: "Romantic marriage proposal scene in Central Park with man on one knee presenting engagement ring to surprised woman, cherry blossoms blooming, sunset golden light filtering through trees",
      location: "Central Park, New York",
      quote: "Forever started with a yes"
    },
    {
      id: 6,
      date: "December 2025",
      title: "Our Wedding Day",
      description: "The day we officially become husband and wife, surrounded by love.",
      fullDescription: "The day we officially become husband and wife, surrounded by love. After years of building our relationship, creating memories, and growing together, we're ready to make our commitment official. We can't wait to celebrate this milestone with all the people who have supported us along the way.",
      icon: "Chapel",
      image: "/assets/images/hero-wedding.png",
      imageAlt: "Elegant wedding ceremony setup with white chairs arranged in rows, floral arch decorated with roses and greenery, bride and groom exchanging vows under romantic lighting",
      location: "New York, USA",
      quote: "Today, tomorrow, and forever"
    }],

    es: [
    {
      id: 1,
      date: "Primavera 2021",
      title: "El Primer Encuentro",
      description: "Nuestros caminos se cruzaron en la inauguración de una galería de arte de un amigo mutuo en Manhattan.",
      fullDescription: "Nuestros caminos se cruzaron en la inauguración de una galería de arte de un amigo mutuo en Manhattan. Entre la multitud y las obras de arte, nuestros ojos se encontraron al otro lado de la sala. Lo que comenzó como una conversación casual sobre arte abstracto se convirtió en horas de conexión profunda. Hablamos hasta que la galería cerró, y ninguno de nosotros quería que la noche terminara.",
      icon: "Sparkles",
      image: "public/assets/images/0001245_teleferico-doble-oasis_415.webp",
      imageAlt: "Interior elegante de galería de arte con pinturas modernas en paredes blancas, iluminación ambiental suave y pareja bien vestida conversando cerca de obra de arte abstracta",
      location: "Cerro San Cristobal, Santiago",
      quote: "Sentí como si te hubiera conocido toda mi vida"
    },
    {
      id: 2,
      date: "Verano 2021",
      title: "Mudándonos Juntos",
      description: "Encontramos nuestro primer hogar juntos en Brooklyn.",
      fullDescription: "Encontramos nuestro primer hogar juntos en Brooklyn. Un acogedor apartamento en una casa de piedra rojiza que convertimos en nuestro santuario. Pasamos fines de semana pintando paredes, arreglando muebles y creando un espacio que nos reflejaba a ambos. Fue el comienzo de construir nuestra vida juntos, una habitación a la vez.",
      icon: "Home",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_15622788f-1764102468415.png",
      imageAlt: "Interior encantador de apartamento en casa de piedra rojiza de Brooklyn con paredes de ladrillo expuesto, muebles vintage, iluminación cálida y pareja desempacando cajas juntos",
      location: "Brooklyn, Nueva York",
      quote: "El hogar es donde sea que esté contigo"
    },
    {
      id: 3,
      date: "Invierno 2020",
      title: "Primera Aventura Juntos",
      description: "Un viaje espontáneo por carretera a los Hamptons que selló nuestra conexión.",
      fullDescription: "Un viaje espontáneo por carretera a los Hamptons que selló nuestra conexión. Empacamos nuestras maletas un viernes por la tarde y condujimos sin un plan real, solo el deseo de pasar tiempo juntos. Vimos la puesta de sol en la playa, compartimos nuestros sueños bajo las estrellas y nos dimos cuenta de que queríamos compartir todas nuestras aventuras juntos.",
      icon: "Plane",
      image: "/assets/images/hero-wedding.png",
      imageAlt: "Carretera costera escénica con auto convertible conduciendo por autopista junto al océano durante atardecer dorado con olas rompiendo en playa arenosa",
      location: "Los Hamptons, Nueva York",
      quote: "Cada aventura es mejor contigo a mi lado"
    },
    {
      id: 4,
      date: "Otoño 2021",
      title: "Conociendo a las Familias",
      description: "El Día de Acción de Gracias reunió a nuestras familias por primera vez.",
      fullDescription: "El Día de Acción de Gracias reunió a nuestras familias por primera vez. Recibimos a ambas familias en nuestro apartamento, mezclando tradiciones y creando nuevas. Ver a nuestros seres queridos conectarse y ver la alegría en los rostros de todos confirmó lo que ya sabíamos: estábamos destinados a ser una familia.",
      icon: "Users",
      image: "https://images.unsplash.com/photo-1591609168397-719e1674f180",
      imageAlt: "Cálida reunión familiar alrededor de mesa de comedor con múltiples generaciones compartiendo comida de Acción de Gracias, rostros sonrientes, decoraciones festivas y comida abundante",
      location: "Nuestro Hogar, Brooklyn",
      quote: "Dos familias convirtiéndose en una"
    },
    {
      id: 5,
      date: "Primavera 2022",
      title: "La Propuesta",
      description: "Una propuesta sorpresa en Central Park donde comenzó nuestra historia.",
      fullDescription: "Una propuesta sorpresa en Central Park donde comenzó nuestra historia. Planifiqué todo meticulosamente, eligiendo el lugar donde tuvimos nuestro primer picnic. Mientras el sol se ponía y el parque brillaba con luz dorada, me arrodillé. Cuando dijiste que sí, fue el momento más feliz de mi vida. Nuestro viaje desde ese primer encuentro hasta este momento se sintió como el destino.",
      icon: "Heart",
      image: "https://images.unsplash.com/photo-1617996085793-eaf9d2944083",
      imageAlt: "Escena romántica de propuesta de matrimonio en Central Park con hombre arrodillado presentando anillo de compromiso a mujer sorprendida, flores de cerezo floreciendo, luz dorada del atardecer filtrándose entre árboles",
      location: "Central Park, Nueva York",
      quote: "Para siempre comenzó con un sí"
    },
    {
      id: 6,
      date: "Diciembre 2025",
      title: "Nuestro Día de Boda",
      description: "El día en que oficialmente nos convertimos en esposo y esposa, rodeados de amor.",
      fullDescription: "El día en que oficialmente nos convertimos en esposo y esposa, rodeados de amor. Después de años de construir nuestra relación, crear recuerdos y crecer juntos, estamos listos para hacer oficial nuestro compromiso. No podemos esperar para celebrar este hito con todas las personas que nos han apoyado en el camino.",
      icon: "GemRing",
      image: "/assets/images/hero-wedding.png",
      imageAlt: "Elegante configuración de ceremonia de boda con sillas blancas dispuestas en filas, arco floral decorado con rosas y vegetación, novia y novio intercambiando votos bajo iluminación romántica",
      location: "Nueva York, EE.UU.",
      quote: "Hoy, mañana y para siempre"
    }]

  };

  const events = timelineEvents?.[currentLanguage];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Our Story - Eternal Vows | A Journey of Love</title>
        <meta name="description" content="Discover the beautiful love story of our journey together, from first meeting to forever. Interactive timeline with photos and memories." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <LanguageToggle
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange} />


        <main className="main-content">
          <StoryHero currentLanguage={currentLanguage} />
          <StoryStats currentLanguage={currentLanguage} />

          <div className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-3">
                  {currentLanguage === 'en' ? 'Our Journey Together' : 'Nuestro Viaje Juntos'}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {currentLanguage === 'en' ? 'Every moment has led us to this beautiful day' : 'Cada momento nos ha llevado a este hermoso día'}
                </p>
              </div>

              {isMobile ?
              <div className="space-y-8">
                  {events?.map((event) =>
                <MobileTimelineEvent key={event?.id} event={event} />
                )}
                </div> :

              <div className="relative">
                  {events?.map((event, index) =>
                <TimelineEvent
                  key={event?.id}
                  event={event}
                  index={index}
                  isLeft={index % 2 === 0} />

                )}
                </div>
              }
            </div>
          </div>

          <FutureVision currentLanguage={currentLanguage} />

          <div className="bg-gradient-to-r from-primary/10 via-secondary to-accent/10 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4 heartbeat">
                <Icon name="Heart" size={32} color="var(--color-primary)" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-headline font-bold text-foreground mb-4">
                {currentLanguage === 'en' ? 'Join Us in Celebrating Our Love' : 'Únete a Nosotros para Celebrar Nuestro Amor'}
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                {currentLanguage === 'en' ? 'Your presence would mean the world to us as we begin this new chapter' : 'Tu presencia significaría el mundo para nosotros mientras comenzamos este nuevo capítulo'}
              </p>
            </div>
          </div>
        </main>

        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 elegant-hover"
          aria-label="Scroll to top">

          <Icon name="ArrowUp" size={24} />
        </button>
      </div>
    </>);

};

export default OurStory;