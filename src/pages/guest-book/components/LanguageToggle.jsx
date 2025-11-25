import Icon from '../../../components/AppIcon';

const LanguageToggle = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-2 bg-card rounded-lg p-1 border border-border shadow-sm">
      <button
        onClick={() => onLanguageChange('en')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentLanguage === 'en' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Icon name="Globe" size={16} />
        <span>English</span>
      </button>
      <button
        onClick={() => onLanguageChange('es')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentLanguage === 'es' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Icon name="Globe" size={16} />
        <span>Español</span>
      </button>
    </div>
  );
};

export default LanguageToggle;