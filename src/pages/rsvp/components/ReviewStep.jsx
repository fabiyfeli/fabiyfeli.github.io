import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ReviewStep = ({ formData, onBack, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mealLabels = {
    beef: 'Grilled Beef Tenderloin',
    chicken: 'Herb-Crusted Chicken',
    fish: 'Pan-Seared Salmon',
    vegetarian: 'Vegetarian Risotto',
    vegan: 'Vegan Mediterranean Bowl'
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit();
  };

  const InfoSection = ({ icon, title, children }) => (
    <div className="bg-background rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
          <Icon name={icon} size={16} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-start">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium text-foreground text-right">{value || 'Not provided'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Icon name="CheckCircle2" size={20} color="var(--color-primary)" />
          </div>
          <h2 className="text-2xl font-headline text-foreground">Review Your RSVP</h2>
        </div>

        <p className="text-muted-foreground mb-6">
          Please review your information before submitting. You can go back to make any changes.
        </p>

        <div className="space-y-4">
          <InfoSection icon="User" title="Guest Information">
            <InfoRow label="Name" value={`${formData?.firstName} ${formData?.lastName}`} />
            <InfoRow label="Email" value={formData?.email} />
            <InfoRow label="Phone" value={formData?.phone} />
            <InfoRow label="Attendance" value={formData?.attendance === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline'} />
            <InfoRow label="Language" value={formData?.language === 'en' ? 'English' : 'Español'} />
          </InfoSection>

          {formData?.hasPlusOne && (
            <InfoSection icon="Users" title="Plus One">
              <InfoRow label="Name" value={`${formData?.plusOneFirstName} ${formData?.plusOneLastName}`} />
            </InfoSection>
          )}

          {formData?.attendance === 'yes' && (
            <InfoSection icon="UtensilsCrossed" title="Meal Preferences">
              <InfoRow label="Your Meal" value={mealLabels?.[formData?.mealPreference]} />
              {formData?.hasPlusOne && (
                <InfoRow label="Plus One Meal" value={mealLabels?.[formData?.plusOneMealPreference]} />
              )}
              {formData?.dietaryRestrictions && (
                <InfoRow label="Dietary Restrictions" value={formData?.dietaryRestrictions} />
              )}
            </InfoSection>
          )}

          {(formData?.needsWheelchairAccess || formData?.needsHearingAssistance || formData?.needsVisualAssistance || formData?.needsTransportation || formData?.needsAccommodation || formData?.specialNotes) && (
            <InfoSection icon="Settings" title="Special Requirements">
              {formData?.needsWheelchairAccess && (
                <InfoRow label="Wheelchair Access" value="Required" />
              )}
              {formData?.needsHearingAssistance && (
                <InfoRow label="Hearing Assistance" value="Required" />
              )}
              {formData?.needsVisualAssistance && (
                <InfoRow label="Visual Assistance" value="Required" />
              )}
              {formData?.needsTransportation && (
                <InfoRow label="Transportation" value="Assistance needed" />
              )}
              {formData?.needsAccommodation && (
                <InfoRow label="Accommodation" value="Recommendations needed" />
              )}
              {formData?.specialNotes && (
                <InfoRow label="Additional Notes" value={formData?.specialNotes} />
              )}
            </InfoSection>
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
          disabled={isSubmitting}
        >
          Back
        </Button>

        <Button
          type="button"
          variant="default"
          size="lg"
          iconName="Send"
          iconPosition="right"
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;