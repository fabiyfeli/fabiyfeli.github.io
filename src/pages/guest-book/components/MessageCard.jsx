import { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MessageCard = ({ message, onReply, currentLanguage }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = (e) => {
    e?.preventDefault();
    if (replyText?.trim()) {
      onReply(message?.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date)?.toLocaleDateString(currentLanguage === 'es' ? 'es-ES' : 'en-US', options);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border transition-all duration-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10">
            <Image
              src={message?.avatar}
              alt={message?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-foreground text-lg">{message?.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{message?.relationship}</span>
                <span>•</span>
                <span>{formatDate(message?.date)}</span>
              </div>
            </div>
            {message?.category && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap">
                {message?.category}
              </span>
            )}
          </div>

          <p className="text-foreground leading-relaxed mb-4 whitespace-pre-line">
            {message?.message}
          </p>

          {message?.photo && (
            <div className="mb-4 rounded-lg overflow-hidden max-w-md">
              <Image
                src={message?.photo}
                alt={message?.photoAlt}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {message?.coupleReply && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Heart" size={16} color="var(--color-primary)" />
                <span className="text-sm font-semibold text-primary">
                  {currentLanguage === 'es' ? 'Respuesta de los novios' : 'Couple\'s Reply'}
                </span>
              </div>
              <p className="text-sm text-foreground">{message?.coupleReply}</p>
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Icon name="MessageCircle" size={16} />
              <span>{currentLanguage === 'es' ? 'Responder' : 'Reply'}</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              <Icon name="Heart" size={16} />
              <span>{message?.likes || 0}</span>
            </button>
          </div>

          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="mt-4 space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e?.target?.value)}
                placeholder={currentLanguage === 'es' ? 'Escribe tu respuesta...' : 'Write your reply...'}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-200"
                >
                  {currentLanguage === 'es' ? 'Enviar' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                  }}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors duration-200"
                >
                  {currentLanguage === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;