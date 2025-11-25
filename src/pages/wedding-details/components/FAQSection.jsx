import { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FAQSection = ({ language }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know",
      faqs: [
        {
          question: "What time should I arrive?",
          answer: "Please arrive at least 15 minutes before the ceremony begins at 3:00 PM. This allows time for parking, seating, and settling in before the ceremony starts."
        },
        {
          question: "Is there parking available?",
          answer: "Yes, complimentary parking is available at all venues. Valet service will be provided at the reception venue for your convenience."
        },
        {
          question: "Can I bring a plus-one?",
          answer: "Plus-ones are indicated on your invitation. If your invitation includes 'and guest,' you are welcome to bring someone. Please include their name when you RSVP."
        },
        {
          question: "Are children welcome?",
          answer: "While we love your little ones, we have decided to make our wedding an adults-only celebration. We hope this allows parents to relax and enjoy the evening."
        },
        {
          question: "What is the dress code?",
          answer: "We request formal attire. Think elegant evening wear - floor-length gowns or cocktail dresses for ladies, and suits or tuxedos for gentlemen. Please avoid white, ivory, or cream colors."
        },
        {
          question: "Will there be food and drinks?",
          answer: "Yes! A full dinner will be served during the reception, along with an open bar featuring wine, beer, and signature cocktails. Please let us know of any dietary restrictions when you RSVP."
        },
        {
          question: "Can I take photos during the ceremony?",
          answer: "We kindly request an unplugged ceremony. Our professional photographer will capture all the special moments. Please enjoy being present and save your photos for the reception!"
        },
        {
          question: "What if I have dietary restrictions?",
          answer: "Please indicate any dietary restrictions or allergies when you RSVP. We will work with our caterer to accommodate vegetarian, vegan, gluten-free, and other dietary needs."
        },
        {
          question: "Is the venue wheelchair accessible?",
          answer: "Yes, both the ceremony and reception venues are fully wheelchair accessible with ramps and accessible restrooms available."
        },
        {
          question: "What is your gift registry?",
          answer: "Your presence is the greatest gift! However, if you wish to honor us with a gift, we have registries at several retailers. Links can be found on our Registry page."
        }
      ]
    },
    es: {
      title: "Preguntas Frecuentes",
      subtitle: "Todo lo que necesitas saber",
      faqs: [
        {
          question: "¿A qué hora debo llegar?",
          answer: "Por favor llegue al menos 15 minutos antes de que comience la ceremonia a las 3:00 PM. Esto permite tiempo para estacionar, sentarse y acomodarse antes de que comience la ceremonia."
        },
        {
          question: "¿Hay estacionamiento disponible?",
          answer: "Sí, hay estacionamiento gratuito disponible en todos los lugares. Se proporcionará servicio de valet en el lugar de recepción para su comodidad."
        },
        {
          question: "¿Puedo traer un acompañante?",
          answer: "Los acompañantes están indicados en su invitación. Si su invitación incluye 'y acompañante', puede traer a alguien. Por favor incluya su nombre cuando confirme su asistencia."
        },
        {
          question: "¿Son bienvenidos los niños?",
          answer: "Si bien amamos a sus pequeños, hemos decidido hacer de nuestra boda una celebración solo para adultos. Esperamos que esto permita a los padres relajarse y disfrutar de la noche."
        },
        {
          question: "¿Cuál es el código de vestimenta?",
          answer: "Solicitamos vestimenta formal. Piense en ropa de noche elegante: vestidos largos o de cóctel para damas, y trajes o esmoquin para caballeros. Por favor evite colores blancos, marfil o crema."
        },
        {
          question: "¿Habrá comida y bebidas?",
          answer: "¡Sí! Se servirá una cena completa durante la recepción, junto con una barra libre con vino, cerveza y cócteles exclusivos. Por favor infórmenos de cualquier restricción dietética cuando confirme su asistencia."
        },
        {
          question: "¿Puedo tomar fotos durante la ceremonia?",
          answer: "Solicitamos amablemente una ceremonia sin dispositivos. Nuestro fotógrafo profesional capturará todos los momentos especiales. ¡Por favor disfrute estar presente y guarde sus fotos para la recepción!"
        },
        {
          question: "¿Qué pasa si tengo restricciones dietéticas?",
          answer: "Por favor indique cualquier restricción dietética o alergia cuando confirme su asistencia. Trabajaremos con nuestro servicio de catering para acomodar necesidades vegetarianas, veganas, sin gluten y otras necesidades dietéticas."
        },
        {
          question: "¿El lugar es accesible para sillas de ruedas?",
          answer: "Sí, tanto el lugar de la ceremonia como el de la recepción son completamente accesibles para sillas de ruedas con rampas y baños accesibles disponibles."
        },
        {
          question: "¿Cuál es su registro de regalos?",
          answer: "¡Su presencia es el mayor regalo! Sin embargo, si desea honrarnos con un regalo, tenemos registros en varios minoristas. Los enlaces se pueden encontrar en nuestra página de Registro."
        }
      ]
    }
  };

  const content = faqData?.[language];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-pink/10 rounded-full mb-4">
          <Icon name="HelpCircle" size={32} color="var(--color-brand-pink)" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-foreground mb-2">
          {content?.title}
        </h2>
        <p className="text-muted-foreground">
          {content?.subtitle}
        </p>
      </div>
      <div className="space-y-4 max-w-3xl mx-auto">
        {content?.faqs?.map((faq, index) => (
          <div
            key={index}
            className="bg-background rounded-xl overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-muted/50"
            >
              <span className="text-lg font-semibold text-foreground pr-4">
                {faq?.question}
              </span>
              <Icon
                name={openIndex === index ? "ChevronUp" : "ChevronDown"}
                size={24}
                className={`text-primary flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-6">
                <p className="text-muted-foreground leading-relaxed">
                  {faq?.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-6 py-4">
          <Icon name="MessageCircle" size={20} className="text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {language === 'en' ? 'Still have questions? ' : '¿Todavía tienes preguntas? '}
            </span>
            {language === 'en' ?'Feel free to contact us directly at contact@fabiyfeli.cl' :'No dude en contactarnos directamente en contact@fabiyfeli.cl'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;