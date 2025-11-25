import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LanguageToggle = ({ language, onLanguageChange }) => {
  return (
    <div className="fixed top-24 right-4 z-40 bg-card rounded-lg shadow-lg border border-border p-2">
      <div className="flex gap-2">
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onLanguageChange('en')}
          className={`${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Icon name="Globe" size={16} className="mr-1" />
          EN
        </Button>
        <Button
          variant={language === 'es' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onLanguageChange('es')}
          className={`${language === 'es' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Icon name="Globe" size={16} className="mr-1" />
          ES
        </Button>
      </div>
    </div>
  );
};

export default LanguageToggle;