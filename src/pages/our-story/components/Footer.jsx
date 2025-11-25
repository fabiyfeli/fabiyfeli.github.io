import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = ({ language }) => {
  const content = {
    en: {
      tagline: "Celebrating love, family, and forever",
      quickLinks: "Quick Links",
      contact: "Contact Us",
      followUs: "Follow Our Journey",
      copyright: "Made with love for Isabella & Miguel",
      links: [
        { to: "/homepage", label: "Home" },
        { to: "/our-story", label: "Our Story" },
        { to: "/wedding-details", label: "Wedding Details" },
        { to: "/rsvp", label: "RSVP" },
        { to: "/photo-gallery", label: "Gallery" },
        { to: "/guest-book", label: "Guest Book" }
      ],
      contactInfo: {
        email: "contact@fabiyfeli.cl",
        phone: "+1 (555) 123-4567"
      }
    },
    es: {
      tagline: "Celebrando el amor, la familia y el para siempre",
      quickLinks: "Enlaces Rápidos",
      contact: "Contáctanos",
      followUs: "Sigue Nuestro Camino",
      copyright: "Hecho con amor para Isabella y Miguel",
      links: [
        { to: "/homepage", label: "Inicio" },
        { to: "/our-story", label: "Nuestra Historia" },
        { to: "/wedding-details", label: "Detalles de la Boda" },
        { to: "/rsvp", label: "Confirmar Asistencia" },
        { to: "/photo-gallery", label: "Galería" },
        { to: "/guest-book", label: "Libro de Visitas" }
      ],
      contactInfo: {
        email: "contact@fabiyfeli.cl",
        phone: "+1 (555) 123-4567"
      }
    }
  };

  const text = content?.[language];
  const currentYear = new Date()?.getFullYear();

  const socialLinks = [
    { icon: "Instagram", url: "#", label: "Instagram" },
    { icon: "Facebook", url: "#", label: "Facebook" },
    { icon: "Twitter", url: "#", label: "Twitter" }
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                <Icon name="Heart" size={20} color="var(--color-primary)" />
              </div>
              <span className="ml-3 text-xl font-bold font-headline">Eternal Vows</span>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              {text?.tagline}
            </p>
          </div>

          <div>
            <h3 className="font-headline text-lg mb-4">{text?.quickLinks}</h3>
            <ul className="space-y-2">
              {text?.links?.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link?.to}
                    className="text-background/80 hover:text-primary text-sm transition-colors duration-200"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-lg mb-4">{text?.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/80 text-sm">
                <Icon name="Mail" size={16} color="var(--color-primary)" />
                <a href={`mailto:${text?.contactInfo?.email}`} className="hover:text-primary transition-colors duration-200">
                  {text?.contactInfo?.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-background/80 text-sm">
                <Icon name="Phone" size={16} color="var(--color-primary)" />
                <a href={`tel:${text?.contactInfo?.phone}`} className="hover:text-primary transition-colors duration-200">
                  {text?.contactInfo?.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-lg mb-4">{text?.followUs}</h3>
            <div className="flex gap-3">
              {socialLinks?.map((social, index) => (
                <a
                  key={index}
                  href={social?.url}
                  aria-label={social?.label}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-background/10 hover:bg-primary/20 transition-all duration-300"
                >
                  <Icon name={social?.icon} size={20} color="var(--color-background)" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-background/60 text-sm text-center sm:text-left">
              &copy; {currentYear} {text?.copyright}
            </p>
            <div className="flex items-center gap-2 text-background/60 text-sm">
              <Icon name="Heart" size={16} color="var(--color-error)" className="heartbeat" />
              <span>June 15, 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;