import { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EventTimeline = ({ language }) => {
  const [activeEvent, setActiveEvent] = useState(0);

  const timelineEvents = {
    en: [
      {
        id: 1,
        time: "7:00 PM",
        title: "Ceremony Begins",
        description: "Join us as we exchange our vows in an intimate ceremony surrounded by loved ones. Please arrive 15 minutes early for seating (be on time).",
        location: "Casona San Ignacio Chapel",
        icon: "Church",
        color: "var(--color-primary)"
      },
      {
        id: 2,
        time: "8:00 PM",
        title: "Cocktail Hour",
        description: "Enjoy refreshing beverages and light appetizers while we capture special moments with our photographer.",
        location: "Garden Terrace",
        icon: "Wine",
        color: "var(--color-accent)"
      },
      {
        id: 3,
        time: "9:00 PM",
        title: "Reception & Dinner",
        description: "Celebrate with us over a delicious dinner featuring both traditional and contemporary cuisine options.",
        location: "Grand Ballroom",
        icon: "Utensils",
        color: "var(--color-brand-gold)"
      },
      {
        id: 4,
        time: "10:00 PM",
        title: "First Dance & Toasts",
        description: "Share in our joy as we share our first dance and start the celebration.",
        location: "Grand Ballroom",
        icon: "Music",
        color: "var(--color-brand-pink)"
      },
      {
        id: 5,
        time: "10:30 PM",
        title: "Dancing & Celebration",
        description: "Dance the night away with live music and DJ entertainment. The celebration continues until next day!",
        location: "Grand Ballroom",
        icon: "PartyPopper",
        color: "var(--color-cta)"
      }
    ],
    es: [
      {
        id: 1,
        time: "7:00 PM",
        title: "Comienza la Ceremonia",
        description: "Únase a nosotros mientras intercambiamos nuestros votos en una ceremonia íntima rodeados de seres queridos. Por favor llegue 15 minutos antes para tomar asiento (sea puntual).",
        location: "Capilla de la Casona San Ignacio",
        icon: "Church",
        color: "var(--color-primary)"
      },
      {
        id: 2,
        time: "8:00 PM",
        title: "Hora del Cóctel",
        description: "Disfrute de bebidas refrescantes y aperitivos ligeros mientras capturamos momentos especiales con nuestro fotógrafo.",
        location: "Terraza del Jardín",
        icon: "Wine",
        color: "var(--color-accent)"
      },
      {
        id: 3,
        time: "9:00 PM",
        title: "Recepción y Cena",
        description: "Celebre con nosotros con una deliciosa cena que incluye opciones de cocina tradicional y contemporánea.",
        location: "Salón de Baile",
        icon: "Utensils",
        color: "var(--color-brand-gold)"
      },
      {
        id: 4,
        time: "10:00 PM",
        title: "Primer Baile y Brindis",
        description: "Comparta nuestra alegría mientras compartimos nuestro primer baile e iniciamos la fiesta.",
        location: "Salón de Baile",
        icon: "Music",
        color: "var(--color-brand-pink)"
      },
      {
        id: 5,
        time: "10:30 PM",
        title: "Baile y Celebración",
        description: "¡Baile toda la noche con música en vivo y entretenimiento de DJ. La celebración continúa hasta el siguiente día!",
        location: "Salón de Baile",
        icon: "PartyPopper",
        color: "var(--color-cta)"
      }
    ]
  };

  const events = timelineEvents?.[language];

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-brand-gold hidden md:block" />
      <div className="space-y-8">
        {events?.map((event, index) => (
          <div
            key={event?.id}
            className={`relative flex flex-col md:flex-row gap-6 transition-all duration-500 ${
              activeEvent === index ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
            }`}
            onMouseEnter={() => setActiveEvent(index)}
          >
            <div className="flex items-start gap-4 md:w-32 flex-shrink-0">
              <div
                className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300"
                style={{ backgroundColor: event?.color }}
              >
                <Icon name={event?.icon} size={28} color="white" />
              </div>
              <div className="md:hidden">
                <p className="text-2xl font-bold text-foreground">{event?.time}</p>
              </div>
            </div>

            <div className="hidden md:block md:w-24 flex-shrink-0 text-right pt-4">
              <p className="text-2xl font-bold text-foreground">{event?.time}</p>
            </div>

            <div
              className="flex-1 bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary"
              style={{
                borderLeftColor: activeEvent === index ? event?.color : 'transparent',
                borderLeftWidth: activeEvent === index ? '4px' : '2px'
              }}
            >
              <h3 className="text-2xl font-headline font-bold text-foreground mb-2">
                {event?.title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Icon name="MapPin" size={16} />
                <span className="text-sm font-medium">{event?.location}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {event?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTimeline;