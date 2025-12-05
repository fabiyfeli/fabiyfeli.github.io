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
    try {
      if (document.body) {
        document.body.style.overflow = 'hidden';
      }
    } catch (e) {
      console.error('Error setting body overflow:', e);
    }
    
    return () => {
      try {
        if (document.body) {
          document.body.style.overflow = 'unset';
        }
      } catch (e) {
        console.error('Error unsetting body overflow:', e);
      }
    };
  }, []);

  // Safety check
  if (!formData) {
    return null;
  }

  // Generate and download calendar event (.ics file)
  const downloadCalendarEvent = () => {
    const eventDate = new Date('2026-01-31T18:00:00');
    const endDate = new Date('2026-02-01T02:00:00');
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Fabi & Feli Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(eventDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `DTSTAMP:${formatDate(new Date())}`,
      'SUMMARY:Boda de Fabi & Feli',
      'DESCRIPTION:Celebración de la boda de Fabi & Feli',
      'LOCATION:Santiago, Chile',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Recordatorio: Boda de Fabi & Feli mañana',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fabi-feli-wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate and download confirmation as text/HTML file
  const downloadConfirmationPDF = () => {
    const confirmationText = `
CONFIRMACIÓN DE ASISTENCIA
Boda de Fabi & Feli

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INFORMACIÓN DEL INVITADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
${formData.phone ? `Teléfono: ${formData.phone}` : ''}
Asistencia: ${formData.attendance === 'yes' ? 'SÍ ASISTIRÉ ✓' : 'NO PODRÉ ASISTIR'}

${formData.hasPlusOne ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACOMPAÑANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${formData.plusOneFirstName} ${formData.plusOneLastName}
` : ''}

${formData.attendance === 'yes' ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALLES DEL EVENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fecha: 31 de Enero, 2026
Hora: 18:00 hrs
Lugar: Santiago, Chile

${formData.dietaryRestrictions ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESTRICCIONES ALIMENTARIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formData.dietaryRestrictions}
` : ''}

${formData.specialNotes ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTAS ESPECIALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formData.specialNotes}
` : ''}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gracias por confirmar tu asistencia.
¡No podemos esperar a celebrar contigo!

Fabi & Feli
www.fabiyfeli.cl
    `.trim();

    const blob = new Blob([confirmationText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `confirmacion-${formData.firstName}-${formData.lastName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20">
            <Icon name="CheckCircle2" size={32} color="#22c55e" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-headline text-center text-foreground mb-2">
            {t?.title || 'Confirmed'}
          </h2>

          <p className="text-center text-muted-foreground mb-6">
            {formData?.attendance === 'yes'
              ? t?.messageAttending(formData?.firstName || 'Guest')
              : t?.messageNotAttending(formData?.firstName || 'Guest')}
          </p>

          {formData?.attendance === 'yes' && (
            <div className="space-y-3 mb-6">
              <button
                onClick={() => downloadCalendarEvent()}
                className="w-full flex items-center justify-between gap-3 bg-background hover:bg-muted border border-border rounded-lg p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Calendar" size={20} color="var(--color-primary)" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      {language === 'es' ? 'Agregar al Calendario' : 'Add to Calendar'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Descarga el evento .ics' : 'Download .ics event'}
                    </p>
                  </div>
                </div>
                <Icon name="Download" size={20} color="var(--color-muted-foreground)" />
              </button>

              <button
                onClick={() => downloadConfirmationPDF()}
                className="w-full flex items-center justify-between gap-3 bg-background hover:bg-muted border border-border rounded-lg p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="FileText" size={20} color="var(--color-primary)" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      {language === 'es' ? 'Detalles de Confirmación' : 'Confirmation Details'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Descarga tu confirmación' : 'Download your confirmation'}
                    </p>
                  </div>
                </div>
                <Icon name="Download" size={20} color="var(--color-muted-foreground)" />
              </button>
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