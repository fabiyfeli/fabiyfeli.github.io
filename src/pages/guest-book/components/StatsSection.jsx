import Icon from '../../../components/AppIcon';

const StatsSection = ({ stats, currentLanguage }) => {
  const statItems = [
    {
      icon: 'MessageSquare',
      value: stats?.totalMessages,
      label: currentLanguage === 'es' ? 'Mensajes Totales' : 'Total Messages',
      color: 'var(--color-primary)'
    },
    {
      icon: 'Users',
      value: stats?.uniqueGuests,
      label: currentLanguage === 'es' ? 'Invitados Únicos' : 'Unique Guests',
      color: 'var(--color-accent)'
    },
    {
      icon: 'Image',
      value: stats?.photosShared,
      label: currentLanguage === 'es' ? 'Fotos Compartidas' : 'Photos Shared',
      color: 'var(--color-success)'
    },
    {
      icon: 'Heart',
      value: stats?.totalLikes,
      label: currentLanguage === 'es' ? 'Me Gusta Totales' : 'Total Likes',
      color: 'var(--color-cta)'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems?.map((item, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-6 shadow-sm border border-border text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${item?.color}15` }}>
            <Icon name={item?.icon} size={24} color={item?.color} />
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{item?.value}</div>
          <div className="text-sm text-muted-foreground">{item?.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;