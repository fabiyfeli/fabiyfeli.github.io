import { useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfirmationModal = ({ formData, onClose, language = 'es' }) => {
  const isUpdate = formData?.isUpdate;
  
  const content = {
    es: {
      title: isUpdate ? '¡Confirmación Actualizada!' : '¡Confirmación Recibida!',
      messageAttending: (name) => isUpdate 
        ? `¡Gracias por actualizar tu confirmación, ${name}! Hemos guardado todos los cambios.`
        : `¡Gracias por confirmar tu asistencia, ${name}! No podemos esperar a celebrar contigo.`,
      messageNotAttending: (name) => isUpdate
        ? `Gracias por actualizar tu información, ${name}.`
        : `Gracias por hacernos saber, ${name}. Te extrañaremos en nuestro día especial.`,
      emailSentTitle: isUpdate ? 'Actualización Guardada' : 'Correo de Confirmación Enviado',
      emailSentDesc: (email) => isUpdate
        ? `Tu confirmación ha sido actualizada. Los cambios serán revisados por los organizadores.`
        : `Hemos enviado una confirmación a ${email} con todos los detalles.`,
      calendarTitle: 'Marca tu Calendario',
      calendarDesc: 'Te enviaremos un recordatorio cerca de la fecha junto con los detalles del lugar e indicaciones.',
      updateNote: 'Puedes volver a enviar el formulario con el mismo email si necesitas hacer cambios.',
      close: 'Cerrar'
    },
    en: {
      title: isUpdate ? 'RSVP Updated!' : 'RSVP Confirmed!',
      messageAttending: (name) => isUpdate
        ? `Thank you for updating your RSVP, ${name}! We've saved all your changes.`
        : `Thank you for confirming your attendance, ${name}! We can't wait to celebrate with you.`,
      messageNotAttending: (name) => isUpdate
        ? `Thank you for updating your information, ${name}.`
        : `Thank you for letting us know, ${name}. You'll be missed on our special day.`,
      emailSentTitle: isUpdate ? 'Update Saved' : 'Confirmation Email Sent',
      emailSentDesc: (email) => isUpdate
        ? `Your RSVP has been updated. Changes will be reviewed by the organizers.`
        : `We've sent a confirmation to ${email} with all the details.`,
      calendarTitle: 'Mark Your Calendar',
      calendarDesc: 'We\'ll send you a reminder closer to the date along with venue details and directions.',
      updateNote: 'You can resubmit the form with the same email if you need to make changes.',
      close: 'Close'
    }
  };

  const t = content[language];

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
            {t.title}
          </h2>

          <p className="text-center text-muted-foreground mb-6">
            {formData?.attendance === 'yes'
              ? t.messageAttending(formData?.firstName)
              : t.messageNotAttending(formData?.firstName)}
          </p>

          <div className="bg-background rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="Mail" size={20} color="var(--color-primary)" className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {t.emailSentTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.emailSentDesc(formData?.email)}
                </p>
              </div>
            </div>
          </div>

          {formData?.attendance === 'yes' && !isUpdate && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="Calendar" size={20} color="var(--color-primary)" className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {t.calendarTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.calendarDesc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isUpdate && (
            <div className="bg-muted/50 border border-border rounded-lg p-3 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} color="var(--color-muted-foreground)" className="mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {t.updateNote}
                </p>
              </div>
            </div>
          )}

          <Button
            variant="default"
            size="lg"
            onClick={onClose}
            className="w-full"
          >
            {t.close}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;