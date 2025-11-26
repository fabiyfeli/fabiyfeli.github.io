import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import GalleryHeader from './components/GalleryHeader';
import GalleryFilters from './components/GalleryFilters';
import PhotoCard from './components/PhotoCard';
import PhotoModal from './components/PhotoModal';
import TimelineSection from './components/TimelineSection';
import ShareSection from './components/ShareSection';
import Icon from '../../components/AppIcon';

const PhotoGallery = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeYear, setActiveYear] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  const categories = [
  {
    id: 'first-dates',
    label: { en: 'First Dates', es: 'Primeras Citas' },
    icon: 'Coffee',
    count: 18
  },
  {
    id: 'adventures',
    label: { en: 'Adventures', es: 'Aventuras' },
    icon: 'Mountain',
    count: 32
  },
  {
    id: 'celebrations',
    label: { en: 'Celebrations', es: 'Celebraciones' },
    icon: 'PartyPopper',
    count: 24
  },
  {
    id: 'everyday',
    label: { en: 'Everyday Moments', es: 'Momentos Cotidianos' },
    icon: 'Home',
    count: 41
  },
  {
    id: 'engagement',
    label: { en: 'Engagement', es: 'Compromiso' },
    icon: 'Ring',
    count: 35
  }];


  const photos = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1696040264528-33ae4bdbe276",
    imageAlt: "Happy couple laughing together during sunset at beach with golden hour lighting and ocean waves in background",
    title: currentLanguage === 'en' ? "First Beach Sunset" : "Primera Puesta de Sol en la Playa",
    description: currentLanguage === 'en' ?
    "Our first sunset together at Santa Monica Beach, where we talked for hours about our dreams and future." :
    "Nuestra primera puesta de sol juntos en la playa de Santa Monica, donde hablamos durante horas sobre nuestros sueños y futuro.",
    date: "March 15, 2020",
    location: "Santa Monica, CA",
    category: "first-dates",
    year: 2020,
    likes: 142
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1663405853656-ca6e9352ac8e",
    imageAlt: "Romantic couple embracing in urban park with autumn leaves falling around them and warm afternoon sunlight",
    title: currentLanguage === 'en' ? "Autumn Romance" : "Romance de Otoño",
    description: currentLanguage === 'en' ?
    "A perfect autumn day in Central Park, surrounded by golden leaves and endless laughter." : "Un día perfecto de otoño en Central Park, rodeados de hojas doradas y risas interminables.",
    date: "October 22, 2020",
    location: "New York, NY",
    category: "first-dates",
    year: 2020,
    likes: 198
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1654498904980-13c4c72cac32",
    imageAlt: "Couple hiking together on mountain trail with backpacks, surrounded by pine trees and mountain peaks in distance",
    title: currentLanguage === 'en' ? "Mountain Adventure" : "Aventura en la Montaña",
    description: currentLanguage === 'en' ?
    "Conquering our first mountain together in Yosemite, proving we can overcome any challenge as a team." : "Conquistando nuestra primera montaña juntos en Yosemite, demostrando que podemos superar cualquier desafío como equipo.",
    date: "June 8, 2021",
    location: "Yosemite, CA",
    category: "adventures",
    year: 2021,
    likes: 215
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1576990049894-3daacf397a61",
    imageAlt: "Couple celebrating birthday with cake and candles in cozy home setting with warm lighting and decorations",
    title: currentLanguage === 'en' ? "Birthday Celebration" : "Celebración de Cumpleaños",
    description: currentLanguage === 'en' ?
    "My 28th birthday surprise party that she planned for months, every detail was perfect." :
    "Mi fiesta sorpresa de cumpleaños número 28 que ella planeó durante meses, cada detalle fue perfecto.",
    date: "January 14, 2021",
    location: "Los Angeles, CA",
    category: "celebrations",
    year: 2021,
    likes: 167
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1556911261-6bd341186b2f",
    imageAlt: "Couple cooking together in modern kitchen, laughing while preparing meal with fresh ingredients on counter",
    title: currentLanguage === 'en' ? "Cooking Together" : "Cocinando Juntos",
    description: currentLanguage === 'en' ?
    "Sunday morning pancakes became our tradition, messy kitchen and all." : "Los panqueques del domingo por la mañana se convirtieron en nuestra tradición, cocina desordenada y todo.",
    date: "April 3, 2021",
    location: "Home",
    category: "everyday",
    year: 2021,
    likes: 134
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1627580115306-bb27950345b4",
    imageAlt: "Couple dancing together at outdoor wedding reception with string lights overhead and guests celebrating in background",
    title: currentLanguage === 'en' ? "Best Friend's Wedding" : "Boda del Mejor Amigo",
    description: currentLanguage === 'en' ? "Dancing at Sarah's wedding, where we caught the bouquet and garter - a sign of things to come." : "Bailando en la boda de Sarah, donde atrapamos el ramo y la liga - una señal de lo que vendría.",
    date: "September 18, 2021",
    location: "San Diego, CA",
    category: "celebrations",
    year: 2021,
    likes: 189
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1568661434286-ec6494fc169b",
    imageAlt: "Couple on road trip in convertible car driving through scenic coastal highway with ocean views and blue sky",
    title: currentLanguage === 'en' ? "Pacific Coast Road Trip" : "Viaje por Carretera de la Costa del Pacífico",
    description: currentLanguage === 'en' ?
    "Epic road trip down Highway 1, singing off-key to our favorite songs and making memories." :
    "Épico viaje por carretera por la Carretera 1, cantando desafinados nuestras canciones favoritas y creando recuerdos.",
    date: "July 12, 2022",
    location: "Big Sur, CA",
    category: "adventures",
    year: 2022,
    likes: 223
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1585945148306-db646373834d",
    imageAlt: "Couple relaxing on couch at home with pet dog, reading books together in comfortable living room with natural light",
    title: currentLanguage === 'en' ? "Lazy Sunday" : "Domingo Perezoso",
    description: currentLanguage === 'en' ?
    "Perfect lazy Sunday with coffee, books, and our rescue dog Max joining the cuddle session." :
    "Domingo perezoso perfecto con café, libros y nuestro perro rescatado Max uniéndose a la sesión de abrazos.",
    date: "February 20, 2022",
    location: "Home",
    category: "everyday",
    year: 2022,
    likes: 156
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1602681572040-d5b7c6535996",
    imageAlt: "Couple at Christmas market holding hot chocolate cups with festive lights and decorated stalls in background",
    title: currentLanguage === 'en' ? "Christmas Market Magic" : "Magia del Mercado Navideño",
    description: currentLanguage === 'en' ?
    "First Christmas together at the German Christmas Market, sipping hot cocoa and dreaming of our future." : "Primera Navidad juntos en el mercado navideño alemán, bebiendo chocolate caliente y soñando con nuestro futuro.",
    date: "December 10, 2022",
    location: "Chicago, IL",
    category: "celebrations",
    year: 2022,
    likes: 201
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1721456795970-f22b2146b665",
    imageAlt: "Couple kayaking together on calm lake with mountains reflected in water and clear blue sky above",
    title: currentLanguage === 'en' ? "Lake Tahoe Kayaking" : "Kayak en el Lago Tahoe",
    description: currentLanguage === 'en' ?
    "Peaceful morning kayaking on Lake Tahoe, where we talked about moving in together." : "Mañana tranquila en kayak en el Lago Tahoe, donde hablamos sobre mudarnos juntos.",
    date: "August 5, 2022",
    location: "Lake Tahoe, CA",
    category: "adventures",
    year: 2022,
    likes: 178
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1714647211860-cff4bccb505a",
    imageAlt: "Couple moving into new apartment together, unpacking boxes and arranging furniture in bright modern space",
    title: currentLanguage === 'en' ? "Moving Day" : "Día de Mudanza",
    description: currentLanguage === 'en' ?
    "The day we moved into our first apartment together - chaos, excitement, and pure joy." : "El día que nos mudamos a nuestro primer apartamento juntos - caos, emoción y pura alegría.",
    date: "March 1, 2023",
    location: "San Francisco, CA",
    category: "everyday",
    year: 2023,
    likes: 145
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1700580463781-f7d7bd26ff62",
    imageAlt: "Couple walking hand in hand on tropical beach at sunset with palm trees and turquoise water in background",
    title: currentLanguage === 'en' ? "Hawaii Vacation" : "Vacaciones en Hawái",
    description: currentLanguage === 'en' ?
    "Our dream vacation to Maui, where we snorkeled, hiked, and fell even more in love." : "Nuestras vacaciones de ensueño en Maui, donde buceamos, caminamos y nos enamoramos aún más.",
    date: "May 20, 2023",
    location: "Maui, HI",
    category: "adventures",
    year: 2023,
    likes: 267
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1676156787087-8b1ce952b59f",
    imageAlt: "Couple at outdoor concert festival dancing and enjoying live music with crowd and stage lights in background",
    title: currentLanguage === 'en' ? "Music Festival Fun" : "Diversión en el Festival de Música",
    description: currentLanguage === 'en' ?
    "Dancing in the rain at Coachella, completely soaked but having the time of our lives." :
    "Bailando bajo la lluvia en Coachella, completamente empapados pero pasándola increíble.",
    date: "April 15, 2023",
    location: "Indio, CA",
    category: "celebrations",
    year: 2023,
    likes: 192
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1557918630-5753f944dc6c",
    imageAlt: "Couple having romantic dinner at home with candles, wine glasses and beautifully plated food on elegant table",
    title: currentLanguage === 'en' ? "Anniversary Dinner" : "Cena de Aniversario",
    description: currentLanguage === 'en' ?
    "Three-year anniversary dinner at home, cooking together and celebrating our journey." : "Cena de aniversario de tres años en casa, cocinando juntos y celebrando nuestro viaje.",
    date: "March 15, 2023",
    location: "Home",
    category: "celebrations",
    year: 2023,
    likes: 176
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1591028371888-2f13fbf68b14",
    imageAlt: "Couple at art gallery exhibition viewing paintings together and discussing artwork in modern museum space",
    title: currentLanguage === 'en' ? "Art Gallery Date" : "Cita en la Galería de Arte",
    description: currentLanguage === 'en' ?
    "Exploring the MOMA together, debating modern art and discovering shared tastes." : "Explorando el MOMA juntos, debatiendo sobre arte moderno y descubriendo gustos compartidos.",
    date: "November 8, 2023",
    location: "New York, NY",
    category: "everyday",
    year: 2023,
    likes: 138
  },
  {
    id: 16,
    image: "https://images.unsplash.com/photo-1708420213457-bb452504f442",
    imageAlt: "Couple ice skating together at outdoor rink with city skyline and holiday decorations in background",
    title: currentLanguage === 'en' ? "Winter Wonderland" : "País de las Maravillas Invernal",
    description: currentLanguage === 'en' ?
    "Ice skating at Rockefeller Center, falling more than skating but laughing the whole time." : "Patinando sobre hielo en el Rockefeller Center, cayendo más que patinando pero riendo todo el tiempo.",
    date: "December 23, 2023",
    location: "New York, NY",
    category: "celebrations",
    year: 2023,
    likes: 209
  },
  {
    id: 17,
    image: "https://images.unsplash.com/photo-1734199139147-65348adc1b69",
    imageAlt: "Couple camping in tent under starry night sky with campfire glowing and mountains silhouetted in background",
    title: currentLanguage === 'en' ? "Camping Under Stars" : "Acampando Bajo las Estrellas",
    description: currentLanguage === 'en' ?
    "Weekend camping trip where we stargazed and talked about our dreams until sunrise." : "Viaje de campamento de fin de semana donde miramos las estrellas y hablamos sobre nuestros sueños hasta el amanecer.",
    date: "July 28, 2024",
    location: "Joshua Tree, CA",
    category: "adventures",
    year: 2024,
    likes: 234
  },
  {
    id: 18,
    image: "https://images.unsplash.com/photo-1731762512350-d02e9c5be1d8",
    imageAlt: "Couple at farmers market shopping for fresh produce with colorful fruit and vegetable stands in background",
    title: currentLanguage === 'en' ? "Farmers Market Morning" : "Mañana en el Mercado de Agricultores",
    description: currentLanguage === 'en' ? "Saturday morning ritual at the farmers market, picking fresh flowers and planning the week's meals." : "Ritual del sábado por la mañana en el mercado de agricultores, eligiendo flores frescas y planeando las comidas de la semana.",
    date: "May 11, 2024",
    location: "San Francisco, CA",
    category: "everyday",
    year: 2024,
    likes: 149
  },
  {
    id: 19,
    image: "https://images.unsplash.com/photo-1710563447214-a856ea672171",
    imageAlt: "Couple at wine tasting vineyard holding wine glasses with rows of grapevines and rolling hills in background",
    title: currentLanguage === 'en' ? "Napa Valley Wine Tasting" : "Cata de Vinos en Napa Valley",
    description: currentLanguage === 'en' ?
    "Romantic weekend in wine country, discovering new favorites and enjoying the beautiful scenery." :
    "Fin de semana romántico en la región vinícola, descubriendo nuevos favoritos y disfrutando del hermoso paisaje.",
    date: "September 7, 2024",
    location: "Napa Valley, CA",
    category: "adventures",
    year: 2024,
    likes: 198
  },
  {
    id: 20,
    image: "https://images.unsplash.com/photo-1652913736365-356f17a844cc",
    imageAlt: "Couple proposing on beach at sunset with man on one knee holding ring box and woman with hands covering mouth in surprise",
    title: currentLanguage === 'en' ? "The Proposal" : "La Propuesta",
    description: currentLanguage === 'en' ?
    "The moment that changed everything - sunset proposal at our favorite beach where it all began." : "El momento que lo cambió todo - propuesta al atardecer en nuestra playa favorita donde todo comenzó.",
    date: "October 15, 2024",
    location: "Santa Monica, CA",
    category: "engagement",
    year: 2024,
    likes: 456
  }];


  const filteredPhotos = photos?.filter((photo) => {
    const matchesCategory = activeFilter === 'all' || photo?.category === activeFilter;
    const matchesYear = !activeYear || photo?.year === activeYear;
    return matchesCategory && matchesYear;
  });

  const handlePhotoClick = (photo) => {
    const index = filteredPhotos?.findIndex((p) => p?.id === photo?.id);
    setSelectedPhotoIndex(index);
    setSelectedPhoto(photo);
  };

  const handleNextPhoto = () => {
    const nextIndex = (selectedPhotoIndex + 1) % filteredPhotos?.length;
    setSelectedPhotoIndex(nextIndex);
    setSelectedPhoto(filteredPhotos?.[nextIndex]);
  };

  const handlePreviousPhoto = () => {
    const prevIndex = selectedPhotoIndex === 0 ? filteredPhotos?.length - 1 : selectedPhotoIndex - 1;
    setSelectedPhotoIndex(prevIndex);
    setSelectedPhoto(filteredPhotos?.[prevIndex]);
  };

  const handleYearClick = (year) => {
    setActiveYear(activeYear === year ? null : year);
    setActiveFilter('all');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{currentLanguage === 'en' ? 'Photo Gallery - Eternal Vows' : 'Galería de Fotos - Eternal Vows'}</title>
        <meta
          name="description"
          content={currentLanguage === 'en' ? 'Browse our beautiful photo gallery showcasing our love story journey from first dates to engagement. View 150+ photos capturing our most cherished moments together.' : 'Explora nuestra hermosa galería de fotos que muestra el viaje de nuestra historia de amor desde las primeras citas hasta el compromiso. Ve más de 150 fotos capturando nuestros momentos más preciados juntos.'
          } />

      </Helmet>
      <Header />
      <main className="main-content min-h-screen bg-[var(--color-background)]">
        <GalleryHeader
          currentLanguage={currentLanguage}
          onLanguageToggle={handleLanguageToggle} />


        <TimelineSection
          currentLanguage={currentLanguage}
          onYearClick={handleYearClick}
          activeYear={activeYear} />


        <GalleryFilters
          currentLanguage={currentLanguage}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          categories={categories} />


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredPhotos?.length > 0 ?
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos?.map((photo) =>
            <PhotoCard
              key={photo?.id}
              photo={photo}
              onClick={handlePhotoClick} />

            )}
            </div> :

          <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-[var(--color-muted)] rounded-full">
                <Icon name="ImageOff" size={40} color="var(--color-muted-foreground)" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
                {currentLanguage === 'en' ? 'No Photos Found' : 'No se Encontraron Fotos'}
              </h3>
              <p className="text-[var(--color-muted-foreground)]">
                {currentLanguage === 'en' ? 'Try adjusting your filters to see more photos' : 'Intenta ajustar tus filtros para ver más fotos'
              }
              </p>
            </div>
          }
        </div>

        <ShareSection currentLanguage={currentLanguage} />

        <div className="bg-gradient-to-br from-[var(--color-secondary)] to-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[var(--color-primary)]/20 rounded-full heartbeat">
              <Icon name="Heart" size={32} color="var(--color-primary)" />
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-4">
              {currentLanguage === 'en' ? 'More Memories to Come' : 'Más Recuerdos por Venir'
              }
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)] mb-8">
              {currentLanguage === 'en' ? 'We can\'t wait to create more beautiful memories with you at our wedding celebration' :
              'No podemos esperar para crear más hermosos recuerdos contigo en nuestra celebración de boda'
              }
            </p>
          </div>
        </div>
      </main>
      {selectedPhoto &&
      <PhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={handleNextPhoto}
        onPrevious={handlePreviousPhoto}
        currentLanguage={currentLanguage} />

      }
    </>);

};

export default PhotoGallery;