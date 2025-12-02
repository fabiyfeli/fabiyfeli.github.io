import { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MessageCard = ({ message, onReply, onLike, currentLanguage }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [authStep, setAuthStep] = useState('password'); // 'password' or 'authenticated'
  const [password, setPassword] = useState('');
  const [replierName, setReplierName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticatedAsCouple, setIsAuthenticatedAsCouple] = useState(false);

  // Palabra clave para desbloquear respuestas de los novios
  const COUPLE_PASSWORD = 'FabiYFeli2026';

  const handlePasswordSubmit = (e) => {
    e?.preventDefault();
    if (password === COUPLE_PASSWORD) {
      setAuthStep('authenticated');
      setAuthError('');
      setIsAuthenticatedAsCouple(true);
      setPassword('');
    } else {
      setAuthError(currentLanguage === 'es' ? 
        'Contraseña incorrecta. Ingresa tu nombre si deseas responder como invitado.' : 
        'Incorrect password. Enter your name if you want to reply as a guest.');
    }
  };

  const handleNameSubmit = (e) => {
    e?.preventDefault();
    if (replierName?.trim()) {
      setAuthStep('authenticated');
      setAuthError('');
      setIsAuthenticatedAsCouple(false);
    } else {
      setAuthError(currentLanguage === 'es' ? 
        'Por favor ingresa tu nombre' : 
        'Please enter your name');
    }
  };

  const handleSubmitReply = (e) => {
    e?.preventDefault();
    if (replyText?.trim()) {
      const replyData = {
        text: replyText,
        isCouple: isAuthenticatedAsCouple,
        replierName: isAuthenticatedAsCouple ? null : replierName
      };
      onReply(message?.id, replyData);
      setReplyText('');
      setShowReplyForm(false);
      setAuthStep('password');
      setPassword('');
      setReplierName('');
      setAuthError('');
      setIsAuthenticatedAsCouple(false);
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
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon
              name="User"
              size={24}
              color="var(--color-primary)"
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

          {(message?.coupleReply || message?.replies) && (
            <div className="mt-4 space-y-3">
              {/* Legacy coupleReply support */}
              {message?.coupleReply && typeof message.coupleReply === 'string' && (
                <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Heart" size={16} color="var(--color-primary)" />
                    <span className="text-sm font-semibold text-primary">
                      {currentLanguage === 'es' ? 'Respuesta de los novios' : 'Couple\'s Reply'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{message?.coupleReply}</p>
                </div>
              )}
              
              {/* New replies array support */}
              {message?.replies && message.replies.length > 0 && message.replies.map((reply, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    reply?.isCouple 
                      ? 'bg-primary/5 border-primary' 
                      : 'bg-muted/30 border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon 
                      name={reply?.isCouple ? "Heart" : "User"} 
                      size={16} 
                      color={reply?.isCouple ? "var(--color-primary)" : "var(--color-muted-foreground)"} 
                    />
                    <span className={`text-sm font-semibold ${
                      reply?.isCouple ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {reply?.isCouple 
                        ? (currentLanguage === 'es' ? 'Respuesta de los novios' : 'Couple\'s Reply')
                        : reply?.replierName || (currentLanguage === 'es' ? 'Invitado' : 'Guest')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{reply?.text}</p>
                </div>
              ))}
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
            <button 
              onClick={() => onLike && onLike(message?.id)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Icon name="Heart" size={16} />
              <span>{message?.likes || 0}</span>
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-4 space-y-3">
              {authStep === 'password' ? (
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Icon name="Lock" size={16} color="var(--color-primary)" className="mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">
                        {currentLanguage === 'es' ? 
                          '¿Eres Fabi o Feli?' : 
                          'Are you Fabi or Feli?'}
                      </p>
                      <form onSubmit={handlePasswordSubmit} className="space-y-2">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e?.target?.value)}
                          placeholder={currentLanguage === 'es' ? 'Palabra clave' : 'Password'}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                        <button
                          type="submit"
                          className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-200"
                        >
                          {currentLanguage === 'es' ? 'Verificar' : 'Verify'}
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-3">
                    <p className="text-sm font-medium text-foreground mb-2">
                      {currentLanguage === 'es' ? 
                        'O responde como invitado:' : 
                        'Or reply as a guest:'}
                    </p>
                    <form onSubmit={handleNameSubmit} className="space-y-2">
                      <input
                        type="text"
                        value={replierName}
                        onChange={(e) => setReplierName(e?.target?.value)}
                        placeholder={currentLanguage === 'es' ? 'Tu nombre' : 'Your name'}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      />
                      <button
                        type="submit"
                        className="w-full px-3 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors duration-200"
                      >
                        {currentLanguage === 'es' ? 'Continuar' : 'Continue'}
                      </button>
                    </form>
                  </div>

                  {authError && (
                    <div className="flex items-start gap-2 text-sm text-destructive">
                      <Icon name="AlertCircle" size={16} className="mt-0.5" />
                      <p>{authError}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false);
                      setPassword('');
                      setReplierName('');
                      setAuthError('');
                      setAuthStep('password');
                      setIsAuthenticatedAsCouple(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {currentLanguage === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReply} className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name={isAuthenticatedAsCouple ? "Heart" : "User"} size={16} color="var(--color-primary)" />
                    <span className="text-primary font-medium">
                      {isAuthenticatedAsCouple ? 
                        (currentLanguage === 'es' ? 'Respondiendo como: Los Novios' : 'Replying as: The Couple') :
                        (currentLanguage === 'es' ? `Respondiendo como: ${replierName}` : `Replying as: ${replierName}`)}
                    </span>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e?.target?.value)}
                    placeholder={currentLanguage === 'es' ? 'Escribe tu respuesta...' : 'Write your reply...'}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows="3"
                    autoFocus
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
                        setAuthStep('password');
                        setPassword('');
                        setReplierName('');
                        setAuthError('');
                        setIsAuthenticatedAsCouple(false);
                      }}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors duration-200"
                    >
                      {currentLanguage === 'es' ? 'Cancelar' : 'Cancel'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;