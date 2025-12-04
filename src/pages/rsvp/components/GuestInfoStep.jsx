import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GuestInfoStep = ({ formData, onUpdate, onNext, onSubmit, language = 'es' }) => {
  const [errors, setErrors] = useState({});

  const content = {
    es: {
      title: 'Confirmación de invitados',
      firstName: 'Nombre',
      firstNamePlaceholder: 'Ingresa tu nombre',
      lastName: 'Apellido',
      lastNamePlaceholder: 'Ingresa tu apellido',
      email: 'Correo electrónico',
      emailPlaceholder: 'tu.correo@ejemplo.com',
      emailDescription: 'Te enviaremos tu confirmación aquí',
      phone: 'Teléfono',
      phonePlaceholder: '+56 9 1234 5678',
      attendance: '¿Asistirás?',
      attendanceYes: 'Acepto con alegría',
      attendanceNo: 'Lamentablemente no podré',
      attendancePlaceholder: 'Selecciona tu respuesta',
      preferredLanguage: 'Idioma preferido',
      languagePlaceholder: 'Elige idioma',
      continue: 'Continuar',
      submit: 'Enviar confirmación',
      errorFirstName: 'El nombre es requerido',
      errorLastName: 'El apellido es requerido',
      errorEmail: 'El correo electrónico es requerido',
      errorEmailInvalid: 'Por favor ingresa un correo electrónico válido',
      errorPhone: 'El teléfono es requerido',
      errorAttendance: 'Por favor selecciona tu estado de asistencia',
      errorLanguage: 'Por favor selecciona tu idioma preferido'
    },
    en: {
      title: 'Guest Confirmation',
      firstName: 'First Name',
      firstNamePlaceholder: 'Enter your first name',
      lastName: 'Last Name',
      lastNamePlaceholder: 'Enter your last name',
      email: 'Email Address',
      emailPlaceholder: 'your.email@example.com',
      emailDescription: 'We\'ll send your confirmation here',
      phone: 'Phone Number',
      phonePlaceholder: '+56 (9) 34340007',
      attendance: 'Will you be attending?',
      attendanceYes: 'Joyfully Accept',
      attendanceNo: 'Regretfully Decline',
      attendancePlaceholder: 'Select your response',
      preferredLanguage: 'Preferred Language',
      languagePlaceholder: 'Choose language',
      continue: 'Continue',
      submit: 'Submit Confirmation',
      errorFirstName: 'First name is required',
      errorLastName: 'Last name is required',
      errorEmail: 'Email is required',
      errorEmailInvalid: 'Please enter a valid email address',
      errorPhone: 'Phone number is required',
      errorAttendance: 'Please select your attendance status',
      errorLanguage: 'Please select your preferred language'
    }
  };

  const t = content[language];

  const attendanceOptions = [
    { value: 'yes', label: t.attendanceYes },
    { value: 'no', label: t.attendanceNo }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' }
  ];

  const validateStep = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = t.errorFirstName;
    }
    
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = t.errorLastName;
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = t.errorEmail;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = t.errorEmailInvalid;
    }
    
    if (!formData?.phone?.trim()) {
      newErrors.phone = t.errorPhone;
    }
    
    if (!formData?.attendance) {
      newErrors.attendance = t.errorAttendance;
    }
    
    if (!formData?.language) {
      newErrors.language = t.errorLanguage;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleContinue = (e) => {
    e?.preventDefault();
    if (validateStep()) {
      if (formData?.attendance === 'no') {
        onSubmit();
      } else {
        onNext();
      }
    }
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Icon name="User" size={20} color="var(--color-primary)" />
          </div>
          <h2 className="text-2xl font-headline text-foreground">{t.title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label={t.firstName}
            type="text"
            placeholder={t.firstNamePlaceholder}
            value={formData?.firstName || ''}
            onChange={(e) => onUpdate({ firstName: e?.target?.value })}
            error={errors?.firstName}
            required
          />

          <Input
            label={t.lastName}
            type="text"
            placeholder={t.lastNamePlaceholder}
            value={formData?.lastName || ''}
            onChange={(e) => onUpdate({ lastName: e?.target?.value })}
            error={errors?.lastName}
            required
          />

          <Input
            label={t.email}
            type="email"
            placeholder={t.emailPlaceholder}
            value={formData?.email || ''}
            onChange={(e) => onUpdate({ email: e?.target?.value })}
            error={errors?.email}
            description={t.emailDescription}
            required
          />

          <Input
            label={t.phone}
            type="tel"
            placeholder={t.phonePlaceholder}
            value={formData?.phone || ''}
            onChange={(e) => onUpdate({ phone: e?.target?.value })}
            error={errors?.phone}
            required
          />

          <Select
            label={t.attendance}
            options={attendanceOptions}
            value={formData?.attendance || ''}
            onChange={(value) => onUpdate({ attendance: value })}
            error={errors?.attendance}
            placeholder={t.attendancePlaceholder}
            required
          />

          <Select
            label={t.preferredLanguage}
            options={languageOptions}
            value={formData?.language || ''}
            onChange={(value) => onUpdate({ language: value })}
            error={errors?.language}
            placeholder={t.languagePlaceholder}
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="default"
          size="lg"
          iconName={formData?.attendance === 'no' ? 'Check' : 'ArrowRight'}
          iconPosition="right"
        >
          {formData?.attendance === 'no' ? t.submit : t.continue}
        </Button>
      </div>
    </form>
  );
};

export default GuestInfoStep;