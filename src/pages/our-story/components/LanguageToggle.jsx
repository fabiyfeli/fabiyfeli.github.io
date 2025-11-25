import Icon from '../../../components/AppIcon';

const LanguageToggle = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="fixed top-24 right-4 z-40 bg-card rounded-full shadow-lg border border-border overflow-hidden">
      <div className="flex items-center">
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            currentLanguage === 'en' ?'bg-primary text-white' :'text-muted-foreground hover:bg-muted'
          }`}
          aria-label="Switch to English"
        >
          <Icon name="Globe" size={16} />
          <span>EN</span>
        </button>
        <button
          onClick={() => onLanguageChange('es')}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            currentLanguage === 'es' ?'bg-primary text-white' :'text-muted-foreground hover:bg-muted'
          }`}
          aria-label="Cambiar a Español"
        >
          <Icon name="Globe" size={16} />
          <span>ES</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;