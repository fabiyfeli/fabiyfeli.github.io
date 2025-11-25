import { useState } from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SpecialRequirementsStep = ({ formData, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e?.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Icon name="Settings" size={20} color="var(--color-primary)" />
          </div>
          <h2 className="text-2xl font-headline text-foreground">Special Requirements</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Accessibility Needs</p>
            
            <Checkbox
              label="Wheelchair accessibility required"
              checked={formData?.needsWheelchairAccess || false}
              onChange={(e) => onUpdate({ needsWheelchairAccess: e?.target?.checked })}
            />

            <Checkbox
              label="Hearing assistance required"
              checked={formData?.needsHearingAssistance || false}
              onChange={(e) => onUpdate({ needsHearingAssistance: e?.target?.checked })}
            />

            <Checkbox
              label="Visual assistance required"
              checked={formData?.needsVisualAssistance || false}
              onChange={(e) => onUpdate({ needsVisualAssistance: e?.target?.checked })}
            />
          </div>

          <div className="pt-6 border-t border-border space-y-4">
            <p className="text-sm font-medium text-foreground">Transportation & Accommodation</p>
            
            <Checkbox
              label="I need transportation assistance"
              description="We can help arrange transportation to and from the venue"
              checked={formData?.needsTransportation || false}
              onChange={(e) => onUpdate({ needsTransportation: e?.target?.checked })}
            />

            <Checkbox
              label="I need accommodation recommendations"
              description="We'll send you our preferred hotel options"
              checked={formData?.needsAccommodation || false}
              onChange={(e) => onUpdate({ needsAccommodation: e?.target?.checked })}
            />
          </div>

          <Input
            label="Additional Notes or Special Requests"
            type="text"
            placeholder="Any other requirements or information we should know"
            value={formData?.specialNotes || ''}
            onChange={(e) => onUpdate({ specialNotes: e?.target?.value })}
            description="Optional: Share any other needs or preferences"
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
          Review & Submit
        </Button>
      </div>
    </form>
  );
};

export default SpecialRequirementsStep;