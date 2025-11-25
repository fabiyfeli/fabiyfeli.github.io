import Icon from '../../../components/AppIcon';

const StoryStats = ({ currentLanguage }) => {
  const content = {
    en: {
      stats: [
        { icon: 'Calendar', value: '4', label: 'Years Together' },
        { icon: 'MapPin', value: '+15', label: 'Cities Visited' },
        { icon: 'Heart', value: '∞', label: 'Memories Created' },
        { icon: 'Smile', value: '2', label: 'Souls United' }
      ]
    },
    es: {
      stats: [
        { icon: 'Calendar', value: '4', label: 'Años Juntos' },
        { icon: 'MapPin', value: '+15', label: 'Ciudades Visitadas' },
        { icon: 'Heart', value: '∞', label: 'Recuerdos Creados' },
        { icon: 'Smile', value: '2', label: 'Almas Unidas' }
      ]
    }
  };

  const stats = content?.[currentLanguage]?.stats;

  return (
    <div className="bg-gradient-to-r from-primary/5 via-secondary to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((stat, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 elegant-hover"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Icon name={stat?.icon} size={28} color="var(--color-primary)" />
              </div>
              <div className="text-3xl font-headline font-bold text-foreground mb-2">
                {stat?.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryStats;