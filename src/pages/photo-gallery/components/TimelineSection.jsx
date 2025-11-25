import React from 'react';
import Icon from '../../../components/AppIcon';

const TimelineSection = ({ currentLanguage, onYearClick, activeYear }) => {
  const content = {
    en: {
      title: "Our Journey Timeline",
      subtitle: "Navigate through the years of our love story"
    },
    es: {
      title: "Línea de Tiempo de Nuestro Viaje",
      subtitle: "Navega a través de los años de nuestra historia de amor"
    }
  };

  const text = content?.[currentLanguage];

  const timelineYears = [
    { 
      year: 2020, 
      label: { en: "First Meeting", es: "Primer Encuentro" },
      icon: "Sparkles",
      count: 12
    },
    { 
      year: 2021, 
      label: { en: "Dating Adventures", es: "Aventuras de Citas" },
      icon: "Heart",
      count: 28
    },
    { 
      year: 2022, 
      label: { en: "Growing Together", es: "Creciendo Juntos" },
      icon: "Users",
      count: 35
    },
    { 
      year: 2023, 
      label: { en: "Special Moments", es: "Momentos Especiales" },
      icon: "Star",
      count: 42
    },
    { 
      year: 2024, 
      label: { en: "The Proposal", es: "La Propuesta" },
      icon: "Gift",
      count: 33
    }
  ];

  return (
    <div className="bg-gradient-to-br from-[var(--color-secondary)] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-2">
            {text?.title}
          </h2>
          <p className="text-[var(--color-muted-foreground)]">
            {text?.subtitle}
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--color-primary)]/20 -translate-y-1/2 hidden lg:block"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 relative">
            {timelineYears?.map((item, index) => (
              <button
                key={item?.year}
                onClick={() => onYearClick(item?.year)}
                className={`w-full lg:w-auto flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                  activeYear === item?.year
                    ? 'bg-[var(--color-primary)] text-white shadow-lg scale-105'
                    : 'bg-white text-[var(--color-foreground)] hover:bg-[var(--color-primary)]/10 shadow-md'
                }`}
              >
                <div className={`w-16 h-16 flex items-center justify-center rounded-full transition-colors duration-300 ${
                  activeYear === item?.year
                    ? 'bg-white/20' :'bg-[var(--color-primary)]/10'
                }`}>
                  <Icon 
                    name={item?.icon} 
                    size={28} 
                    color={activeYear === item?.year ? 'white' : 'var(--color-primary)'} 
                  />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{item?.year}</div>
                  <div className="text-sm font-medium mb-1">{item?.label?.[currentLanguage]}</div>
                  <div className="text-xs opacity-75">{item?.count} photos</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;