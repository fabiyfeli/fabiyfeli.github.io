import Icon from '../../../components/AppIcon';

const LanguageToggle = ({ language, onLanguageChange }) => {
  return (
    <div className="fixed top-20 right-4 z-40">
      <div className="bg-card border border-border rounded-full shadow-lg p-1 flex gap-1">
        <button
          onClick={() => onLanguageChange('es')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            language === 'es'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-label="Español"
        >
          <span className="text-lg">🇪🇸</span>
          <span className="text-sm font-medium hidden sm:inline">ES</span>
        </button>
        <button
          onClick={() => onLanguageChange('en')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            language === 'en'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-label="English"
        >
          <span className="text-lg">🇺🇸</span>
          <span className="text-sm font-medium hidden sm:inline">EN</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
