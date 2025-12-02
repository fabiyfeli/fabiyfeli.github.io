import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickLinks = ({ language }) => {
  const content = {
    en: {
      title: "Quick Access",
      links: [
        {
          to: "/wedding-details",
          icon: "MapPin",
          title: "Venue & Directions",
          description: "Get directions and parking information"
        },
        {
          to: "/our-story",
          icon: "Heart",
          title: "Our Love Story",
          description: "Learn about our journey together"
        },
        {
          to: "/guest-book",
          icon: "MessageCircle",
          title: "Guest Book",
          description: "Leave us a message or well wishes"
        }
      ]
    },
    es: {
      title: "Acceso Rápido",
      links: [
        {
          to: "/wedding-details",
          icon: "MapPin",
          title: "Lugar y Direcciones",
          description: "Obtén direcciones e información de estacionamiento"
        },
        {
          to: "/our-story",
          icon: "Heart",
          title: "Nuestra Historia de Amor",
          description: "Conoce nuestro camino juntos"
        },
        {
          to: "/guest-book",
          icon: "MessageCircle",
          title: "Libro de Visitas",
          description: "Déjanos un mensaje o buenos deseos"
        }
      ]
    }
  };

  const text = content?.[language];

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl text-foreground mb-4">
            {text?.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {text?.links?.map((link, index) => (
            <Link
              key={index}
              to={link?.to}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 elegant-hover group"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <Icon name={link?.icon} size={28} color="var(--color-primary)" />
              </div>
              <h3 className="font-headline text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {link?.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {link?.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;