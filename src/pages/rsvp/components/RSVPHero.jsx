import Icon from '../../../components/AppIcon';

const RSVPHero = ({ language = 'es' }) => {
  const content = {
    es: {
      title: 'Únete a Nuestra Celebración',
      description: 'Tu presencia haría nuestro día especial completo. Por favor haznos saber si podrás acompañarnos en la celebración de nuestro amor.',
      deadline: 'Por favor responde antes del 21 de diciembre, 2025'
    },
    en: {
      title: 'Join Our Celebration',
      description: 'Your presence would make our special day complete. Please let us know if you\'ll be able to join us in celebrating our love.',
      deadline: 'Please respond by December 21, 2025'
    }
  };

  const t = content[language];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 romantic-gradient" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mb-6 heartbeat">
          <Icon name="Heart" size={32} color="var(--color-primary)" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline text-foreground mb-4">
          {t.title}
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          {t.description}
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={18} color="var(--color-primary)" />
          <span>{t.deadline}</span>
        </div>
      </div>
    </section>
  );
};

export default RSVPHero;