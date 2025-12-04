import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ReviewStep = ({ formData, onBack, onSubmit, language = 'es' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    es: {
      title: 'Revisa tu Confirmación',
      description: 'Por favor revisa tu información antes de enviar. Puedes regresar para hacer cambios.',
      guestInfo: 'Información del Invitado',
      name: 'Nombre',
      email: 'Correo',
      phone: 'Teléfono',
      attendance: 'Asistencia',
      attendanceYes: 'Acepto con alegría',
      attendanceNo: 'Lamentablemente no podré',
      language: 'Idioma',
      plusOne: 'Acompañante',
      mealPreferences: 'Preferencias de Comida',
      yourMeal: 'Tu Comida',
      plusOneMeal: 'Comida del Acompañante',
      dietaryRestrictions: 'Restricciones Alimentarias',
      specialRequirements: 'Requisitos Especiales',
      wheelchairAccess: 'Acceso para Silla de Ruedas',
      hearingAssistance: 'Asistencia Auditiva',
      visualAssistance: 'Asistencia Visual',
      transportation: 'Transporte',
      accommodation: 'Alojamiento',
      additionalNotes: 'Notas Adicionales',
      required: 'Requerido',
      assistanceNeeded: 'Asistencia necesaria',
      recommendationsNeeded: 'Recomendaciones necesarias',
      notProvided: 'No proporcionado',
      back: 'Atrás',
      submit: 'Enviar Confirmación',
      submitting: 'Enviando...'
    },
    en: {
      title: 'Review Your RSVP',
      description: 'Please review your information before submitting. You can go back to make any changes.',
      guestInfo: 'Guest Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      attendance: 'Attendance',
      attendanceYes: 'Joyfully Accept',
      attendanceNo: 'Regretfully Decline',
      language: 'Language',
      plusOne: 'Plus One',
      mealPreferences: 'Meal Preferences',
      yourMeal: 'Your Meal',
      plusOneMeal: 'Plus One Meal',
      dietaryRestrictions: 'Dietary Restrictions',
      specialRequirements: 'Special Requirements',
      wheelchairAccess: 'Wheelchair Access',
      hearingAssistance: 'Hearing Assistance',
      visualAssistance: 'Visual Assistance',
      transportation: 'Transportation',
      accommodation: 'Accommodation',
      additionalNotes: 'Additional Notes',
      required: 'Required',
      assistanceNeeded: 'Assistance needed',
      recommendationsNeeded: 'Recommendations needed',
      notProvided: 'Not provided',
      back: 'Back',
      submit: 'Submit RSVP',
      submitting: 'Submitting...'
    }
  };

  const t = content[language];

  const mealLabels = {
    beef: language === 'es' ? 'Lomo de Res a la Parrilla' : 'Grilled Beef Tenderloin',
    chicken: language === 'es' ? 'Pollo con Hierbas' : 'Herb-Crusted Chicken',
    fish: language === 'es' ? 'Salmón a la Plancha' : 'Pan-Seared Salmon',
    vegetarian: language === 'es' ? 'Risotto Vegetariano' : 'Vegetarian Risotto',
    vegan: language === 'es' ? 'Bowl Mediterráneo Vegano' : 'Vegan Mediterranean Bowl'
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
      <span className="text-sm font-medium text-foreground text-right">{value || t.notProvided}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Icon name="CheckCircle2" size={20} color="var(--color-primary)" />
          </div>
          <h2 className="text-2xl font-headline text-foreground">{t.title}</h2>
        </div>

        <p className="text-muted-foreground mb-6">
          {t.description}
        </p>

        <div className="space-y-4">
          <InfoSection icon="User" title={t.guestInfo}>
            <InfoRow label={t.name} value={`${formData?.firstName} ${formData?.lastName}`} />
            <InfoRow label={t.email} value={formData?.email} />
            <InfoRow label={t.phone} value={formData?.phone} />
            <InfoRow label={t.attendance} value={formData?.attendance === 'yes' ? t.attendanceYes : t.attendanceNo} />
            <InfoRow label={t.language} value={formData?.language === 'en' ? 'English' : 'Español'} />
          </InfoSection>

          {formData?.hasPlusOne && (
            <InfoSection icon="Users" title={t.plusOne}>
              <InfoRow label={t.name} value={`${formData?.plusOneFirstName} ${formData?.plusOneLastName}`} />
            </InfoSection>
          )}

          {formData?.attendance === 'yes' && formData?.dietaryRestrictions && (
            <InfoSection icon="UtensilsCrossed" title={t.dietaryRestrictions}>
              <InfoRow label={t.dietaryRestrictions} value={formData?.dietaryRestrictions} />
            </InfoSection>
          )}

          {(formData?.needsWheelchairAccess || formData?.needsHearingAssistance || formData?.needsVisualAssistance || formData?.needsTransportation || formData?.needsAccommodation || formData?.specialNotes) && (
            <InfoSection icon="Settings" title={t.specialRequirements}>
              {formData?.needsWheelchairAccess && (
                <InfoRow label={t.wheelchairAccess} value={t.required} />
              )}
              {formData?.needsHearingAssistance && (
                <InfoRow label={t.hearingAssistance} value={t.required} />
              )}
              {formData?.needsVisualAssistance && (
                <InfoRow label={t.visualAssistance} value={t.required} />
              )}
              {formData?.needsTransportation && (
                <InfoRow label={t.transportation} value={t.assistanceNeeded} />
              )}
              {formData?.needsAccommodation && (
                <InfoRow label={t.accommodation} value={t.recommendationsNeeded} />
              )}
              {formData?.specialNotes && (
                <InfoRow label={t.additionalNotes} value={formData?.specialNotes} />
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
          {t.back}
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
          {isSubmitting ? t.submitting : t.submit}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;