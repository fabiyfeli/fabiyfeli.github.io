import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import Icon from '../../components/AppIcon';
import EventTimeline from './components/EventTimeline';
import VenueCard from './components/VenueCard';
import AccommodationCard from './components/AccommodationCard';
import DressCodeSection from './components/DressCodeSection';
import TravelGuide from './components/TravelGuide';
import FAQSection from './components/FAQSection';

const WeddingDetails = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  const content = {
    en: {
      pageTitle: "Wedding Details - Eternal Vows",
      heroTitle: "Wedding Details",
      heroSubtitle: "Everything you need to know for our special day",
      dateInfo: "Saturday, January 31, 2026",
      timelineTitle: "Event Timeline",
      timelineSubtitle: "Your guide to the day\'s celebrations",
      venuesTitle: "Venues",
      venuesSubtitle: "Where our celebration takes place",
      accommodationsTitle: "Accommodations",
      accommodationsSubtitle: "Comfortable stays for our guests",
      importantNote: "Important Information",
      noteContent: "Please RSVP by December 21, 2025 to help us finalize arrangements. We can't wait to celebrate with you!"
    },
    es: {
      pageTitle: "Detalles de la Boda - Eternal Vows",
      heroTitle: "Detalles de la Boda",
      heroSubtitle: "Todo lo que necesitas saber para nuestro día especial",
      dateInfo: "Sábado, 31 de Enero de 2026",
      timelineTitle: "Cronograma del Evento",
      timelineSubtitle: "Tu guía para las celebraciones del día",
      venuesTitle: "Lugares",
      venuesSubtitle: "Donde se lleva a cabo nuestra celebración",
      accommodationsTitle: "Alojamiento",
      accommodationsSubtitle: "Estancias cómodas para nuestros invitados",
      importantNote: "Información Importante",
      noteContent: "Por favor confirme su asistencia antes del 21 de diciembre de 2025 para ayudarnos a finalizar los arreglos. ¡No podemos esperar para celebrar con usted!"
    }
  };

  const venues = {
    en: [
    {
      id: 1,
      name: "Casona San Ignacio Reception",
      type: "Reception Venue",
      description: "A charming historic Chilean estate with beautiful gardens and elegant outdoor spaces. The perfect setting to welcome our guests and begin our celebration.",
      address: "Caupolicán 8611, Quilicura, Región Metropolitana, Chile",
      phone: "(56) 9 8551 7187",
      parking: "Free parking available in adjacent lot.",
      image: "public/assets/images/540782938_18279433261272715_2421666563502127504_n.jpg",
      imageAlt: "Elegant historic chapel interior with ornate stained glass windows, wooden pews, and vaulted ceiling creating intimate sacred atmosphere for wedding ceremony",
      lat: -33.34131260777949,
      lng: -70.69443605191101
    },
    {
      id: 2,
      name: "Casona San Ignacio Ballroom",
      type: "Dinner & Party Venue",
      description: "A sophisticated indoor venue with elegant lighting and spacious dance floor. Features refined décor and intimate ambiance, perfect for dinner and dancing the night away.",
      address: "Caupolicán 8611, Quilicura, Región Metropolitana, Chile",
      phone: "(56) 9 8551 7187",
      parking: "Complimentary parking for all guests.",
      image: "public/assets/images/481010412_18057267074042169_1913883596162477005_n.jpg",
      imageAlt: "Luxurious grand ballroom with sparkling crystal chandeliers, polished marble floors, elegant round tables with white linens, and floor-to-ceiling windows showcasing city skyline",
      lat: -33.34131260777949,
      lng: -70.69443605191101
    }],

    es: [
    {
      id: 1,
      name: "Recepción de la Casona San Ignacio",
      type: "Lugar de la Recepción",
      description: "Una encantadora casona histórica chilena con hermosos jardines y elegantes espacios al aire libre. El escenario perfecto para recibir a nuestros invitados y comenzar nuestra celebración.",
      address: "Caupolicán 8611, Quilicura, Región Metropolitana, Chile",
      phone: "(56) 9 8551 7187",
      parking: "Estacionamiento gratuito disponible en el lote adyacente.",
      image: "public/assets/images/540782938_18279433261272715_2421666563502127504_n.jpg",
      imageAlt: "Interior elegante de capilla histórica con ornamentados vitrales, bancos de madera y techo abovedado creando atmósfera sagrada íntima para ceremonia de boda",
      lat: -33.34131260777949,
      lng: -70.69443605191101
    },
    {
      id: 2,
      name: "Salón de Baile de la Casona San Ignacio",
      type: "Lugar de la Cena y Fiesta",
      description: "Un sofisticado espacio interior con iluminación elegante y amplia pista de baile. Cuenta con decoración refinada y ambiente íntimo, perfecto para cenar y bailar toda la noche.",
      address: "Caupolicán 8611, Quilicura, Región Metropolitana, Chile",
      phone: "(56) 9 8551 7187",
      parking: "Estacionamiento gratuito para todos los invitados.",
      image: "public/assets/images/481010412_18057267074042169_1913883596162477005_n.jpg",
      imageAlt: "Lujoso salón de baile con brillantes candelabros de cristal, pisos de mármol pulido, elegantes mesas redondas con manteles blancos y ventanas de piso a techo mostrando horizonte de la ciudad",
      lat: -33.34131260777949,
      lng: -70.69443605191101
    }]

  };

  const accommodations = {
    en: [
    {
      id: 1,
      name: "The Fairmont San Francisco",
      stars: 5,
      description: "Luxury hotel with elegant rooms, rooftop bar, and spa services. Walking distance to reception venue.",
      distance: "0.1 miles from reception",
      priceRange: "$250-400",
      phone: "(415) 555-0789",
      amenities: ["Free WiFi", "Spa", "Fitness Center", "Room Service"],
      groupRate: true,
      groupCode: "ETERNALVOWS2025",
      bookingUrl: "https://www.fairmont.com",
      image: "https://images.unsplash.com/photo-1629210435007-663c9f1b80b7",
      imageAlt: "Luxurious five-star hotel exterior with grand entrance, ornate architecture, and elegant facade illuminated at dusk with valet service visible",
      lat: 37.7919,
      lng: -122.4102
    },
    {
      id: 2,
      name: "Hotel Nikko San Francisco",
      stars: 4,
      description: "Modern hotel with comfortable rooms and excellent amenities. Convenient location near both venues.",
      distance: "1.5 miles from ceremony",
      priceRange: "$180-280",
      phone: "(415) 555-0321",
      amenities: ["Free WiFi", "Pool", "Restaurant", "Parking"],
      groupRate: true,
      groupCode: "VOWS2025",
      bookingUrl: "https://www.hotelnikkosf.com",
      image: "https://images.unsplash.com/photo-1639864190739-036c03760d40",
      imageAlt: "Contemporary four-star hotel building with modern glass and steel architecture, sleek entrance with revolving doors, and professional doorman greeting guests",
      lat: 37.7858,
      lng: -122.4064
    },
    {
      id: 3,
      name: "Courtyard by Marriott",
      stars: 3,
      description: "Comfortable and affordable option with clean rooms and friendly service. Great value for families.",
      distance: "2 miles from venues",
      priceRange: "$120-180",
      phone: "(415) 555-0654",
      amenities: ["Free WiFi", "Breakfast", "Fitness Center", "Free Parking"],
      groupRate: false,
      groupCode: null,
      bookingUrl: "https://www.marriott.com",
      image: "https://images.unsplash.com/photo-1733709225757-be2d7bbd8714",
      imageAlt: "Welcoming three-star hotel entrance with modern lobby visible through glass doors, comfortable seating area, and bright reception desk with friendly staff",
      lat: 37.7833,
      lng: -122.4167
    }],

    es: [
    {
      id: 1,
      name: "The Fairmont San Francisco",
      stars: 5,
      description: "Hotel de lujo con habitaciones elegantes, bar en la azotea y servicios de spa. A poca distancia del lugar de recepción.",
      distance: "0.1 millas de la recepción",
      priceRange: "$250-400",
      phone: "(415) 555-0789",
      amenities: ["WiFi Gratis", "Spa", "Gimnasio", "Servicio a la Habitación"],
      groupRate: true,
      groupCode: "ETERNALVOWS2025",
      bookingUrl: "https://www.fairmont.com",
      image: "https://images.unsplash.com/photo-1629210435007-663c9f1b80b7",
      imageAlt: "Exterior de hotel de lujo de cinco estrellas con entrada grandiosa, arquitectura ornamentada y fachada elegante iluminada al anochecer con servicio de valet visible",
      lat: 37.7919,
      lng: -122.4102
    },
    {
      id: 2,
      name: "Hotel Nikko San Francisco",
      stars: 4,
      description: "Hotel moderno con habitaciones cómodas y excelentes comodidades. Ubicación conveniente cerca de ambos lugares.",
      distance: "1.5 millas de la ceremonia",
      priceRange: "$180-280",
      phone: "(415) 555-0321",
      amenities: ["WiFi Gratis", "Piscina", "Restaurante", "Estacionamiento"],
      groupRate: true,
      groupCode: "VOWS2025",
      bookingUrl: "https://www.hotelnikkosf.com",
      image: "https://images.unsplash.com/photo-1639864190739-036c03760d40",
      imageAlt: "Edificio de hotel contemporáneo de cuatro estrellas con arquitectura moderna de vidrio y acero, entrada elegante con puertas giratorias y portero profesional saludando a los huéspedes",
      lat: 37.7858,
      lng: -122.4064
    },
    {
      id: 3,
      name: "Courtyard by Marriott",
      stars: 3,
      description: "Opción cómoda y asequible con habitaciones limpias y servicio amable. Gran valor para familias.",
      distance: "2 millas de los lugares",
      priceRange: "$120-180",
      phone: "(415) 555-0654",
      amenities: ["WiFi Gratis", "Desayuno", "Gimnasio", "Estacionamiento Gratis"],
      groupRate: false,
      groupCode: null,
      bookingUrl: "https://www.marriott.com",
      image: "https://images.unsplash.com/photo-1733709225757-be2d7bbd8714",
      imageAlt: "Entrada acogedora de hotel de tres estrellas con vestíbulo moderno visible a través de puertas de vidrio, área de estar cómoda y mostrador de recepción brillante con personal amable",
      lat: 37.7833,
      lng: -122.4167
    }]

  };

  const currentContent = content?.[language];
  const currentVenues = venues?.[language];
  const currentAccommodations = accommodations?.[language];

  return (
    <>
      <Helmet>
        <title>{currentContent?.pageTitle}</title>
        <meta name="description" content="Complete wedding details including ceremony and reception information, accommodations, travel guide, and FAQs for our special day." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="main-content">
          <div className="fixed top-24 right-4 z-40 flex gap-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              language === 'en' ? 'bg-primary text-white shadow-lg' : 'bg-card text-muted-foreground hover:bg-muted'}`
              }
              aria-label="Switch to English">

              EN
            </button>
            <button
              onClick={() => handleLanguageChange('es')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              language === 'es' ? 'bg-primary text-white shadow-lg' : 'bg-card text-muted-foreground hover:bg-muted'}`
              }
              aria-label="Cambiar a Español">

              ES
            </button>
          </div>

          <section className="relative py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 romantic-gradient" />
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 heartbeat">
                <Icon name="Calendar" size={40} color="var(--color-primary)" />
              </div>
              <h1 className="text-5xl md:text-6xl font-headline font-bold text-foreground mb-4">
                {currentContent?.heroTitle}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {currentContent?.heroSubtitle}
              </p>
              <div className="inline-flex items-center gap-3 bg-card px-8 py-4 rounded-full shadow-lg">
                <Icon name="CalendarDays" size={24} className="text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  {currentContent?.dateInfo}
                </span>
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-headline font-bold text-foreground mb-3">
                  {currentContent?.timelineTitle}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {currentContent?.timelineSubtitle}
                </p>
              </div>
              <EventTimeline language={language} />
            </div>
          </section>

          <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-headline font-bold text-foreground mb-3">
                  {currentContent?.venuesTitle}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {currentContent?.venuesSubtitle}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {currentVenues?.map((venue) =>
                <VenueCard key={venue?.id} venue={venue} language={language} />
                )}
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <DressCodeSection language={language} />
            </div>
          </section>

          <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-headline font-bold text-foreground mb-3">
                  {currentContent?.accommodationsTitle}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {currentContent?.accommodationsSubtitle}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {currentAccommodations?.map((accommodation) =>
                <AccommodationCard
                  key={accommodation?.id}
                  accommodation={accommodation}
                  language={language} />

                )}
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <TravelGuide language={language} />
            </div>
          </section>

          <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <FAQSection language={language} />
            </div>
          </section>

          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-brand-gold/10 rounded-2xl p-8 border-2 border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-cta rounded-full flex-shrink-0">
                    <Icon name="Bell" size={24} color="white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-foreground mb-2">
                      {currentContent?.importantNote}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {currentContent?.noteContent}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>);

};

export default WeddingDetails;