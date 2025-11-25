import { useState } from 'react';
import Header from '../../components/Header';
import RSVPHero from './components/RSVPHero';
import ProgressIndicator from './components/ProgressIndicator';
import GuestInfoStep from './components/GuestInfoStep';
import PlusOneStep from './components/PlusOneStep';
import MealPreferencesStep from './components/MealPreferencesStep';
import SpecialRequirementsStep from './components/SpecialRequirementsStep';
import ReviewStep from './components/ReviewStep';
import ConfirmationModal from './components/ConfirmationModal';
import Icon from '../../components/AppIcon';

const RSVP = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    attendance: '',
    language: '',
    hasPlusOne: false,
    plusOneFirstName: '',
    plusOneLastName: '',
    mealPreference: '',
    plusOneMealPreference: '',
    dietaryRestrictions: '',
    needsWheelchairAccess: false,
    needsHearingAssistance: false,
    needsVisualAssistance: false,
    needsTransportation: false,
    needsAccommodation: false,
    specialNotes: ''
  });

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GuestInfoStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PlusOneStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <MealPreferencesStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <SpecialRequirementsStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="main-content">
        <RSVPHero />

        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProgressIndicator currentStep={currentStep} totalSteps={5} />
            
            {renderStep()}

            <div className="mt-12 bg-card rounded-xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                  <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you have any questions or need assistance with your RSVP, please don't hesitate to reach out to us.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="mailto:contact@fabiyfeli.cl"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Icon name="Mail" size={16} />
                      contact@fabiyfeli.cl
                    </a>
                    <a
                      href="tel:+15551234567"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Icon name="Phone" size={16} />
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-card/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Icon name="Heart" size={48} color="var(--color-primary)" className="mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground italic">
              "Your presence is the greatest gift we could ask for"
            </p>
          </div>
        </section>
      </main>
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date()?.getFullYear()} Eternal Vows. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {showConfirmation && (
        <ConfirmationModal
          formData={formData}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default RSVP;