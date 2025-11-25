import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AccommodationCard = ({ accommodation, language }) => {
  const handleBooking = () => {
    window.open(accommodation?.bookingUrl, '_blank');
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${accommodation?.lat},${accommodation?.lng}`, '_blank');
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={accommodation?.image}
          alt={accommodation?.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {accommodation?.groupRate && (
          <div className="absolute top-4 right-4 bg-cta text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {language === 'en' ? 'Group Rate' : 'Tarifa Grupal'}
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-headline font-bold text-foreground mb-1">
              {accommodation?.name}
            </h3>
            <div className="flex items-center gap-1">
              {[...Array(accommodation?.stars)]?.map((_, i) => (
                <Icon key={i} name="Star" size={16} color="var(--color-brand-gold)" />
              ))}
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {accommodation?.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <Icon name="MapPin" size={18} className="text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground">{accommodation?.distance}</span>
          </div>

          <div className="flex items-center gap-3">
            <Icon name="DollarSign" size={18} className="text-primary flex-shrink-0" />
            <div>
              <span className="text-lg font-bold text-foreground">{accommodation?.priceRange}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {language === 'en' ? 'per night' : 'por noche'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Icon name="Phone" size={18} className="text-primary flex-shrink-0" />
            <a href={`tel:${accommodation?.phone}`} className="text-sm text-accent hover:underline">
              {accommodation?.phone}
            </a>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {language === 'en' ? 'Amenities' : 'Servicios'}
          </p>
          <div className="flex flex-wrap gap-2">
            {accommodation?.amenities?.map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
              >
                <Icon name="Check" size={12} className="text-success" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {accommodation?.groupCode && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-primary mb-1">
              {language === 'en' ? 'Group Code' : 'Código de Grupo'}
            </p>
            <p className="text-sm font-mono font-bold text-foreground">
              {accommodation?.groupCode}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Button
            variant="default"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={handleBooking}
            className="flex-1"
          >
            {language === 'en' ? 'Book Now' : 'Reservar Ahora'}
          </Button>
          <Button
            variant="outline"
            iconName="Navigation"
            iconPosition="left"
            onClick={handleDirections}
          >
            {language === 'en' ? 'Directions' : 'Direcciones'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;