import { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MobileTimelineEvent = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-12 relative pl-12">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30"></div>
      <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg -translate-x-[18px]">
        <Icon name={event?.icon} size={20} color="white" />
      </div>
      <div className="bg-card rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-primary">{event?.date}</span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            aria-label={isExpanded ? 'Collapse event' : 'Expand event'}
          >
            <Icon 
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
              size={18} 
              color="var(--color-muted-foreground)" 
            />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-lg mb-3">
          <div className="aspect-[4/3] overflow-hidden">
            <Image 
              src={event?.image} 
              alt={event?.imageAlt}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {event?.location && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div className="flex items-center text-white text-xs">
                <Icon name="MapPin" size={14} className="mr-1" />
                <span>{event?.location}</span>
              </div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-headline font-bold text-foreground mb-2">{event?.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {isExpanded ? event?.fullDescription : event?.description}
        </p>
        
        {event?.quote && isExpanded && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs italic text-primary font-accent">"{event?.quote}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileTimelineEvent;