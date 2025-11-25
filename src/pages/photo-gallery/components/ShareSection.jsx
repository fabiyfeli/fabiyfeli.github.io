import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShareSection = ({ currentLanguage }) => {
  const [copied, setCopied] = useState(false);

  const content = {
    en: {
      title: "Share Our Joy",
      subtitle: "Help us spread the love by sharing our gallery",
      copyLink: "Copy Link",
      linkCopied: "Link Copied!",
      shareOn: "Share on"
    },
    es: {
      title: "Comparte Nuestra Alegría",
      subtitle: "Ayúdanos a difundir el amor compartiendo nuestra galería",
      copyLink: "Copiar Enlace",
      linkCopied: "¡Enlace Copiado!",
      shareOn: "Compartir en"
    }
  };

  const text = content?.[currentLanguage];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location?.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialPlatforms = [
    { name: 'Facebook', icon: 'Facebook', color: '#1877F2' },
    { name: 'Twitter', icon: 'Twitter', color: '#1DA1F2' },
    { name: 'Instagram', icon: 'Instagram', color: '#E4405F' },
    { name: 'WhatsApp', icon: 'MessageCircle', color: '#25D366' }
  ];

  return (
    <div className="bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[var(--color-primary)]/20 rounded-full">
          <Icon name="Share2" size={32} color="var(--color-primary)" />
        </div>

        <h2 className="font-headline text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-3">
          {text?.title}
        </h2>
        
        <p className="text-lg text-[var(--color-muted-foreground)] mb-8">
          {text?.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            variant="outline"
            size="lg"
            iconName={copied ? "Check" : "Copy"}
            iconPosition="left"
            onClick={handleCopyLink}
            className="w-full sm:w-auto"
          >
            {copied ? text?.linkCopied : text?.copyLink}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
            {text?.shareOn}:
          </span>
          {socialPlatforms?.map((platform) => (
            <button
              key={platform?.name}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--color-border)]"
              aria-label={`${text?.shareOn} ${platform?.name}`}
            >
              <Icon name={platform?.icon} size={20} color={platform?.color} />
              <span className="text-sm font-medium text-[var(--color-foreground)]">
                {platform?.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareSection;