import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const MessageForm = ({ onSubmit, currentLanguage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: '',
    category: '',
    message: '',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const relationshipOptions = currentLanguage === 'es' 
    ? [
        { value: 'family', label: 'Familia' },
        { value: 'friend', label: 'Amigo/a' },
        { value: 'colleague', label: 'Colega' },
        { value: 'other', label: 'Otro' }
      ]
    : [
        { value: 'family', label: 'Family' },
        { value: 'friend', label: 'Friend' },
        { value: 'colleague', label: 'Colleague' },
        { value: 'other', label: 'Other' }
      ];

  const categoryOptions = currentLanguage === 'es'
    ? [
        { value: 'memory', label: 'Recuerdo Especial' },
        { value: 'wish', label: 'Buenos Deseos' },
        { value: 'advice', label: 'Consejo' },
        { value: 'congratulations', label: 'Felicitaciones' }
      ]
    : [
        { value: 'memory', label: 'Special Memory' },
        { value: 'wish', label: 'Well Wishes' },
        { value: 'advice', label: 'Advice' },
        { value: 'congratulations', label: 'Congratulations' }
      ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      if (file?.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          photo: currentLanguage === 'es' ?'El archivo debe ser menor a 5MB' :'File must be less than 5MB' 
        }));
        return;
      }
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader?.result);
      };
      reader?.readAsDataURL(file);
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) {
      newErrors.name = currentLanguage === 'es' ? 'El nombre es requerido' : 'Name is required';
    }
    if (!formData?.email?.trim()) {
      newErrors.email = currentLanguage === 'es' ? 'El correo es requerido' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = currentLanguage === 'es' ? 'Correo inválido' : 'Invalid email';
    }
    if (!formData?.relationship) {
      newErrors.relationship = currentLanguage === 'es' ? 'Selecciona tu relación' : 'Select your relationship';
    }
    if (!formData?.message?.trim()) {
      newErrors.message = currentLanguage === 'es' ? 'El mensaje es requerido' : 'Message is required';
    } else if (formData?.message?.trim()?.length < 10) {
      newErrors.message = currentLanguage === 'es' ?'El mensaje debe tener al menos 10 caracteres' :'Message must be at least 10 characters';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      relationship: '',
      category: '',
      message: '',
      photo: null
    });
    setPhotoPreview(null);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="MessageSquare" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-bold text-foreground">
            {currentLanguage === 'es' ? 'Deja tu Mensaje' : 'Leave Your Message'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {currentLanguage === 'es' ?'Comparte tus pensamientos y recuerdos' :'Share your thoughts and memories'}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={currentLanguage === 'es' ? 'Nombre Completo' : 'Full Name'}
            type="text"
            placeholder={currentLanguage === 'es' ? 'Tu nombre' : 'Your name'}
            value={formData?.name}
            onChange={(e) => handleChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />
          <Input
            label={currentLanguage === 'es' ? 'Correo Electrónico' : 'Email Address'}
            type="email"
            placeholder={currentLanguage === 'es' ? 'tu@correo.com' : 'your@email.com'}
            value={formData?.email}
            onChange={(e) => handleChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={currentLanguage === 'es' ? 'Tu Relación' : 'Your Relationship'}
            options={relationshipOptions}
            value={formData?.relationship}
            onChange={(value) => handleChange('relationship', value)}
            placeholder={currentLanguage === 'es' ? 'Selecciona...' : 'Select...'}
            error={errors?.relationship}
            required
          />
          <Select
            label={currentLanguage === 'es' ? 'Categoría del Mensaje' : 'Message Category'}
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleChange('category', value)}
            placeholder={currentLanguage === 'es' ? 'Opcional' : 'Optional'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {currentLanguage === 'es' ? 'Tu Mensaje' : 'Your Message'}
            <span className="text-error ml-1">*</span>
          </label>
          <textarea
            value={formData?.message}
            onChange={(e) => handleChange('message', e?.target?.value)}
            placeholder={currentLanguage === 'es' ?'Comparte tus pensamientos, recuerdos o buenos deseos...' :'Share your thoughts, memories, or well wishes...'}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            rows="6"
          />
          {errors?.message && (
            <p className="mt-1 text-sm text-error">{errors?.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {currentLanguage === 'es' ? 'Agregar Foto (Opcional)' : 'Add Photo (Optional)'}
          </label>
          {!photoPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {currentLanguage === 'es' ? 'Haz clic para subir' : 'Click to upload'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentLanguage === 'es' ? 'PNG, JPG hasta 5MB' : 'PNG, JPG up to 5MB'}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
          ) : (
            <div className="relative rounded-lg overflow-hidden">
              <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 p-2 bg-error text-white rounded-full hover:bg-error/90 transition-colors duration-200"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          )}
          {errors?.photo && (
            <p className="mt-1 text-sm text-error">{errors?.photo}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          fullWidth
          iconName="Send"
          iconPosition="right"
          className="mt-6"
        >
          {currentLanguage === 'es' ? 'Enviar Mensaje' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;