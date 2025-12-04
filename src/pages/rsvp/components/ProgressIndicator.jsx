import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, language = 'es' }) => {
  const labels = {
    es: ['Confirmación', /* 'Acompañante', 'Menú', */ 'Requisitos', 'Revisar'],
    en: ['Confirmation', /* 'Plus One', 'Meals', */ 'Requirements', 'Review']
  };

  const steps = [
    { number: 1, label: labels[language][0], icon: 'User' },
    // { number: 2, label: labels[language][1], icon: 'Users' }, // Plus One step removed
    // { number: 2, label: labels[language][1], icon: 'UtensilsCrossed' }, // Meal Preferences step removed
    { number: 2, label: labels[language][1], icon: 'Settings' },
    { number: 3, label: labels[language][2], icon: 'CheckCircle2' }
  ];

  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <div key={step?.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <div
                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all ${
                  currentStep === step?.number
                    ? 'bg-primary border-primary text-white scale-110'
                    : currentStep > step?.number
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-background border-border text-muted-foreground'
                }`}
              >
                {currentStep > step?.number ? (
                  <Icon name="Check" size={20} color="var(--color-primary)" />
                ) : (
                  <Icon
                    name={step?.icon}
                    size={18}
                    color={
                      currentStep === step?.number
                        ? '#ffffff'
                        : currentStep > step?.number
                        ? 'var(--color-primary)'
                        : 'var(--color-muted-foreground)'
                    }
                  />
                )}
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-medium text-center whitespace-nowrap ${
                  currentStep >= step?.number ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step?.label}
              </span>
            </div>
            {index < steps?.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  currentStep > step?.number ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;