import { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import Icon from '../../components/AppIcon';
import {
  loadMessages,
  deleteMessage,
  exportMessagesToCSV,
  importMessagesFromCSV,
  clearAllMessages,
  getGuestBookStats,
  syncWithGitHub,
  loadMessagesFromGitHub
} from '../../utils/guestBookStorage';
import { checkAuth, setAuthSession, isAuthenticated } from '../../utils/rsvpStorage';

const GuestBookAdmin = () => {
  const fileInputRef = useRef(null);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      setIsAuth(true);
      loadData();
    }
    // Load GitHub token from localStorage
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setGithubToken(savedToken);
    }
  }, []);

  const loadData = () => {
    const loadedMessages = loadMessages();
    setMessages(loadedMessages);
    setStats(getGuestBookStats());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (checkAuth(password)) {
      setAuthSession();
      setIsAuth(true);
      loadData();
      setPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleExport = () => {
    exportMessagesToCSV();
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Por favor selecciona un archivo CSV válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result;
        const result = importMessagesFromCSV(csvContent);

        if (result.success) {
          alert(`✓ Importación exitosa: ${result.count} mensajes importados`);
          loadData();
        } else {
          alert(`✗ Error al importar: ${result.error}`);
        }
      } catch (error) {
        console.error('Error in handleFileChange:', error);
        alert(`✗ Error al procesar el archivo: ${error.message}`);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      alert('Error al leer el archivo');
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los mensajes? Esta acción no se puede deshacer.')) {
      clearAllMessages();
      loadData();
    }
  };

  const handleDelete = async (messageId, guestName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el mensaje de ${guestName}?`)) {
      await deleteMessage(messageId);
      loadData();
    }
  };

  const handleSaveToken = () => {
    if (!githubToken.trim()) {
      alert('Por favor ingresa un token válido');
      return;
    }
    localStorage.setItem('github_token', githubToken);
    setShowTokenModal(false);
    alert('Token guardado exitosamente');
  };

  const handleSyncToGitHub = async () => {
    if (!githubToken) {
      setShowTokenModal(true);
      return;
    }

    try {
      // Use the new sync function that merges local and GitHub messages
      const result = await syncWithGitHub(githubToken);
      
      if (result.success) {
        alert(`✓ Sincronización exitosa!\n\nTotal: ${result.total} mensajes\nDesde GitHub: ${result.fromGitHub}\nSolo locales: ${result.localOnly}`);
        loadData(); // Reload to show merged data
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error syncing to GitHub:', error);
      alert(`✗ Error al sincronizar con GitHub: ${error.message}`);
    }
  };

  const handleLoadFromGitHub = async () => {
    try {
      const githubMessages = await loadMessagesFromGitHub();
      
      if (githubMessages.length > 0) {
        alert(`✓ Cargados ${githubMessages.length} mensajes desde GitHub Issues`);
        setMessages(githubMessages);
        loadData();
      } else {
        alert('No se encontraron mensajes en GitHub Issues con la etiqueta "guest-book"');
      }
    } catch (error) {
      console.error('Error loading from GitHub:', error);
      alert(`✗ Error al cargar desde GitHub: ${error.message}`);
    }
  };

  const filteredMessages = messages.filter(msg =>
    searchTerm === '' ||
    (msg.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.message || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="main-content">
          <div className="py-20 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6">
                  <Icon name="Lock" className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-display text-center mb-2">
                  Panel de Administración
                </h1>
                <p className="text-muted-foreground text-center mb-6">
                  Ingresa la contraseña para ver los mensajes
                </p>
                <form onSubmit={handleLogin}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Ingresar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="main-content">
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-display mb-2">
                Libro de Visitas
              </h1>
              <p className="text-muted-foreground">
                Gestiona los mensajes de los invitados
              </p>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Total Mensajes</span>
                    <Icon name="MessageSquare" className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold">{stats.totalMessages}</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Total Likes</span>
                    <Icon name="Heart" className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{stats.totalLikes}</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Idiomas</span>
                    <Icon name="Globe" className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-lg font-medium">
                    ES: {stats.languages.es} / EN: {stats.languages.en}
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar por nombre, email o mensaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Icon name="Upload" className="w-4 h-4" />
                Importar CSV
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="Download" className="w-4 h-4" />
                Exportar CSV
              </button>
              <button
                onClick={handleLoadFromGitHub}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Icon name="Download" className="w-4 h-4" />
                Cargar desde GitHub
              </button>
              <button
                onClick={handleSyncToGitHub}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Icon name="RefreshCw" className="w-4 h-4" />
                Sincronizar (Merge)
              </button>
              <button
                onClick={() => setShowTokenModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Icon name="Key" className="w-4 h-4" />
                Configurar Token
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                <Icon name="Trash2" className="w-4 h-4" />
                Eliminar Todos
              </button>
            </div>

            {/* GitHub Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="Info" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Sistema de Sincronización con GitHub
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    Los mensajes se guardan localmente y se pueden sincronizar con GitHub Issues. 
                    Cada mensaje se crea como un Issue con la etiqueta "guest-book". 
                    Los invitados verán mensajes de otros invitados en tiempo real si tienen el mismo navegador.
                  </p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <Icon name="MessageSquare" className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No se encontraron mensajes' : 'Aún no hay mensajes'}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div key={msg.id} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{msg.name}</h3>
                        <p className="text-sm text-muted-foreground">{msg.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.date).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Icon name="Heart" className="w-4 h-4 text-red-600" />
                          {msg.likes || 0}
                        </span>
                        <button
                          onClick={() => handleDelete(msg.id, msg.name)}
                          className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Icon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-foreground bg-muted/50 rounded-lg p-4">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* GitHub Token Configuration Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">Configurar Token de GitHub</h3>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-4">
                Para guardar mensajes en GitHub, necesitas un Personal Access Token con permisos de escritura.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-2 font-semibold">
                  Cómo obtener tu token:
                </p>
                <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Ve a GitHub → Settings → Developer settings</li>
                  <li>Clic en "Personal access tokens" → "Tokens (classic)"</li>
                  <li>Clic en "Generate new token (classic)"</li>
                  <li>Selecciona el scope "repo" (acceso completo)</li>
                  <li>Copia el token generado</li>
                </ol>
              </div>

              <label className="block text-sm font-medium text-foreground mb-2">
                GitHub Token
              </label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">
                El token se guarda localmente en tu navegador y nunca se comparte.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveToken}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Guardar Token
              </button>
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestBookAdmin;
