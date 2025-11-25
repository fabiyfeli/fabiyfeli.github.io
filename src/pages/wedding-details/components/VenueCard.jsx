import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VenueCard = ({ venue, language }) => {
  const [showMap, setShowMap] = useState(false);

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${venue?.lat},${venue?.lng}`, '_blank');
  };

  const handleAddToCalendar = () => {
    const event = {
      title: venue?.name,
      location: venue?.address,
      details: venue?.description,
      start: '2026-01-31T19:00:00',
      end: '2026-02-01T05:00:00'
    };
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event?.title)}&location=${encodeURIComponent(event?.location)}&details=${encodeURIComponent(event?.details)}&dates=${event?.start?.replace(/[-:]/g, '')}/${event?.end?.replace(/[-:]/g, '')}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={venue?.image}
          alt={venue?.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-headline font-bold text-white mb-1">
            {venue?.name}
          </h3>
          <div className="flex items-center gap-2 text-white/90">
            <Icon name="MapPin" size={16} />
            <span className="text-sm">{venue?.type}</span>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {venue?.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Icon name="MapPin" size={20} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-foreground">{language === 'en' ? 'Address' : 'Dirección'}</p>
              <p className="text-sm text-muted-foreground">{venue?.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon name="Phone" size={20} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-foreground">{language === 'en' ? 'Contact' : 'Contacto'}</p>
              <a href={`tel:${venue?.phone}`} className="text-sm text-accent hover:underline">
                {venue?.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon name="Car" size={20} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-foreground">{language === 'en' ? 'Parking' : 'Estacionamiento'}</p>
              <p className="text-sm text-muted-foreground">{venue?.parking}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="default"
            iconName="Navigation"
            iconPosition="left"
            onClick={handleDirections}
            className="flex-1"
          >
            {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
          </Button>
          <Button
            variant="outline"
            iconName="Calendar"
            iconPosition="left"
            onClick={handleAddToCalendar}
            className="flex-1"
          >
            {language === 'en' ? 'Add to Calendar' : 'Agregar al Calendario'}
          </Button>
        </div>

        <Button
          variant="ghost"
          iconName={showMap ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
          onClick={() => setShowMap(!showMap)}
          fullWidth
        >
          {showMap 
            ? (language === 'en' ? 'Hide Map' : 'Ocultar Mapa')
            : (language === 'en' ? 'Show Map' : 'Mostrar Mapa')
          }
        </Button>

        {showMap && (
          <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-border">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={venue?.name}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${venue?.lat},${venue?.lng}&z=14&output=embed`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueCard;