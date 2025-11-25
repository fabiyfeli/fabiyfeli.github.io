import React, { useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PhotoModal = ({ photo, onClose, onNext, onPrevious, currentLanguage }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.key === 'Escape') onClose();
      if (e?.key === 'ArrowRight') onNext();
      if (e?.key === 'ArrowLeft') onPrevious();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrevious]);

  const content = {
    en: {
      close: "Close",
      previous: "Previous",
      next: "Next",
      share: "Share",
      download: "Download"
    },
    es: {
      close: "Cerrar",
      previous: "Anterior",
      next: "Siguiente",
      share: "Compartir",
      download: "Descargar"
    }
  };

  const text = content?.[currentLanguage];

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
        aria-label={text?.close}
      >
        <Icon name="X" size={24} color="white" />
      </button>
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
        aria-label={text?.previous}
      >
        <Icon name="ChevronLeft" size={28} color="white" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
        aria-label={text?.next}
      >
        <Icon name="ChevronRight" size={28} color="white" />
      </button>
      <div className="max-w-6xl max-h-[90vh] w-full mx-4 flex flex-col">
        <div className="relative flex-1 flex items-center justify-center mb-4">
          <Image
            src={photo?.image}
            alt={photo?.imageAlt}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-headline font-bold text-white mb-2">
                {photo?.title}
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                {photo?.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-white shrink-0">
              <Icon name="Heart" size={20} color="var(--color-primary)" />
              <span className="text-lg font-semibold">{photo?.likes}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              <span>{photo?.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={16} />
              <span>{photo?.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Tag" size={16} />
              <span>{photo?.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 text-white text-sm font-medium">
              <Icon name="Share2" size={16} />
              {text?.share}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 text-white text-sm font-medium">
              <Icon name="Download" size={16} />
              {text?.download}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;