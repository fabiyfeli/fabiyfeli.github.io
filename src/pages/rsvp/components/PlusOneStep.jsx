import { useState } from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PlusOneStep = ({ formData, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    
    if (formData?.hasPlusOne) {
      if (!formData?.plusOneFirstName?.trim()) {
        newErrors.plusOneFirstName = 'Plus one first name is required';
      }
      
      if (!formData?.plusOneLastName?.trim()) {
        newErrors.plusOneLastName = 'Plus one last name is required';
      }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Icon name="Users" size={20} color="var(--color-primary)" />
          </div>
          <h2 className="text-2xl font-headline text-foreground">Plus One</h2>
        </div>

        <div className="space-y-6">
          <Checkbox
            label="I would like to bring a plus one"
            description="Will you be bringing a guest with you?"
            checked={formData?.hasPlusOne || false}
            onChange={(e) => {
              const checked = e?.target?.checked;
              onUpdate({ 
                hasPlusOne: checked,
                plusOneFirstName: checked ? formData?.plusOneFirstName : '',
                plusOneLastName: checked ? formData?.plusOneLastName : '',
                plusOneMealPreference: checked ? formData?.plusOneMealPreference : ''
              });
            }}
          />

          {formData?.hasPlusOne && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <Input
                label="Plus One First Name"
                type="text"
                placeholder="Enter first name"
                value={formData?.plusOneFirstName || ''}
                onChange={(e) => onUpdate({ plusOneFirstName: e?.target?.value })}
                error={errors?.plusOneFirstName}
                required
              />

              <Input
                label="Plus One Last Name"
                type="text"
                placeholder="Enter last name"
                value={formData?.plusOneLastName || ''}
                onChange={(e) => onUpdate({ plusOneLastName: e?.target?.value })}
                error={errors?.plusOneLastName}
                required
              />
            </div>
          )}
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

export default PlusOneStep;