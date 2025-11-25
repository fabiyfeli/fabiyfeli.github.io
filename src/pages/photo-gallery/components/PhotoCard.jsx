import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PhotoCard = ({ photo, onClick }) => {
  return (
    <div
      onClick={() => onClick(photo)}
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer elegant-hover"
    >
      <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden">
        <Image
          src={photo?.image}
          alt={photo?.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Icon name="ZoomIn" size={20} color="var(--color-primary)" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[var(--color-foreground)] text-sm line-clamp-1">
            {photo?.title}
          </h3>
          <div className="flex items-center gap-1 text-[var(--color-primary)] shrink-0">
            <Icon name="Heart" size={16} />
            <span className="text-xs font-medium">{photo?.likes}</span>
          </div>
        </div>
        
        <p className="text-xs text-[var(--color-muted-foreground)] mb-3 line-clamp-2">
          {photo?.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <Icon name="Calendar" size={14} />
            <span>{photo?.date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <Icon name="MapPin" size={14} />
            <span className="line-clamp-1">{photo?.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;