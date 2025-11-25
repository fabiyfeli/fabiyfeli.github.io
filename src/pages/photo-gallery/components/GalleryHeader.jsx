import React from 'react';
import Icon from '../../../components/AppIcon';

const GalleryHeader = ({ currentLanguage, onLanguageToggle }) => {
  const content = {
    en: {
      title: "Our Love Story in Pictures",
      subtitle: "A visual journey through our most cherished moments together",
      description: "From our first date to our engagement, these photos capture the beautiful journey that led us to this celebration of love. Each image tells a story of laughter, adventure, and the deep connection we share."
    },
    es: {
      title: "Nuestra Historia de Amor en Imágenes",
      subtitle: "Un viaje visual a través de nuestros momentos más preciados juntos",
      description: "Desde nuestra primera cita hasta nuestro compromiso, estas fotos capturan el hermoso viaje que nos llevó a esta celebración de amor. Cada imagen cuenta una historia de risas, aventuras y la profunda conexión que compartimos."
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="relative bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-secondary)] to-[var(--color-background)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onLanguageToggle}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--color-border)]"
          aria-label={currentLanguage === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
        >
          <Icon name="Globe" size={18} color="var(--color-primary)" />
          <span className="text-sm font-medium text-[var(--color-foreground)]">
            {currentLanguage === 'en' ? 'ES' : 'EN'}
          </span>
        </button>
      </div>
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[var(--color-primary)]/20 rounded-full">
          <Icon name="Camera" size={32} color="var(--color-primary)" />
        </div>
        
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-foreground)] mb-4">
          {text?.title}
        </h1>
        
        <p className="text-lg sm:text-xl text-[var(--color-muted-foreground)] mb-6 font-medium">
          {text?.subtitle}
        </p>
        
        <p className="text-base text-[var(--color-muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          {text?.description}
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
            <Icon name="Heart" size={20} color="var(--color-primary)" />
            <span className="text-sm font-medium">150+ Photos</span>
          </div>
          <div className="w-1 h-1 bg-[var(--color-muted-foreground)] rounded-full"></div>
          <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
            <Icon name="Calendar" size={20} color="var(--color-primary)" />
            <span className="text-sm font-medium">2020 - 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryHeader;