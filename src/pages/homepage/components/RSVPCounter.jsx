import { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { getRSVPStats } from '../../../utils/rsvpStorage';

const RSVPCounter = ({ language }) => {
  const [stats, setStats] = useState({
    confirmed: 0,
    pending: 0,
    total: 150 // Default total invited guests (can be updated manually)
  });

  useEffect(() => {
    // Load real RSVP stats
    const rsvpStats = getRSVPStats();
    const targetConfirmed = rsvpStats.totalGuests || 0; // Approved guests who will attend
    const targetPending = rsvpStats.pending || 0;

    const animateCounter = (target, key) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 30);
      return timer;
    };

    const timer1 = animateCounter(targetConfirmed, 'confirmed');
    const timer2 = animateCounter(targetPending, 'pending');

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, []);

  const content = {
    en: {
      title: "Guest Excitement",
      confirmed: "Confirmed",
      pending: "Pending",
      total: "Total Invited",
      message: "Join the celebration! Your presence would mean the world to us."
    },
    es: {
      title: "Entusiasmo de los Invitados",
      confirmed: "Confirmados",
      pending: "Pendientes",
      total: "Total Invitados",
      message: "¡Únete a la celebración! Tu presencia significaría el mundo para nosotros."
    }
  };

  const text = content?.[language];

  const percentage = Math.round((stats?.confirmed / stats?.total) * 100);

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl text-foreground mb-4">
            {text?.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {text?.message}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-background rounded-xl p-6 border border-border text-center hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-4 mx-auto">
              <Icon name="CheckCircle" size={24} color="var(--color-success)" />
            </div>
            <div className="text-4xl font-bold text-success mb-2 font-headline">
              {stats?.confirmed}
            </div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider">
              {text?.confirmed}
            </div>
          </div>

          <div className="bg-background rounded-xl p-6 border border-border text-center hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 mb-4 mx-auto">
              <Icon name="Clock" size={24} color="var(--color-warning)" />
            </div>
            <div className="text-4xl font-bold text-warning mb-2 font-headline">
              {stats?.pending}
            </div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider">
              {text?.pending}
            </div>
          </div>

          <div className="bg-background rounded-xl p-6 border border-border text-center hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
              <Icon name="Users" size={24} color="var(--color-primary)" />
            </div>
            <div className="text-4xl font-bold text-primary mb-2 font-headline">
              {stats?.total}
            </div>
            <div className="text-muted-foreground text-sm uppercase tracking-wider">
              {text?.total}
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-background rounded-full h-4 overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-success to-primary transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-center text-muted-foreground text-sm mt-3">
            {percentage}% of guests have confirmed their attendance
          </p>
        </div>
      </div>
    </section>
  );
};

export default RSVPCounter;