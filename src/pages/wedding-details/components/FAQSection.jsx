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
          answer: "Please arrive at least 30 minutes before the ceremony begins at 7:00 PM. This allows time for parking, seating, and settling in before the ceremony starts. The venue is Casona San Ignacio in Quilicura, Santiago, Chile."
        },
        {
          question: "When and where is the wedding?",
          answer: "The wedding will take place on Saturday, January 31, 2026 at 7:00 PM at Casona San Ignacio, located at Caupolicán 8611, Quilicura, Región Metropolitana, Chile."
        },
        {
          question: "Is there parking available?",
          answer: "Yes, complimentary parking is available at the venue. The venue is easily accessible via Route 5 North."
        },
        {
          question: "What is the dress code?",
          answer: "Casual or semi-casual attire. Since our celebration will be during summer (January in Chile), please choose comfortable clothing with light, breathable fabrics. Ladies can wear sundresses or casual elegant dresses, gentlemen can wear light pants with dress shirts. Please avoid white, ivory, or cream colors."
        },
        {
          question: "What will the weather be like?",
          answer: "January is summer in Chile with temperatures around 30°C (86°F) during the day. Light, breathable fabrics are highly recommended. The evening may cool down slightly."
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
          question: "Will there be food and drinks?",
          answer: "Yes! A full dinner will be served during the reception, along with drinks. Please let us know of any dietary restrictions when you RSVP."
        },
        {
          question: "What if I have dietary restrictions?",
          answer: "Please indicate any dietary restrictions or allergies when you RSVP. We will work with our caterer to accommodate vegetarian, vegan, gluten-free, and other dietary needs."
        },
        {
          question: "How do I get to the venue?",
          answer: "The venue is accessible by car via Route 5 North. From Santiago airport (SCL), it's approximately 30 km. Uber, Cabify, and DiDi are readily available. Estimated cost from the airport: $25,000-35,000 CLP."
        },
        {
          question: "Is the venue wheelchair accessible?",
          answer: "Yes, the venue is fully wheelchair accessible with ramps and accessible restrooms available."
        },
        {
          question: "Where can I stay?",
          answer: "We recommend hotels like The Singular Santiago, W Santiago, or Holiday Inn Express Santiago. Check our Accommodations section for more details and group codes."
        },
        {
          question: "What about gifts?",
          answer: "Your presence at our wedding is the greatest gift we could ask for! However, if you wish to honor us with a gift, monetary contributions are welcome and greatly appreciated."
        }
      ]
    },
    es: {
      title: "Preguntas Frecuentes",
      subtitle: "Todo lo que necesitas saber",
      faqs: [
        {
          question: "¿A qué hora debo llegar?",
          answer: "Por favor llegue al menos 30 minutos antes de que comience la ceremonia a las 7:00 PM. Esto permite tiempo para estacionar, sentarse y acomodarse antes de que comience la ceremonia. El lugar es Casona San Ignacio en Quilicura, Santiago, Chile."
        },
        {
          question: "¿Cuándo y dónde es la boda?",
          answer: "La boda se llevará a cabo el sábado 31 de enero de 2026 a las 7:00 PM en Casona San Ignacio, ubicada en Caupolicán 8611, Quilicura, Región Metropolitana, Chile."
        },
        {
          question: "¿Hay estacionamiento disponible?",
          answer: "Sí, hay estacionamiento gratuito disponible en el lugar. El lugar es de fácil acceso por la Ruta 5 Norte."
        },
        {
          question: "¿Cuál es el código de vestimenta?",
          answer: "Vestimenta casual o semi-casual. Como nuestra celebración será en verano (enero en Chile), elige ropa cómoda con telas ligeras y transpirables. Las damas pueden usar vestidos de verano o vestidos elegantes casuales, los caballeros pueden usar pantalones claros con camisas de vestir. Por favor evite colores blancos, marfil o crema."
        },
        {
          question: "¿Cómo estará el clima?",
          answer: "Enero es verano en Chile con temperaturas alrededor de 30°C (86°F) durante el día. Se recomiendan altamente telas ligeras y transpirables. La noche puede refrescar un poco."
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
          question: "¿Habrá comida y bebidas?",
          answer: "¡Sí! Se servirá una cena completa durante la recepción, junto con bebidas. Por favor infórmenos de cualquier restricción dietética cuando confirme su asistencia."
        },
        {
          question: "¿Qué pasa si tengo restricciones dietéticas?",
          answer: "Por favor indique cualquier restricción dietética o alergia cuando confirme su asistencia. Trabajaremos con nuestro servicio de catering para acomodar necesidades vegetarianas, veganas, sin gluten y otras necesidades dietéticas."
        },
        {
          question: "¿Cómo llego al lugar?",
          answer: "El lugar es accesible en auto por la Ruta 5 Norte. Desde el aeropuerto de Santiago (SCL), son aproximadamente 30 km. Uber, Cabify y DiDi están fácilmente disponibles. Costo estimado desde el aeropuerto: $25.000-35.000 CLP."
        },
        {
          question: "¿El lugar es accesible para sillas de ruedas?",
          answer: "Sí, el lugar es completamente accesible para sillas de ruedas con rampas y baños accesibles disponibles."
        },
        {
          question: "¿Dónde puedo alojarme?",
          answer: "Recomendamos hoteles como The Singular Santiago, W Santiago o Holiday Inn Express Santiago. Consulta nuestra sección de Alojamiento para más detalles y códigos de grupo."
        },
        {
          question: "¿Qué pasa con los regalos?",
          answer: "¡Tu presencia en nuestra boda es el mejor regalo que podríamos pedir! Sin embargo, si deseas honrarnos con un regalo, las contribuciones monetarias son bienvenidas y muy apreciadas."
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