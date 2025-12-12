import { useState, useEffect } from 'react';
import Icon from './AppIcon';

const GiftButton = ({ language = 'es' } = {}) => {
  const [showModal, setShowModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const giftInfo = language === 'es' 
    ? {
        title: "Regalos",
        subtitle: "¡Tu presencia es lo más importante!",
        mainText: "Tu presencia en nuestra boda es el mejor regalo que podríamos pedir. Sin embargo, si deseas honrarnos con un regalo, las contribuciones monetarias son bienvenidas y muy apreciadas.",
        options: [
          {
            title: "Mercado Pago (Chile)",
            link: "https://link.mercadopago.cl/matrifabifeli",
            icon: "💳"
          },
          {
            title: "Transferencia Bancaria Local",
            subtitle: "Banco/Cta por confirmar",
            link: null,
            icon: "🏦"
          },
          {
            title: "Transferencia Internacional (Wise)",
            link: "https://wise.com/pay/me/juana100",
            icon: "🌍"
          }
        ]
      }
    : {
        title: "Gifts",
        subtitle: "Your presence is the greatest gift!",
        mainText: "Your presence at our wedding is the greatest gift we could ask for! However, if you wish to honor us with a gift, monetary contributions are welcome and greatly appreciated.",
        options: [
          {
            title: "Mercado Pago (Chile)",
            link: "https://link.mercadopago.cl/matrifabifeli",
            icon: "💳"
          },
          {
            title: "Local Bank Transfer",
            subtitle: "Bank/Account TBA",
            link: null,
            icon: "🏦"
          },
          {
            title: "International Transfer (Wise)",
            link: "https://wise.com/pay/me/juana100",
            icon: "🌍"
          }
        ]
      };

  // Calculate position based on scroll - smooth floating effect
  const translateY = Math.min(scrollY * 0.3, window.innerHeight - 120);

  return (
    <>
      {/* Floating Gift Button - Fixed Position */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed top-1/2 right-4 md:right-6 z-40 bg-warning hover:bg-warning/90 text-warning-foreground rounded-full w-14 h-14 md:w-16 md:h-16 shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center text-2xl md:text-3xl"
        style={{
          transform: 'translateY(-50%)',
          animation: 'tilt 2s ease-in-out infinite'
        }}
        title={language === 'es' ? 'Regalos' : 'Gifts'}
      >
        <span>🎁</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-t-3xl md:rounded-2xl shadow-2xl max-w-md w-full md:max-h-[90vh] max-h-[85vh] overflow-y-auto border border-border p-6">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-6 mt-4 md:mt-0">
              <div className="text-5xl md:text-6xl mb-4">🎁</div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                {giftInfo.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {giftInfo.subtitle}
              </p>
            </div>

            {/* Main Text */}
            <p className="text-foreground text-center mb-6 leading-relaxed">
              {giftInfo.mainText}
            </p>

            {/* Gift Options */}
            <div className="space-y-3 mb-6">
              {giftInfo.options.map((option, index) => {
                const isClickable = option.link !== null;
                return isClickable ? (
                  <a
                    key={index}
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border border-border bg-background hover:bg-muted transition-colors active:scale-95 transform"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium text-foreground hover:text-primary text-sm md:text-base">
                        {option.title}
                      </span>
                    </div>
                  </a>
                ) : (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-muted/50 cursor-not-allowed opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div className="flex-1">
                        <span className="font-medium text-foreground text-sm md:text-base">
                          {option.title}
                        </span>
                        {option.subtitle && (
                          <p className="text-xs text-muted-foreground">
                            {option.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium active:scale-95"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tilt {
          0%, 100% {
            transform: translateY(-50%) rotate(0deg);
            animation-timing-function: ease-in;
          }
          25% {
            transform: translateY(-50%) rotate(-8deg);
            animation-timing-function: ease-in-out;
          }
          50% {
            transform: translateY(-50%) rotate(0deg);
            animation-timing-function: ease-in-out;
          }
          75% {
            transform: translateY(-50%) rotate(8deg);
            animation-timing-function: ease-in;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        [class*="backdrop-blur"] {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default GiftButton;
