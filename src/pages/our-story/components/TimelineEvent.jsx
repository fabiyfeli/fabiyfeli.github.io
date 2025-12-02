import { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TimelineEvent = ({ event, index, isLeft }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`flex items-center mb-16 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
        <div 
          className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer elegant-hover"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-primary">{event?.date}</span>
            <Icon 
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
              color="var(--color-muted-foreground)" 
            />
          </div>
          <h3 className="text-xl font-headline font-bold text-foreground mb-2">{event?.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isExpanded ? event?.fullDescription : event?.description}
          </p>
          {event?.quote && isExpanded && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm italic text-primary font-accent">"{event?.quote}"</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-2/12 flex justify-center relative">
        <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30"></div>
        <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg heartbeat">
          <Icon name={event?.icon} size={28} color="white" />
        </div>
      </div>
      <div className={`w-5/12 ${isLeft ? 'pl-8' : 'pr-8'}`}>
        <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 elegant-hover">
          <div className="aspect-[4/3] overflow-hidden">
            <Image 
              src={event?.image} 
              alt={event?.imageAlt}
              className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
            />
          </div>
          {event?.location && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center text-white text-sm">
                <Icon name="MapPin" size={16} className="mr-2" />
                <span>{event?.location}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEvent;