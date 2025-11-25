import { useState } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MealPreferencesStep = ({ formData, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const mealOptions = [
    { value: 'beef', label: 'Grilled Beef Tenderloin', description: 'With roasted vegetables and herb butter' },
    { value: 'chicken', label: 'Herb-Crusted Chicken', description: 'With garlic mashed potatoes' },
    { value: 'fish', label: 'Pan-Seared Salmon', description: 'With lemon butter sauce' },
    { value: 'vegetarian', label: 'Vegetarian Risotto', description: 'With seasonal vegetables' },
    { value: 'vegan', label: 'Vegan Mediterranean Bowl', description: 'With quinoa and roasted vegetables' }
  ];

  const validateStep = () => {
    const newErrors = {};
    
    if (formData?.attendance === 'yes' && !formData?.mealPreference) {
      newErrors.mealPreference = 'Please select your meal preference';
    }
    
    if (formData?.hasPlusOne && !formData?.plusOneMealPreference) {
      newErrors.plusOneMealPreference = 'Please select plus one meal preference';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateStep()) {
      onNext();
    }
  };

  if (formData?.attendance === 'no') {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 sm:p-8 border border-border text-center">
          <Icon name="Heart" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-headline text-foreground mb-2">We'll Miss You</h2>
          <p className="text-muted-foreground">
            Since you won't be attending, you can skip the meal preferences
          </p>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            size="lg"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={onBack}
          >
            Back
          </Button>

          <Button
            type="button"
            variant="default"
            size="lg"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Icon name="UtensilsCrossed" size={20} color="var(--color-primary)" />
          </div>
          <h2 className="text-2xl font-headline text-foreground">Meal Preferences</h2>
        </div>

        <div className="space-y-6">
          <Select
            label={`Meal Selection for ${formData?.firstName || 'You'}`}
            options={mealOptions}
            value={formData?.mealPreference || ''}
            onChange={(value) => onUpdate({ mealPreference: value })}
            error={errors?.mealPreference}
            placeholder="Choose your entrée"
            required
          />

          {formData?.hasPlusOne && (
            <Select
              label={`Meal Selection for ${formData?.plusOneFirstName || 'Plus One'}`}
              options={mealOptions}
              value={formData?.plusOneMealPreference || ''}
              onChange={(value) => onUpdate({ plusOneMealPreference: value })}
              error={errors?.plusOneMealPreference}
              placeholder="Choose entrée for plus one"
              required
            />
          )}

          <Input
            label="Dietary Restrictions or Allergies"
            type="text"
            placeholder="e.g., Gluten-free, Nut allergy, Lactose intolerant"
            value={formData?.dietaryRestrictions || ''}
            onChange={(e) => onUpdate({ dietaryRestrictions: e?.target?.value })}
            description="Please let us know about any dietary needs"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          iconName="ArrowLeft"
          iconPosition="left"
          onClick={onBack}
        >
          Back
        </Button>

        <Button
          type="submit"
          variant="default"
          size="lg"
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

export default MealPreferencesStep;