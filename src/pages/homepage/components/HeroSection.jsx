import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = ({ language }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const weddingDate = new Date('2026-01-31T19:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(difference / (1000 * 60 * 60) % 24),
          minutes: Math.floor(difference / 1000 / 60 % 60),
          seconds: Math.floor(difference / 1000 % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const content = {
    en: {
      greeting: "Together Forever",
      names: "Fabiana & Felipe",
      date: "January 31, 2026 at 7:00 PM",
      venue: "Casona San Ignacio, Santiago, Chile",
      countdown: "Counting Down to Our Special Day",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      story: "Two hearts, one journey. Join us as we celebrate the beginning of our forever together, surrounded by the love of family and friends who have supported us every step of the way.",
      rsvpButton: "RSVP Now",
      ourStoryButton: "Our Love Story"
    },
    es: {
      greeting: "Juntos Para Siempre",
      names: "Fabiana & Felipe",
      date: "31 de Enero, 2026 a las 7:00 PM",
      venue: "Casona San Ignacio, Santiago, Chile",
      countdown: "Contando los Días Hasta Nuestro Día Especial",
      days: "Días",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
      story: "Dos corazones, un camino. Únete a nosotros mientras celebramos el comienzo de nuestro para siempre juntos, rodeados del amor de familiares y amigos que nos han apoyado en cada paso del camino.",
      rsvpButton: "Confirmar Asistencia",
      ourStoryButton: "Nuestra Historia de Amor"
    }
  };

  const text = content?.[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/hero-wedding.png"
          alt="Romantic outdoor wedding ceremony setup with white chairs arranged in rows facing elegant floral arch decorated with roses and greenery under golden sunset sky"
          className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-8 animate-fade-in">
          <p className="text-white/90 text-lg sm:text-xl font-accent mb-4">{text?.greeting}</p>
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight">
            {text?.names}
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/90 text-lg sm:text-xl mb-2">
            <Icon name="Calendar" size={24} color="var(--color-brand-gold)" />
            <span>{text?.date}</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-white/90 text-base sm:text-lg mb-8">
            <Icon name="MapPin" size={20} color="var(--color-brand-gold)" />
            <span>{text?.venue}</span>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-white text-xl sm:text-2xl font-headline mb-4">{text?.countdown}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto">
            {[
            { value: timeLeft?.days, label: text?.days },
            { value: timeLeft?.hours, label: text?.hours },
            { value: timeLeft?.minutes, label: text?.minutes },
            { value: timeLeft?.seconds, label: text?.seconds }]?.
            map((item, index) =>
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300">

                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 font-headline">
                  {String(item?.value)?.padStart(2, '0')}
                </div>
                <div className="text-white/80 text-xs sm:text-sm uppercase tracking-wider">
                  {item?.label}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-white/95 text-lg sm:text-xl leading-relaxed font-body px-4">
            {text?.story}
          </p>
        </div>


        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/rsvp">
            <Button
              variant="default"
              size="lg"
              iconName="Calendar"
              iconPosition="left"
              className="bg-cta hover:bg-cta/90 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">

              {text?.rsvpButton}
            </Button>
          </Link>
          <Link to="/our-story">
            <Button
              variant="outline"
              size="lg"
              iconName="Heart"
              iconPosition="left"
              className="border-2 border-white text-white hover:bg-white hover:text-foreground px-8 py-6 text-lg font-semibold transition-all duration-300">

              {text?.ourStoryButton}
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <Icon name="ChevronDown" size={32} color="white" className="opacity-70" />
      </div>
    </section>);

};

export default HeroSection;