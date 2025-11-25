import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const FilterBar = ({ onFilterChange, onSearchChange, currentLanguage, totalMessages }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryOptions = currentLanguage === 'es'
    ? [
        { value: 'all', label: 'Todos los Mensajes' },
        { value: 'memory', label: 'Recuerdos' },
        { value: 'wish', label: 'Buenos Deseos' },
        { value: 'advice', label: 'Consejos' },
        { value: 'congratulations', label: 'Felicitaciones' }
      ]
    : [
        { value: 'all', label: 'All Messages' },
        { value: 'memory', label: 'Memories' },
        { value: 'wish', label: 'Wishes' },
        { value: 'advice', label: 'Advice' },
        { value: 'congratulations', label: 'Congratulations' }
      ];

  const relationshipOptions = currentLanguage === 'es'
    ? [
        { value: 'all', label: 'Todas las Relaciones' },
        { value: 'family', label: 'Familia' },
        { value: 'friend', label: 'Amigos' },
        { value: 'colleague', label: 'Colegas' }
      ]
    : [
        { value: 'all', label: 'All Relationships' },
        { value: 'family', label: 'Family' },
        { value: 'friend', label: 'Friends' },
        { value: 'colleague', label: 'Colleagues' }
      ];

  const handleCategoryChange = (value) => {
    setActiveFilter(value);
    onFilterChange('category', value);
  };

  const handleRelationshipChange = (value) => {
    onFilterChange('relationship', value);
  };

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <div className="bg-card rounded-xl p-4 lg:p-6 shadow-sm border border-border mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={currentLanguage === 'es' ? 'Buscar mensajes...' : 'Search messages...'}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
          <Select
            options={categoryOptions}
            value={activeFilter}
            onChange={handleCategoryChange}
            className="sm:w-48"
          />
          <Select
            options={relationshipOptions}
            onChange={(value) => handleRelationshipChange(value)}
            className="sm:w-48"
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="MessageSquare" size={16} />
          <span>
            {currentLanguage === 'es' 
              ? `${totalMessages} mensajes totales` 
              : `${totalMessages} total messages`}
          </span>
        </div>
        <button
          onClick={() => {
            setActiveFilter('all');
            setSearchQuery('');
            onFilterChange('category', 'all');
            onFilterChange('relationship', 'all');
            onSearchChange('');
          }}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
        >
          <Icon name="RotateCcw" size={14} />
          <span>{currentLanguage === 'es' ? 'Limpiar filtros' : 'Clear filters'}</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;