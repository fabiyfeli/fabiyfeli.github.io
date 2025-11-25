import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GuestInfoStep = ({ formData, onUpdate, onNext }) => {
  const [errors, setErrors] = useState({});

  const attendanceOptions = [
    { value: 'yes', label: 'Joyfully Accept' },
    { value: 'no', label: 'Regretfully Decline' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' }
  ];

  const validateStep = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData?.attendance) {
      newErrors.attendance = 'Please select your attendance status';
    }
    
    if (!formData?.language) {
      newErrors.language = 'Please select your preferred language';
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
            <Icon name="User" size={20} color="var(--color-primary)" />
          </div>
          <h2 className="text-2xl font-headline text-foreground">Guest Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            value={formData?.firstName || ''}
            onChange={(e) => onUpdate({ firstName: e?.target?.value })}
            error={errors?.firstName}
            required
          />

          <Input
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            value={formData?.lastName || ''}
            onChange={(e) => onUpdate({ lastName: e?.target?.value })}
            error={errors?.lastName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={formData?.email || ''}
            onChange={(e) => onUpdate({ email: e?.target?.value })}
            error={errors?.email}
            description="We'll send your confirmation here"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData?.phone || ''}
            onChange={(e) => onUpdate({ phone: e?.target?.value })}
            error={errors?.phone}
            required
          />

          <Select
            label="Will you be attending?"
            options={attendanceOptions}
            value={formData?.attendance || ''}
            onChange={(value) => onUpdate({ attendance: value })}
            error={errors?.attendance}
            placeholder="Select your response"
            required
          />

          <Select
            label="Preferred Language"
            options={languageOptions}
            value={formData?.language || ''}
            onChange={(value) => onUpdate({ language: value })}
            error={errors?.language}
            placeholder="Choose language"
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
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

export default GuestInfoStep;