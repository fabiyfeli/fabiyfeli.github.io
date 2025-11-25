import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeddingDetailsPreview = ({ language }) => {
  const content = {
    en: {
      title: "Wedding Day Details",
      subtitle: "Everything you need to know about our special day",
      ceremony: {
        title: "Ceremony",
        time: "7:00 PM",
        location: "Casona San Ignacio",
        address: "Caupolicán 8611 Quilicura, Santiago, Chile",
        description: "Join us for an intimate ceremony in a historical and charming place."
      },
      reception: {
        title: "Cocktail",
        time: "8:00 PM",
        location: "Grand Ballroom",
        address: "Same Venue",
        description: "Celebrate with dinner, dancing, open bar and unforgettable memories."
      },
      attire: {
        title: "Dress Code",
        code: "Semi-Formal Attire",
        description: "We kindly request casual or semiformal attire. There is no need for something too elaborate unless you want it."
      },
      viewDetails: "View Full Details"
    },
    es: {
      title: "Detalles del Día de la Boda",
      subtitle: "Todo lo que necesitas saber sobre nuestro día especial",
      ceremony: {
        title: "Ceremonia",
        time: "7:00 PM",
        location: "Casona San Ignacio",
        address: "Caupolicán 8611 Quilicura, Santiago, Chile",
        description: "Únete a nosotros para una ceremonia íntima en un lugar histórico y acogedor."
      },
      reception: {
        title: "Cocktail",
        time: "8:00 PM",
        location: "Salón de Baile",
        address: "Mismo Lugar",
        description: "Celebra con cena, baile, barra libre y recuerdos inolvidables."
      },
      attire: {
        title: "Código de Vestimenta",
        code: "Vestimenta Semi-Formal",
        description: "Solicitamos amablemente vestimenta casual o semiformal. No es necesario algo demasiado elaborado a menos que lo desees."
      },
      viewDetails: "Ver Detalles Completos"
    }
  };

  const text = content?.[language];

  const events = [
    {
      icon: "Church",
      iconColor: "var(--color-brand-gold)",
      ...text?.ceremony
    },
    {
      icon: "PartyPopper",
      iconColor: "var(--color-brand-pink)",
      ...text?.reception
    },
    {
      icon: "Shirt",
      iconColor: "var(--color-accent)",
      ...text?.attire
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">
            {text?.title}
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            {text?.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {events?.map((event, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all duration-300 elegant-hover"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 mx-auto">
                <Icon name={event?.icon} size={32} color={event?.iconColor} />
              </div>
              <h3 className="font-headline text-2xl text-foreground text-center mb-4">
                {event?.title}
              </h3>
              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Icon name="Clock" size={18} color="var(--color-primary)" />
                  <span className="font-semibold">{event?.time}</span>
                </div>
                <div className="text-foreground font-semibold">{event?.location}</div>
                {event?.address && (
                  <div className="flex items-start justify-center gap-2 text-muted-foreground text-sm">
                    <Icon name="MapPin" size={16} color="var(--color-primary)" className="mt-1 flex-shrink-0" />
                    <span>{event?.address}</span>
                  </div>
                )}
                {event?.code && (
                  <div className="text-accent font-semibold text-lg">{event?.code}</div>
                )}
                <p className="text-muted-foreground text-sm leading-relaxed mt-4">
                  {event?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/wedding-details">
            <Button
              variant="default"
              size="lg"
              iconName="ArrowRight"
              iconPosition="right"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              {text?.viewDetails}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WeddingDetailsPreview;