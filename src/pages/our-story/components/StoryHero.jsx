import Icon from '../../../components/AppIcon';

const StoryHero = ({ currentLanguage }) => {
  const content = {
    en: {
      title: "Our Love Story",
      subtitle: "A Journey of Two Hearts Becoming One",
      description: "Every love story is beautiful, but ours is our favorite. From the moment we met to the day we say 'I do', every chapter has been filled with laughter, growth, and endless love."
    },
    es: {
      title: "Nuestra Historia de Amor",
      subtitle: "Un Viaje de Dos Corazones Convirtiéndose en Uno",
      description: "Cada historia de amor es hermosa, pero la nuestra es nuestra favorita. Desde el momento en que nos conocimos hasta el día en que decimos 'Sí, acepto', cada capítulo ha estado lleno de risas, crecimiento y amor infinito."
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="relative bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 romantic-gradient"></div>
      <div className="absolute top-10 left-10 opacity-10">
        <Icon name="Heart" size={120} color="var(--color-primary)" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <Icon name="Heart" size={100} color="var(--color-accent)" />
      </div>
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 heartbeat">
          <Icon name="Heart" size={40} color="var(--color-primary)" />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-foreground mb-4">
          {text?.title}
        </h1>
        
        <p className="text-xl sm:text-2xl font-accent text-primary mb-6">
          {text?.subtitle}
        </p>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {text?.description}
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={18} color="var(--color-primary)" />
            <span>{currentLanguage === 'en' ? 'Since 2021' : 'Desde 2021'}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-primary"></div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="MapPin" size={18} color="var(--color-primary)" />
            <span>{currentLanguage === 'en' ? 'Santiago, Chile' : 'Santiago, Chile'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryHero;