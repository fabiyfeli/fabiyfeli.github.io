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
          details: "San Francisco International Airport (SFO) - 25 miles from venue\nOakland International Airport (OAK) - 30 miles from venue",
          tips: "Book flights early for best rates. Shuttle service available from both airports."
        },
        {
          type: "By Car",
          icon: "Car",
          details: "Free parking available at all venues\nValet service at reception venue",
          tips: "GPS coordinates: 37.7749° N, 122.4194° W\nTraffic can be heavy 4-6 PM on weekdays."
        },
        {
          type: "Rideshare",
          icon: "Navigation",
          details: "Uber and Lyft readily available\nEstimated cost from SFO: $45-65",
          tips: "Consider sharing rides with other guests to reduce costs and environmental impact."
        }]

      },
      attractions: [
      {
        name: "Golden Gate Bridge",
        description: "Iconic suspension bridge with stunning views",
        distance: "8 miles",
        image: "https://images.unsplash.com/photo-1644907102889-f8f97c3056f5",
        imageAlt: "Majestic Golden Gate Bridge spanning San Francisco Bay with orange-red towers against blue sky and rolling fog"
      },
      {
        name: "Fisherman\'s Wharf",
        description: "Waterfront neighborhood with shops and seafood",
        distance: "5 miles",
        image: "https://images.unsplash.com/photo-1730655900630-b046f843ab2e",
        imageAlt: "Bustling Fisherman's Wharf waterfront with historic pier buildings, seafood restaurants, and tourists enjoying bay views"
      },
      {
        name: "Alcatraz Island",
        description: "Historic former federal prison with tours",
        distance: "6 miles",
        image: "https://images.unsplash.com/photo-1679560872210-efc55a8fd6d7",
        imageAlt: "Historic Alcatraz Island prison complex on rocky outcrop in San Francisco Bay with lighthouse and cell blocks visible"
      }],

      dining: [
      {
        name: "The Garden Bistro",
        cuisine: "Farm-to-Table",
        priceRange: "$$$",
        description: "Fresh, seasonal ingredients in elegant setting",
        speciality: "Weekend brunch highly recommended"
      },
      {
        name: "Bella Vista Italian",
        cuisine: "Italian",
        priceRange: "$$",
        description: "Authentic Italian cuisine with bay views",
        speciality: "Homemade pasta and wood-fired pizza"
      },
      {
        name: "Sunset Seafood",
        cuisine: "Seafood",
        priceRange: "$$$",
        description: "Fresh catch daily with waterfront dining",
        speciality: "Dungeness crab and clam chowder"
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
          details: "Aeropuerto Internacional de San Francisco (SFO) - 25 millas del lugar\nAeropuerto Internacional de Oakland (OAK) - 30 millas del lugar",
          tips: "Reserve vuelos temprano para mejores tarifas. Servicio de transporte disponible desde ambos aeropuertos."
        },
        {
          type: "En Auto",
          icon: "Car",
          details: "Estacionamiento gratuito disponible en todos los lugares\nServicio de valet en el lugar de recepción",
          tips: "Coordenadas GPS: 37.7749° N, 122.4194° W\nEl tráfico puede ser pesado de 4-6 PM en días laborables."
        },
        {
          type: "Transporte Compartido",
          icon: "Navigation",
          details: "Uber y Lyft fácilmente disponibles\nCosto estimado desde SFO: $45-65",
          tips: "Considere compartir viajes con otros invitados para reducir costos e impacto ambiental."
        }]

      },
      attractions: [
      {
        name: "Puente Golden Gate",
        description: "Icónico puente colgante con vistas impresionantes",
        distance: "8 millas",
        image: "https://images.unsplash.com/photo-1723398702245-3857dfb0d8a4",
        imageAlt: "Majestuoso Puente Golden Gate atravesando la Bahía de San Francisco con torres rojo-naranja contra cielo azul y niebla ondulante"
      },
      {
        name: "Muelle del Pescador",
        description: "Barrio frente al mar con tiendas y mariscos",
        distance: "5 millas",
        image: "https://images.unsplash.com/photo-1638771316317-f98044bc2292",
        imageAlt: "Bullicioso muelle del pescador con edificios históricos del muelle, restaurantes de mariscos y turistas disfrutando de vistas de la bahía"
      },
      {
        name: "Isla de Alcatraz",
        description: "Histórica ex prisión federal con tours",
        distance: "6 millas",
        image: "https://images.unsplash.com/photo-1679560872210-efc55a8fd6d7",
        imageAlt: "Complejo histórico de la prisión de la Isla de Alcatraz en afloramiento rocoso en la Bahía de San Francisco con faro y bloques de celdas visibles"
      }],

      dining: [
      {
        name: "The Garden Bistro",
        cuisine: "De la Granja a la Mesa",
        priceRange: "$$$",
        description: "Ingredientes frescos de temporada en ambiente elegante",
        speciality: "Brunch de fin de semana muy recomendado"
      },
      {
        name: "Bella Vista Italian",
        cuisine: "Italiano",
        priceRange: "$$",
        description: "Cocina italiana auténtica con vistas a la bahía",
        speciality: "Pasta casera y pizza al horno de leña"
      },
      {
        name: "Sunset Seafood",
        cuisine: "Mariscos",
        priceRange: "$$$",
        description: "Captura fresca diaria con comedor frente al mar",
        speciality: "Cangrejo Dungeness y sopa de almejas"
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