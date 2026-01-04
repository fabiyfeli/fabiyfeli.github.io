import { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import Icon from '../../components/AppIcon';
import {
  loadMessages,
  loadMessagesWithSync,
  deleteMessage,
  exportMessagesToCSV,
  importMessagesFromCSV,
  clearAllMessages,
  getGuestBookStats,
  diagnoseDuplicateMessages,
  removeDuplicateMessages
} from '../../utils/guestBookStorage';
import { checkAuth, setAuthSession, isAuthenticated, logout } from '../../utils/rsvpStorage';

const GuestBookAdmin = () => {
  const fileInputRef = useRef(null);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setIsAuth(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const loadedMessages = await loadMessagesWithSync();
      setMessages(loadedMessages);
      setStats(getGuestBookStats());
      console.log('✓ Loaded', loadedMessages.length, 'messages from Firebase/localStorage');
    } catch (error) {
      console.error('Error loading messages:', error);
      // Fallback to local data
      const localMessages = loadMessages();
      setMessages(localMessages);
      setStats(getGuestBookStats());
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (checkAuth(password)) {
      setAuthSession(true);
      setIsAuth(true);
      loadData();
      setPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
      setIsAuth(false);
      setMessages([]);
      setStats(null);
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
      // Wait a moment for Firebase to sync before reloading
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadData();
    }
  };

  const handleDiagnoseDuplicates = async () => {
    console.log('🔍 Opening browser console to see diagnosis results...');
    alert('Abriendo consola del navegador...\n\nPresiona F12 para ver los resultados detallados del diagnóstico.');
    
    const diagnosis = await diagnoseDuplicateMessages();
    
    if (diagnosis.error) {
      alert(`❌ Error: ${diagnosis.error}`);
      return;
    }
    
    let message = `📊 Diagnóstico de duplicados:\n\n`;
    message += `Total en Firebase: ${diagnosis.firebaseTotal}\n`;
    message += `Total en local: ${diagnosis.localTotal}\n`;
    message += `Emails únicos: ${diagnosis.uniqueEmails}\n`;
    message += `Registros duplicados: ${diagnosis.totalDuplicateRecords}\n`;
    message += `Grupos de duplicados: ${diagnosis.duplicateCount}\n`;
    message += `\nFaltantes en local: ${diagnosis.firebaseTotal - diagnosis.localTotal}`;
    
    if (diagnosis.duplicateCount > 0) {
      message += `\n\n⚠️ Se encontraron ${diagnosis.duplicateCount} grupos de duplicados.`;
      message += `\nVer consola del navegador (F12) para detalles completos.`;
    }
    
    alert(message);
  };

  const handleRemoveDuplicates = async () => {
    const diagnosis = await diagnoseDuplicateMessages();
    
    if (diagnosis.error) {
      alert(`❌ Error: ${diagnosis.error}`);
      return;
    }
    
    if (diagnosis.totalDuplicateRecords === 0) {
      alert('✅ No se encontraron duplicados');
      return;
    }
    
    const confirmMessage = `⚠️ Se encontraron ${diagnosis.totalDuplicateRecords} registros duplicados en ${diagnosis.duplicateCount} grupos.\n\n` +
      `Se eliminarán los duplicados, manteniendo el registro más reciente de cada grupo.\n\n` +
      `¿Continuar?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = await removeDuplicateMessages();
      
      if (result.error) {
        alert(`❌ Error: ${result.error}`);
      } else {
        alert(`✅ ${result.message}\n\nEliminados: ${result.removed}\nNuevo total: ${result.newTotal}`);
        // Reload data
        await loadData();
      }
    } catch (error) {
      console.error('Error removing duplicates:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
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
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-display mb-2">
                  Libro de Visitas
                </h1>
                <p className="text-muted-foreground">
                  Gestiona los mensajes de los invitados
                </p>
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Icon name="LogOut" className="w-4 h-4" />
                Cerrar sesión
              </button>
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
                onClick={handleDiagnoseDuplicates}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Diagnosticar registros duplicados"
              >
                <Icon name="AlertCircle" className="w-4 h-4" />
                Diagnosticar Duplicados
              </button>
              <button
                onClick={handleRemoveDuplicates}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Eliminar registros duplicados, manteniendo el más reciente"
              >
                <Icon name={isProcessing ? "Loader2" : "Trash"} className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? 'Procesando...' : 'Eliminar Duplicados'}
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                <Icon name="Trash2" className="w-4 h-4" />
                Eliminar Todos
              </button>
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
    </div>
  );
};

export default GuestBookAdmin;
