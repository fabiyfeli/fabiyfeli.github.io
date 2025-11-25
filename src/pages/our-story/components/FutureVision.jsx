import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FutureVision = ({ currentLanguage }) => {
  const content = {
    en: {
      title: "Our Future Together",
      subtitle: "The Best is Yet to Come",
      description: "As we stand on the threshold of forever, we look forward to building a life filled with love, laughter, and endless adventures. Our journey together is just beginning, and we can't wait to share it with all of you.",
      dreams: [
      { icon: 'Home', text: 'Building our dream home' },
      { icon: 'Plane', text: 'Traveling the world together' },
      { icon: 'Users', text: 'Growing our family' },
      { icon: 'Heart', text: 'Growing old together' }],

      image: "https://images.unsplash.com/photo-1570135497084-0debfc780ed8",
      imageAlt: "Romantic couple walking hand in hand on beach at sunset with golden light reflecting on water and gentle waves in background"
    },
    es: {
      title: "Nuestro Futuro Juntos",
      subtitle: "Lo Mejor Está Por Venir",
      description: "Mientras nos encontramos en el umbral de la eternidad, esperamos construir una vida llena de amor, risas y aventuras sin fin. Nuestro viaje juntos apenas comienza, y no podemos esperar para compartirlo con todos ustedes.",
      dreams: [
      { icon: 'Home', text: 'Construir nuestro hogar soñado' },
      { icon: 'Plane', text: 'Viajar por el mundo juntos' },
      { icon: 'Users', text: 'Hacer crecer nuestra familia' },
      { icon: 'Heart', text: 'Envejecer juntos' }],

      image: "https://images.unsplash.com/photo-1570135497084-0debfc780ed8",
      imageAlt: "Pareja romántica caminando de la mano en la playa al atardecer con luz dorada reflejándose en el agua y olas suaves en el fondo"
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="bg-gradient-to-br from-secondary via-background to-primary/5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Icon name="Sparkles" size={32} color="var(--color-primary)" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-3">
            {text?.title}
          </h2>
          <p className="text-xl font-accent text-primary">
            {text?.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={text?.image}
                alt={text?.imageAlt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />

            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {text?.description}
            </p>

            <div className="space-y-4">
              {text?.dreams?.map((dream, index) =>
              <div
                key={index}
                className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">

                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={dream?.icon} size={24} color="var(--color-primary)" />
                  </div>
                  <span className="text-foreground font-medium">{dream?.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default FutureVision;