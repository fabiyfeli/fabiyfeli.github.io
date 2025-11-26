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
  const [currentLanguage, setCurrentLanguage] = useState('es');
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
      description: "A blind date from Tinder that changed everything.",
      fullDescription: "A blind date from Tinder that changed everything. We matched online and decided to meet in person at Cerro San Cristóbal. What started as a nervous first date turned into hours of laughter and connection. We talked until sunset, and neither of us wanted the day to end. From that moment, we knew something special was beginning.",
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
      description: "Just 3 months after meeting, we decided to live together.",
      fullDescription: "Just 3 months after meeting, my landlord ended my rent contract. When I told Fabi about it, she said 'why don't you come live with me?' without hesitation. It was a bold move, but it felt right. We turned her place in Barrio Yungay into our home. It was the beginning of building our life together, trusting our hearts over convention.",
      icon: "Home",
      image: "https://images.unsplash.com/photo-1585541676309-d149bdbe4261",
      imageAlt: "Charming Brooklyn brownstone apartment interior with exposed brick walls, vintage furniture, warm lighting, and couple unpacking boxes together",
      location: "Barrio Yungay, Santiago",
      quote: "Home is wherever I\'m with you"
    },
    {
      id: 3,
      date: "Winter 2022",
      title: "First International Adventure Together",
      description: "Our first trip abroad together - Mexico's warm waters.",
      fullDescription: "Our first international trip together was to Mexico. Fabi is originally from Venezuela and loves warm waters, something Chile doesn't have. We explored Cancún's beautiful beaches, swam in crystal-clear Caribbean waters, and created unforgettable memories. It was the perfect destination for us - combining adventure, relaxation, and Fabi's love for tropical paradise.",
      icon: "Plane",
      image: "/assets/images/hero-wedding.png",
      imageAlt: "Scenic coastal road with convertible car driving along ocean highway during golden hour sunset with waves crashing on sandy beach",
      location: "Cancún, México",
      quote: "Every adventure is better with you by my side"

    },
    {
      id: 4,
      date: "Fall 2023",
      title: "Our First Home Investment",
      description: "We each bought our first apartment - right next to each other.",
      fullDescription: "We each bought our first apartment, and incredibly, they're side by side. We're a couple and neighbors at the same time! This unique situation reflects our relationship perfectly - independent yet together, giving each other space while staying close. It's the best of both worlds, and it shows how we've built our life together in our own special way.",
      icon: "Users",
      image: "https://images.unsplash.com/photo-1591609168397-719e1674f180",
      imageAlt: "Warm family gathering around dining table with multiple generations sharing Thanksgiving meal, smiling faces, festive decorations, and abundant food",
      location: "Santiago, Chile",
      quote: "Together, yet independent - the perfect balance"
    },
    {
      id: 5,
      date: "Spring 2024",
      title: "The Proposal",
      description: "A proposal journey that started in Santiago and ended in Medellín.",
      fullDescription: "The proposal was an adventure across South America. It started in Santiago, continued through Rio de Janeiro, and culminated in Medellín, Colombia. Each city held special meaning for us, and the journey itself represented our relationship - full of surprises, spanning borders, and always moving forward together. When the moment finally came in Medellín, it was perfect.",
      icon: "Heart",
      image: "https://images.unsplash.com/photo-1731515672828-98558a463705",
      imageAlt: "Romantic marriage proposal scene in Central Park with man on one knee presenting engagement ring to surprised woman, cherry blossoms blooming, sunset golden light filtering through trees",
      location: "Santiago (Chile), Rio de Janeiro (Brasil) and Medellín (Colombia)",
      quote: "Forever started with a yes"
    },
    {
      id: 6,
      date: "January 2026",
      title: "Our Wedding Day",
      description: "Our wedding will be amazing - the celebration of our unique love story.",
      fullDescription: "Our wedding will be amazing! After years of adventures, bold decisions, and building our life together in our own way, we're ready to celebrate with everyone we love. From a Tinder blind date to neighbors with side-by-side apartments, our journey has been unconventional and perfect. This day will be a true reflection of us - full of love, joy, and the warmth of all who have supported us.",
      icon: "GemRing",
      image: "/assets/images/hero-wedding.png",
      imageAlt: "Elegant wedding ceremony setup with white chairs arranged in rows, floral arch decorated with roses and greenery, bride and groom exchanging vows under romantic lighting",
      location: "Santiago, Chile",
      quote: "Today, tomorrow, and forever"
    }],

    es: [
    {
      id: 1,
      date: "Primavera 2021",
      title: "El Primer Encuentro",
      description: "Una cita ciega de Tinder que cambió todo.",
      fullDescription: "Una cita ciega de Tinder que cambió todo. Hicimos match en línea y decidimos conocernos en persona en el Cerro San Cristóbal. Lo que comenzó como una primera cita nerviosa se convirtió en horas de risas y conexión. Hablamos hasta el atardecer, y ninguno de nosotros quería que el día terminara. Desde ese momento, supimos que algo especial estaba comenzando.",
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
      description: "Solo 3 meses después de conocernos, decidimos vivir juntos.",
      fullDescription: "Solo 3 meses después de conocernos, mi arrendador terminó mi contrato de arriendo. Cuando le conté a Fabi, me dijo '¿por qué no te vienes a vivir conmigo?' sin dudarlo. Fue una decisión audaz, pero se sintió correcta. Convertimos su lugar en el Barrio Yungay en nuestro hogar. Fue el comienzo de construir nuestra vida juntos, confiando en nuestros corazones por sobre las convenciones.",
      icon: "Home",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_15622788f-1764102468415.png",
      imageAlt: "Interior encantador de apartamento en casa de piedra rojiza de Brooklyn con paredes de ladrillo expuesto, muebles vintage, iluminación cálida y pareja desempacando cajas juntos",
      location: "Barrio Yungay, Santiago",
      quote: "El hogar es donde sea que esté contigo"
    },
    {
      id: 3,
      date: "Invierno 2022",
      title: "Primera Aventura Internacional",
      description: "Nuestro primer viaje al extranjero juntos - las aguas cálidas de México.",
      fullDescription: "Nuestro primer viaje internacional juntos fue a México. Fabi es originaria de Venezuela y ama las aguas cálidas, algo que no tenemos en Chile. Exploramos las hermosas playas de Cancún, nadamos en las cristalinas aguas del Caribe y creamos recuerdos inolvidables. Fue el destino perfecto para nosotros - combinando aventura, relajación y el amor de Fabi por el paraíso tropical.",
      icon: "Plane",
      image: "/assets/images/hero-wedding.png",
      imageAlt: "Carretera costera escénica con auto convertible conduciendo por autopista junto al océano durante atardecer dorado con olas rompiendo en playa arenosa",
      location: "Cancún, México",
      quote: "Cada aventura es mejor contigo a mi lado"
    },
    {
      id: 4,
      date: "Otoño 2023",
      title: "Nuestra Primera Inversión",
      description: "Cada uno compró su primer departamento - uno al lado del otro.",
      fullDescription: "Cada uno compró su primer departamento, e increíblemente, están uno al lado del otro. ¡Somos pareja y vecinos al mismo tiempo! Esta situación única refleja perfectamente nuestra relación - independientes pero juntos, dándonos espacio mientras permanecemos cerca. Es lo mejor de ambos mundos, y muestra cómo hemos construido nuestra vida juntos a nuestra propia manera especial.",
      icon: "Users",
      image: "https://images.unsplash.com/photo-1591609168397-719e1674f180",
      imageAlt: "Cálida reunión familiar alrededor de mesa de comedor con múltiples generaciones compartiendo comida de Acción de Gracias, rostros sonrientes, decoraciones festivas y comida abundante",
      location: "Santiago, Chile",
      quote: "Juntos, pero independientes - el equilibrio perfecto"
    },
    {
      id: 5,
      date: "Primavera 2024",
      title: "La Propuesta",
      description: "Un viaje de propuesta que comenzó en Santiago y terminó en Medellín.",
      fullDescription: "La propuesta fue una aventura a través de Sudamérica. Comenzó en Santiago, continuó por Río de Janeiro, y culminó en Medellín, Colombia. Cada ciudad tenía un significado especial para nosotros, y el viaje en sí representaba nuestra relación - llena de sorpresas, cruzando fronteras, y siempre avanzando juntos. Cuando el momento finalmente llegó en Medellín, fue perfecto.",
      icon: "Heart",
      image: "https://images.unsplash.com/photo-1617996085793-eaf9d2944083",
      imageAlt: "Escena romántica de propuesta de matrimonio en Central Park con hombre arrodillado presentando anillo de compromiso a mujer sorprendida, flores de cerezo floreciendo, luz dorada del atardecer filtrándose entre árboles",
      location: "Santiago (Chile), Rio de Janeiro (Brasil) and Medellín (Colombia)",
      quote: "Para siempre comenzó con un sí"
    },
    {
      id: 6,
      date: "Enero 2026",
      title: "Nuestro Día de Boda",
      description: "Nuestra boda será increíble - la celebración de nuestra historia de amor única.",
      fullDescription: "¡Nuestra boda será increíble! Después de años de aventuras, decisiones audaces y construir nuestra vida juntos a nuestra manera, estamos listos para celebrar con todos los que amamos. Desde una cita ciega de Tinder hasta vecinos con departamentos lado a lado, nuestro viaje ha sido poco convencional y perfecto. Este día será un verdadero reflejo de nosotros - lleno de amor, alegría y la calidez de todos los que nos han apoyado.",
      icon: "GemRing",
      image: "/assets/images/hero-wedding.png",
      imageAlt: "Elegante configuración de ceremonia de boda con sillas blancas dispuestas en filas, arco floral decorado con rosas y vegetación, novia y novio intercambiando votos bajo iluminación romántica",
      location: "Santiago, Chile",
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