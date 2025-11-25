import { useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfirmationModal = ({ formData, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20">
            <Icon name="CheckCircle2" size={32} color="#22c55e" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-headline text-center text-foreground mb-2">
            RSVP Confirmed!
          </h2>

          <p className="text-center text-muted-foreground mb-6">
            {formData?.attendance === 'yes'
              ? `Thank you for confirming your attendance, ${formData?.firstName}! We can't wait to celebrate with you.`
              : `Thank you for letting us know, ${formData?.firstName}. You'll be missed on our special day.`}
          </p>

          <div className="bg-background rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="Mail" size={20} color="var(--color-primary)" className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Confirmation Email Sent
                </p>
                <p className="text-xs text-muted-foreground">
                  We've sent a confirmation to <span className="font-medium">{formData?.email}</span> with all the details.
                </p>
              </div>
            </div>
          </div>

          {formData?.attendance === 'yes' && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="Calendar" size={20} color="var(--color-primary)" className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Mark Your Calendar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We'll send you a reminder closer to the date along with venue details and directions.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="default"
            size="lg"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;