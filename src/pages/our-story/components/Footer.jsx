import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = ({ language }) => {
  const content = {
    en: {
      tagline: "Celebrating love, family, and forever",
      quickLinks: "Quick Links",
      contact: "Contact Us",
      copyright: "Made with love for Fabi & Feli",
      links: [
        { to: "/homepage", label: "Home" },
        { to: "/our-story", label: "Our Story" },
        { to: "/wedding-details", label: "Wedding Details" },
        { to: "/rsvp", label: "RSVP" },
        { to: "/guest-book", label: "Guest Book" }
      ],
      contactInfo: {
        email: "contact@fabiyfeli.cl",
        phone: "+56 (9) 34340007"
      }
    },
    es: {
      tagline: "Celebrando el amor, la familia y el para siempre",
      quickLinks: "Enlaces Rápidos",
      contact: "Contáctanos",
      copyright: "Hecho con amor por Fabi & Feli",
      links: [
        { to: "/homepage", label: "Inicio" },
        { to: "/our-story", label: "Nuestra Historia" },
        { to: "/wedding-details", label: "Detalles de la Boda" },
        { to: "/rsvp", label: "Confirmar Asistencia" },
        { to: "/guest-book", label: "Libro de Visitas" }
      ],
      contactInfo: {
        email: "contact@fabiyfeli.cl",
        phone: "+56 (9) 34340007"
      }
    }
  };

  const text = content?.[language];
  const currentYear = new Date()?.getFullYear();

  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Icon name="Heart" size={20} color="var(--color-primary)" />
              </div>
              <span className="ml-3 text-xl font-bold font-headline text-foreground">Fabi & Feli</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {text?.tagline}
            </p>
          </div>

          <div>
            <h3 className="font-headline text-lg mb-4 text-foreground">{text?.quickLinks}</h3>
            <ul className="space-y-2">
              {text?.links?.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link?.to}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-lg mb-4 text-foreground">{text?.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Icon name="Mail" size={16} color="var(--color-primary)" />
                <a href={`mailto:${text?.contactInfo?.email}`} className="hover:text-primary transition-colors duration-200">
                  {text?.contactInfo?.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Icon name="Phone" size={16} color="var(--color-primary)" />
                <a href={`tel:${text?.contactInfo?.phone}`} className="hover:text-primary transition-colors duration-200">
                  {text?.contactInfo?.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center sm:text-left">
              &copy; {currentYear} {text?.copyright}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Icon name="Heart" size={16} color="var(--color-error)" className="heartbeat" />
              <span>January 31, 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;