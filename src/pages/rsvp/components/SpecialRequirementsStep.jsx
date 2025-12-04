import { useState } from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SpecialRequirementsStep = ({ formData, onUpdate, onNext, onBack, language = 'es' }) => {
  const [errors, setErrors] = useState({});

  const content = {
    es: {
      title: 'Requisitos Especiales',
      dietaryTitle: 'Restricciones Alimentarias',
      dietaryLabel: 'Restricciones o Preferencias Alimentarias',
      dietaryPlaceholder: 'Ej: vegetariano, vegano, sin gluten, alergias, etc.',
      dietaryDescription: 'Por favor indícanos si tienes alguna restricción alimentaria',
      accessibilityTitle: 'Necesidades de Accesibilidad',
      wheelchairLabel: 'Requiero accesibilidad para silla de ruedas',
      hearingLabel: 'Requiero asistencia auditiva',
      visualLabel: 'Requiero asistencia visual',
      transportTitle: 'Transporte y Alojamiento',
      transportLabel: 'Necesito asistencia con transporte',
      transportDesc: 'Podemos ayudar a coordinar transporte hacia y desde el lugar',
      accommodationLabel: 'Necesito recomendaciones de alojamiento',
      accommodationDesc: 'Te enviaremos nuestras opciones de hoteles preferidos',
      notesLabel: 'Notas Adicionales o Peticiones Especiales',
      notesPlaceholder: 'Cualquier otro requisito o información que debamos saber',
      notesDescription: 'Opcional: Comparte cualquier otra necesidad o preferencia',
      back: 'Atrás',
      continue: 'Revisar y Enviar'
    },
    en: {
      title: 'Special Requirements',
      dietaryTitle: 'Dietary Restrictions',
      dietaryLabel: 'Dietary Restrictions or Preferences',
      dietaryPlaceholder: 'E.g.: vegetarian, vegan, gluten-free, allergies, etc.',
      dietaryDescription: 'Please let us know if you have any dietary restrictions',
      accessibilityTitle: 'Accessibility Needs',
      wheelchairLabel: 'Wheelchair accessibility required',
      hearingLabel: 'Hearing assistance required',
      visualLabel: 'Visual assistance required',
      transportTitle: 'Transportation & Accommodation',
      transportLabel: 'I need transportation assistance',
      transportDesc: 'We can help arrange transportation to and from the venue',
      accommodationLabel: 'I need accommodation recommendations',
      accommodationDesc: 'We\'ll send you our preferred hotel options',
      notesLabel: 'Additional Notes or Special Requests',
      notesPlaceholder: 'Any other requirements or information we should know',
      notesDescription: 'Optional: Share any other needs or preferences',
      back: 'Back',
      continue: 'Review & Submit'
    }
  };

  const t = content[language];

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
          <h2 className="text-2xl font-headline text-foreground">{t.title}</h2>
        </div>

        <div className="space-y-6">
          {/* Dietary Restrictions Section */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">{t.dietaryTitle}</p>
            
            <Input
              label={t.dietaryLabel}
              type="text"
              placeholder={t.dietaryPlaceholder}
              value={formData?.dietaryRestrictions || ''}
              onChange={(e) => onUpdate({ dietaryRestrictions: e?.target?.value })}
              description={t.dietaryDescription}
            />
          </div>

          <div className="pt-6 border-t border-border space-y-4">
            <p className="text-sm font-medium text-foreground">{t.accessibilityTitle}</p>
            
            <Checkbox
              label={t.wheelchairLabel}
              checked={formData?.needsWheelchairAccess || false}
              onChange={(e) => onUpdate({ needsWheelchairAccess: e?.target?.checked })}
            />

            <Checkbox
              label={t.hearingLabel}
              checked={formData?.needsHearingAssistance || false}
              onChange={(e) => onUpdate({ needsHearingAssistance: e?.target?.checked })}
            />

            <Checkbox
              label={t.visualLabel}
              checked={formData?.needsVisualAssistance || false}
              onChange={(e) => onUpdate({ needsVisualAssistance: e?.target?.checked })}
            />
          </div>

          <div className="pt-6 border-t border-border space-y-4">
            <p className="text-sm font-medium text-foreground">{t.transportTitle}</p>
            
            <Checkbox
              label={t.transportLabel}
              description={t.transportDesc}
              checked={formData?.needsTransportation || false}
              onChange={(e) => onUpdate({ needsTransportation: e?.target?.checked })}
            />

            <Checkbox
              label={t.accommodationLabel}
              description={t.accommodationDesc}
              checked={formData?.needsAccommodation || false}
              onChange={(e) => onUpdate({ needsAccommodation: e?.target?.checked })}
            />
          </div>

          <Input
            label={t.notesLabel}
            type="text"
            placeholder={t.notesPlaceholder}
            value={formData?.specialNotes || ''}
            onChange={(e) => onUpdate({ specialNotes: e?.target?.value })}
            description={t.notesDescription}
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
          {t.back}
        </Button>

        <Button
          type="submit"
          variant="default"
          size="lg"
          iconName="ArrowRight"
          iconPosition="right"
        >
          {t.continue}
        </Button>
      </div>
    </form>
  );
};

export default SpecialRequirementsStep;