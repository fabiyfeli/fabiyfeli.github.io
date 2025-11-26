import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TravelGuide = ({ language }) => {
  const [activeTab, setActiveTab] = useState('transportation');

  const travelInfo = {
    en: {
      title: "Travel & Transportation",
      tabs: {
        transportation: "Getting There",
        local: "Local Attractions",
        dining: "Dining Recommendations"
      },
      transportation: {
        options: [
        {
          type: "By Air",
          icon: "Plane",
          details: "Arturo Merino Benítez International Airport (SCL) - 30 km from venue\nServed by major airlines from around the world",
          tips: "Book flights early for best rates. Transfer services and taxis available from the airport."
        },
        {
          type: "By Car",
          icon: "Car",
          details: "Free parking available at the venue\nEasy access via Route 5 North",
          tips: "GPS coordinates: -33.3413° S, -70.6944° W\nTraffic can be heavy during rush hours (7-9 AM, 6-8 PM)."
        },
        {
          type: "Rideshare & Taxi",
          icon: "Navigation",
          details: "Uber, Cabify, and DiDi readily available\nEstimated cost from SCL Airport: $25,000-35,000 CLP",
          tips: "Consider sharing rides with other guests. Radio taxis are also reliable and can be booked in advance."
        }]

      },
      attractions: [
      {
        name: "Cerro San Cristóbal",
        description: "Iconic hill with panoramic city views and Virgin Mary statue",
        distance: "20 km",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62",
        imageAlt: "Cerro San Cristóbal overlooking Santiago with white Virgin Mary statue and Andes mountains in background"
      },
      {
        name: "Plaza de Armas",
        description: "Historic main square with colonial architecture and museums",
        distance: "22 km",
        image: "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b",
        imageAlt: "Plaza de Armas central square with historic cathedral, palm trees, and people enjoying the plaza"
      },
      {
        name: "Barrio Lastarria",
        description: "Bohemian neighborhood with art, restaurants, and nightlife",
        distance: "18 km",
        image: "https://images.unsplash.com/photo-1518638150340-f706e86654de",
        imageAlt: "Colorful Barrio Lastarria streets with murals, cafes, and vibrant cultural atmosphere"
      }],

      dining: [
      {
        name: "Borago",
        cuisine: "Contemporary Chilean",
        priceRange: "$$$",
        description: "Award-winning restaurant featuring native Chilean ingredients",
        speciality: "Tasting menu with seasonal local products"
      },
      {
        name: "Peumayen Ancestral Food",
        cuisine: "Indigenous Chilean",
        priceRange: "$$",
        description: "Authentic Chilean cuisine from various indigenous cultures",
        speciality: "Traditional dishes like curanto and merkén"
      },
      {
        name: "Ocean Pacific's",
        cuisine: "Seafood",
        priceRange: "$$$",
        description: "Fresh seafood from the Chilean coast",
        speciality: "Ceviche, machas a la parmesana, and congrio"
      }]

    },
    es: {
      title: "Viajes y Transporte",
      tabs: {
        transportation: "Cómo Llegar",
        local: "Atracciones Locales",
        dining: "Recomendaciones Gastronómicas"
      },
      transportation: {
        options: [
        {
          type: "Por Avión",
          icon: "Plane",
          details: "Aeropuerto Internacional Arturo Merino Benítez (SCL) - 30 km del lugar\nConectado con principales aerolíneas del mundo",
          tips: "Reserve vuelos temprano para mejores tarifas. Servicios de transfer y taxis disponibles desde el aeropuerto."
        },
        {
          type: "En Auto",
          icon: "Car",
          details: "Estacionamiento gratuito disponible en el lugar\nFácil acceso por Ruta 5 Norte",
          tips: "Coordenadas GPS: -33.3413° S, -70.6944° W\nEl tráfico puede ser intenso en horas punta (7-9 AM, 6-8 PM)."
        },
        {
          type: "Transporte Compartido y Taxi",
          icon: "Navigation",
          details: "Uber, Cabify y DiDi fácilmente disponibles\nCosto estimado desde Aeropuerto SCL: $25,000-35,000 CLP",
          tips: "Considere compartir viajes con otros invitados. Los radiotaxis también son confiables y pueden reservarse con anticipación."
        }]

      },
      attractions: [
      {
        name: "Cerro San Cristóbal",
        description: "Icónico cerro con vistas panorámicas y estatua de la Virgen María",
        distance: "20 km",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62",
        imageAlt: "Cerro San Cristóbal con vista de Santiago, estatua blanca de la Virgen María y montañas de los Andes al fondo"
      },
      {
        name: "Plaza de Armas",
        description: "Plaza principal histórica con arquitectura colonial y museos",
        distance: "22 km",
        image: "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b",
        imageAlt: "Plaza de Armas central con catedral histórica, palmeras y personas disfrutando de la plaza"
      },
      {
        name: "Barrio Lastarria",
        description: "Barrio bohemio con arte, restaurantes y vida nocturna",
        distance: "18 km",
        imageAlt: "Calles coloridas de Barrio Lastarria con murales, cafés y vibrante atmósfera cultural"
      }],

      dining: [
      {
        name: "Borago",
        cuisine: "Chilena Contemporánea",
        priceRange: "$$$",
        description: "Restaurante premiado con ingredientes nativos chilenos",
        speciality: "Menú degustación con productos locales de temporada"
      },
      {
        name: "Peumayen Ancestral Food",
        cuisine: "Chilena Indígena",
        priceRange: "$$",
        description: "Cocina chilena auténtica de diversas culturas indígenas",
        speciality: "Platos tradicionales como curanto y merkén"
      },
      {
        name: "Ocean Pacific's",
        cuisine: "Mariscos",
        priceRange: "$$$",
        description: "Mariscos frescos de la costa chilena",
        speciality: "Ceviche, machas a la parmesana y congrio"
      }]

    }
  };

  const content = travelInfo?.[language];

  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
          <Icon name="MapPin" size={32} color="var(--color-accent)" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-foreground mb-2">
          {content?.title}
        </h2>
      </div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {Object.entries(content?.tabs)?.map(([key, label]) =>
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          activeTab === key ?
          'bg-accent text-white shadow-lg' :
          'bg-muted text-muted-foreground hover:bg-muted/80'}`
          }>

            {label}
          </button>
        )}
      </div>
      {activeTab === 'transportation' &&
      <div className="space-y-6">
          {content?.transportation?.options?.map((option, index) =>
        <div key={index} className="bg-background rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                  <Icon name={option?.icon} size={24} color="var(--color-primary)" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-headline font-bold text-foreground mb-2">
                    {option?.type}
                  </h3>
                  <p className="text-muted-foreground mb-3 whitespace-pre-line">
                    {option?.details}
                  </p>
                  <div className="flex items-start gap-2 bg-success/10 border border-success/20 rounded-lg p-3">
                    <Icon name="Lightbulb" size={16} className="text-success flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{option?.tips}</p>
                  </div>
                </div>
              </div>
            </div>
        )}
        </div>
      }
      {activeTab === 'local' &&
      <div className="grid md:grid-cols-3 gap-6">
          {content?.attractions?.map((attraction, index) =>
        <div key={index} className="bg-background rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <Image
              src={attraction?.image}
              alt={attraction?.imageAlt}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />

              </div>
              <div className="p-4">
                <h3 className="text-lg font-headline font-bold text-foreground mb-2">
                  {attraction?.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {attraction?.description}
                </p>
                <div className="flex items-center gap-2 text-primary">
                  <Icon name="MapPin" size={16} />
                  <span className="text-sm font-medium">{attraction?.distance}</span>
                </div>
              </div>
            </div>
        )}
        </div>
      }
      {activeTab === 'dining' &&
      <div className="space-y-4">
          {content?.dining?.map((restaurant, index) =>
        <div key={index} className="bg-background rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-headline font-bold text-foreground">
                      {restaurant?.name}
                    </h3>
                    <span className="text-sm font-semibold text-accent">
                      {restaurant?.priceRange}
                    </span>
                  </div>
                  <p className="text-sm text-primary font-medium mb-2">
                    {restaurant?.cuisine}
                  </p>
                  <p className="text-muted-foreground mb-3">
                    {restaurant?.description}
                  </p>
                  <div className="flex items-start gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-lg p-3">
                    <Icon name="Star" size={16} className="text-brand-gold flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {language === 'en' ? 'Specialty: ' : 'Especialidad: '}
                      </span>
                      {restaurant?.speciality}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg flex-shrink-0">
                  <Icon name="Utensils" size={24} color="var(--color-accent)" />
                </div>
              </div>
            </div>
        )}
        </div>
      }
    </div>);

};

export default TravelGuide;