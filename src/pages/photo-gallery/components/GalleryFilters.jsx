import React from 'react';
import Icon from '../../../components/AppIcon';

const GalleryFilters = ({ currentLanguage, activeFilter, onFilterChange, categories }) => {
  const content = {
    en: {
      filterLabel: "Filter by:",
      allPhotos: "All Photos"
    },
    es: {
      filterLabel: "Filtrar por:",
      allPhotos: "Todas las Fotos"
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="bg-white border-b border-[var(--color-border)] sticky top-20 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-sm font-semibold text-[var(--color-foreground)] flex items-center gap-2">
            <Icon name="Filter" size={18} color="var(--color-primary)" />
            {text?.filterLabel}
          </span>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeFilter === 'all' ?'bg-[var(--color-primary)] text-white shadow-md' :'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-primary)]/10'
              }`}
            >
              {text?.allPhotos}
            </button>
            
            {categories?.map((category) => (
              <button
                key={category?.id}
                onClick={() => onFilterChange(category?.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === category?.id
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-primary)]/10'
                }`}
              >
                <Icon name={category?.icon} size={16} />
                {category?.label?.[currentLanguage]}
                <span className="text-xs opacity-75">({category?.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryFilters;