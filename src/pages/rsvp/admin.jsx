import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Icon from '../../components/AppIcon';
import { 
  loadRSVPs,
  loadRSVPsWithSync,
  getRSVPStats, 
  checkAuth, 
  setAuthSession, 
  isAuthenticated,
  exportRSVPs,
  clearAllRSVPs,
  toggleRSVPApproval,
  updateRSVP,
  deleteRSVP,
  importRSVPsFromCSV,
  importRSVPsFromCSVWithFirebase,
  migrateLocalStorageToFirebase
} from '../../utils/rsvpStorage';

const RSVPAdmin = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all'); // all, attending, notAttendingApproved, notAttendingPending, pending, approved
  const [searchTerm, setSearchTerm] = useState('');
  const [editingField, setEditingField] = useState(null); // { rsvpId, field }
  const [editValue, setEditValue] = useState('');
  const [isLoadingFirebase, setIsLoadingFirebase] = useState(false);
  const [dataSource, setDataSource] = useState(''); // 'firebase', 'localStorage', 'error'
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setIsAuth(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    setIsLoadingFirebase(true);
    setDataSource('');
    
    console.log('🚀 Admin Panel: Starting data load...');
    console.log('📅 Current date:', new Date().toLocaleString());
    
    try {
      const loadedRSVPs = await loadRSVPsWithSync();
      setRsvps(loadedRSVPs);
      setStats(getRSVPStats());
      
      // Determine data source from console logs
      if (loadedRSVPs.length > 0 && loadedRSVPs[0].firebaseId) {
        setDataSource('firebase');
        console.log('✅ Data source: Firebase');
      } else if (loadedRSVPs.length > 0) {
        setDataSource('localStorage');
        console.log('⚠️ Data source: localStorage only');
      }
      
      console.log('✓ Loaded', loadedRSVPs.length, 'RSVPs');
      console.log('📝 First RSVP date:', loadedRSVPs[0]?.submittedAt);
    } catch (error) {
      console.error('❌ Error loading RSVPs:', error);
      setDataSource('error');
      // Fallback to local data
      const localRSVPs = loadRSVPs();
      setRsvps(localRSVPs);
      setStats(getRSVPStats());
    } finally {
      setIsLoadingFirebase(false);
    }
  };

  const handleRefreshFromFirebase = async () => {
    setIsLoadingFirebase(true);
    setDataSource('');
    
    console.log('🔄 Manual refresh requested...');
    
    // Clear localStorage to force Firebase reload
    localStorage.removeItem('wedding_rsvps');
    console.log('🗑️ Cleared localStorage cache');
    
    try {
      const loadedRSVPs = await loadRSVPsWithSync();
      setRsvps(loadedRSVPs);
      setStats(getRSVPStats());
      
      if (loadedRSVPs.length > 0 && loadedRSVPs[0].firebaseId) {
        setDataSource('firebase');
        alert(`✓ Recargados ${loadedRSVPs.length} RSVPs desde Firebase\n\nÚltima actualización: ${loadedRSVPs[0]?.submittedAt?.toLocaleString()}`);
      } else {
        setDataSource('localStorage');
        alert(`⚠️ No se pudieron cargar datos de Firebase.\nUsando ${loadedRSVPs.length} RSVPs de localStorage.`);
      }
    } catch (error) {
      console.error('❌ Error refreshing from Firebase:', error);
      setDataSource('error');
      alert('Error al cargar desde Firebase. Ver consola para detalles.');
    } finally {
      setIsLoadingFirebase(false);
    }
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
    exportRSVPs();
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
    reader.onload = async (e) => {
      try {
        const csvContent = e.target?.result;
        console.log('CSV Content loaded, length:', csvContent?.length);
        console.log('First 200 chars:', csvContent?.substring(0, 200));
        
        console.log('⏳ Importando y sincronizando con Firebase...');
        
        const result = await importRSVPsFromCSVWithFirebase(csvContent);
        console.log('Import result:', result);
        
        if (result.success) {
          const messages = [];
          if (result.updated > 0) messages.push(`${result.updated} actualizados`);
          if (result.added > 0) messages.push(`${result.added} nuevos`);
          
          let message = `✓ Importación exitosa: ${messages.join(', ')}`;
          
          if (result.firebaseSynced !== undefined) {
            message += `\n\n☁️ Firebase: ${result.firebaseSynced} sincronizados`;
            if (result.firebaseErrors > 0) {
              message += `, ${result.firebaseErrors} errores`;
            }
          }
          
          alert(message);
          
          // Clear cache and reload from Firebase
          localStorage.removeItem('wedding_rsvp_responses');
          await loadData();
        } else {
          alert(`✗ Error al importar: ${result.error}`);
        }
      } catch (error) {
        console.error('Error in handleFileChange:', error);
        alert(`✗ Error al procesar el archivo: ${error.message}`);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      alert('Error al leer el archivo');
    };
    
    // Try reading with UTF-8 encoding first
    reader.readAsText(file, 'UTF-8');
  };

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las confirmaciones? Esta acción no se puede deshacer.')) {
      clearAllRSVPs();
      loadData();
    }
  };

  const handleToggleApproval = async (rsvpId) => {
    await toggleRSVPApproval(rsvpId);
    // Wait a moment for Firebase to sync before reloading
    await new Promise(resolve => setTimeout(resolve, 500));
    await loadData();
  };

  const handleToggleAttendance = async (rsvpId) => {
    const rsvp = rsvps.find(r => r.id === rsvpId);
    if (rsvp) {
      const newAttendance = rsvp.attendance === 'yes' ? 'no' : 'yes';
      await updateRSVP(rsvpId, { attendance: newAttendance });
      // Wait a moment for Firebase to sync before reloading
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadData();
    }
  };

  const startEditing = (rsvpId, field, currentValue) => {
    setEditingField({ rsvpId, field });
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (editingField) {
      await updateRSVP(editingField.rsvpId, { [editingField.field]: editValue });
      setEditingField(null);
      setEditValue('');
      // Wait a moment for Firebase to sync before reloading
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadData();
    }
  };

  const handleDelete = async (rsvpId, guestName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la confirmación de ${guestName}?`)) {
      await deleteRSVP(rsvpId);
      // Wait a moment for Firebase to sync before reloading
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadData();
    }
  };

  const handleMigrateToFirebase = async () => {
    const localRSVPs = loadRSVPs();
    
    if (localRSVPs.length === 0) {
      alert('No hay RSVPs en localStorage para migrar');
      return;
    }

    // Ask user if they want to overwrite existing data
    const message = `¿Migrar ${localRSVPs.length} RSVPs de localStorage a Firebase?\n\n` +
      `Si hay RSVPs duplicados (mismo email):\n` +
      `• OK = Solo crear nuevos (no sobrescribe)\n` +
      `• Cancelar = Abortar migración\n\n` +
      `Para SOBRESCRIBIR duplicados, mantén presionado SHIFT y haz click en OK.`;
    
    if (!window.confirm(message)) {
      return;
    }

    // Check if SHIFT key is pressed for force overwrite
    const forceOverwrite = window.event && window.event.shiftKey;
    
    if (forceOverwrite) {
      if (!window.confirm(`⚠️ MODO SOBRESCRITURA ACTIVADO\n\nEsto actualizará TODOS los RSVPs existentes en Firebase con los datos de localStorage.\n\n¿Continuar?`)) {
        return;
      }
    }

    setIsMigrating(true);
    try {
      const result = await migrateLocalStorageToFirebase(forceOverwrite);
      
      let message = `✅ Migración completada!\n\n`;
      if (result.successCount > 0) message += `${result.successCount} creados\n`;
      if (result.updatedCount > 0) message += `${result.updatedCount} actualizados\n`;
      if (result.skippedCount > 0) message += `${result.skippedCount} omitidos (ya existían)\n`;
      if (result.errorCount > 0) message += `\n⚠️ ${result.errorCount} errores (ver consola)`;
      
      alert(message);
      
      // Clear localStorage cache and reload from Firebase
      localStorage.removeItem('wedding_rsvp_responses');
      await loadData();
    } catch (error) {
      console.error('Migration error:', error);
      alert(`❌ Error durante la migración: ${error.message}`);
    } finally {
      setIsMigrating(false);
    }
  };



  const filteredRSVPs = rsvps
    .filter(rsvp => {
      // Apply filter logic
      let matchesFilter = false;
      
      if (filter === 'all') {
        matchesFilter = true;
      } else if (filter === 'attending') {
        matchesFilter = rsvp.attendance === 'yes' && rsvp.approved === true;
      } else if (filter === 'notAttendingApproved') {
        matchesFilter = rsvp.attendance === 'no' && rsvp.approved === true;
      } else if (filter === 'notAttendingPending') {
        matchesFilter = rsvp.attendance === 'no' && rsvp.approved === false;
      } else if (filter === 'pending') {
        matchesFilter = rsvp.approved === false && rsvp.attendance !== 'no';
      } else if (filter === 'approved') {
        matchesFilter = rsvp.approved === true;
      }
      
      // Apply search filter
      const matchesSearch = 
        searchTerm === '' ||
        `${rsvp.firstName || ''} ${rsvp.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rsvp.email || '').toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by submission date (newest first)
      const dateA = new Date(a.submittedAt || 0);
      const dateB = new Date(b.submittedAt || 0);
      return dateB - dateA;
    });

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
                  Ingresa la contraseña para ver las confirmaciones
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-display mb-2">
                    Confirmaciones RSVP
                  </h1>
                  <p className="text-muted-foreground">
                    Gestiona las confirmaciones de asistencia
                  </p>
                </div>
                {/* Data Source Indicator */}
                {dataSource && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    dataSource === 'firebase' ? 'bg-green-100 text-green-700 border border-green-300' :
                    dataSource === 'localStorage' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                    'bg-red-100 text-red-700 border border-red-300'
                  }`}>
                    <Icon name={
                      dataSource === 'firebase' ? 'Cloud' :
                      dataSource === 'localStorage' ? 'HardDrive' :
                      'AlertCircle'
                    } className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {dataSource === 'firebase' ? '☁️ Firebase' :
                       dataSource === 'localStorage' ? '💾 Local' :
                       '❌ Error'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Total Respuestas</span>
                    <Icon name="Users" className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold">{stats.totalResponses}</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Pendientes</span>
                    <Icon name="Clock" className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Asistirán</span>
                    <Icon name="Check" className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">{stats.attending}</div>
                  <p className="text-xs text-muted-foreground mt-1">Aprobados</p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">No Asistirán</span>
                    <Icon name="X" className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{stats.notAttendingTotal}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.notAttendingApproved} apr. / {stats.notAttendingPending} pend.
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Total Invitados</span>
                    <Icon name="UserPlus" className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold">{stats.totalGuests}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Que asistirán
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Aprobados</span>
                    <Icon name="CheckCircle2" className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{stats.approved}</div>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'pending'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'approved'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  Aprobados
                </button>
                <button
                  onClick={() => setFilter('attending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'attending'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  Asistirán
                </button>
                <button
                  onClick={() => setFilter('notAttendingApproved')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'notAttendingApproved'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  No Asistirán (Apr)
                </button>
                <button
                  onClick={() => setFilter('notAttendingPending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'notAttendingPending'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  No Asistirán (Pend)
                </button>
              </div>
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
                onClick={handleRefreshFromFirebase}
                disabled={isLoadingFirebase}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name={isLoadingFirebase ? "Loader2" : "RefreshCw"} className={`w-4 h-4 ${isLoadingFirebase ? 'animate-spin' : ''}`} />
                {isLoadingFirebase ? 'Cargando...' : 'Recargar Firebase'}
              </button>
              <button
                onClick={handleMigrateToFirebase}
                disabled={isMigrating}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Migrar/Sincronizar datos locales a Firebase (SHIFT+Click para sobrescribir duplicados)"
              >
                <Icon name={isMigrating ? "Loader2" : "Upload"} className={`w-4 h-4 ${isMigrating ? 'animate-spin' : ''}`} />
                {isMigrating ? 'Migrando...' : 'Migrar a Firebase'}
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                <Icon name="Trash2" className="w-4 h-4" />
                Eliminar Todas
              </button>
            </div>

            {/* RSVPs List */}
            <div className="space-y-4">
              {filteredRSVPs.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <Icon name="Users" className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || filter !== 'all' 
                      ? 'No se encontraron confirmaciones con los filtros aplicados'
                      : 'Aún no hay confirmaciones'}
                  </p>
                </div>
              ) : (
                filteredRSVPs.map((rsvp) => (
                  <div key={rsvp.id} className={`bg-card rounded-xl p-6 border-2 ${
                    rsvp.approved ? 'border-green-500/30' : 'border-orange-500/30'
                  } ${rsvp.previouslyApproved && !rsvp.approved ? 'ring-2 ring-blue-500/50' : ''}`}>
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      {/* Main Info */}
                      <div className="flex-1">
                        {rsvp.previouslyApproved && !rsvp.approved && (
                          <div className="mb-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                              <Icon name="RefreshCw" className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Actualización Pendiente - Este invitado modificó su RSVP
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-4 mb-4">
                          <button
                            onClick={() => handleToggleAttendance(rsvp.id)}
                            className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all hover:scale-110 ${
                              rsvp.attendance === 'yes' 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                            title={rsvp.attendance === 'yes' ? 'Clic para marcar como NO asistirá' : 'Clic para marcar como SÍ asistirá'}
                          >
                            <Icon 
                              name={rsvp.attendance === 'yes' ? 'Check' : 'X'} 
                              className="w-6 h-6" 
                            />
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {editingField?.rsvpId === rsvp.id && (editingField?.field === 'firstName' || editingField?.field === 'lastName') ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="px-2 py-1 border border-border rounded text-foreground bg-background"
                                    placeholder={editingField?.field === 'firstName' ? 'Nombre' : 'Apellido'}
                                    autoFocus
                                  />
                                  <button
                                    onClick={saveEdit}
                                    className="p-1 bg-green-100 text-green-700 hover:bg-green-200 rounded"
                                    title="Guardar"
                                  >
                                    <Icon name="Check" className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="p-1 bg-red-100 text-red-700 hover:bg-red-200 rounded"
                                    title="Cancelar"
                                  >
                                    <Icon name="X" className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <h3 className="text-xl font-display">
                                  <button
                                    onClick={() => startEditing(rsvp.id, 'firstName', rsvp.firstName)}
                                    className="hover:text-primary cursor-pointer"
                                    title="Clic para editar nombre"
                                  >
                                    {rsvp.firstName}
                                  </button>
                                  {' '}
                                  <button
                                    onClick={() => startEditing(rsvp.id, 'lastName', rsvp.lastName)}
                                    className="hover:text-primary cursor-pointer"
                                    title="Clic para editar apellido"
                                  >
                                    {rsvp.lastName}
                                  </button>
                                </h3>
                              )}
                              {rsvp.approved ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  <Icon name="CheckCircle2" className="w-3 h-3" />
                                  Aprobado
                                </span>
                              ) : rsvp.previouslyApproved ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                  <Icon name="RefreshCw" className="w-3 h-3" />
                                  Actualizado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                  <Icon name="Clock" className="w-3 h-3" />
                                  Pendiente
                                </span>
                              )}
                              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                rsvp.attendance === 'yes'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}>
                                <Icon name={rsvp.attendance === 'yes' ? 'Check' : 'X'} className="w-3 h-3" />
                                {rsvp.attendance === 'yes' ? 'Asistirá' : 'No Asistirá'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon name="Mail" className="w-4 h-4" />
                                {editingField?.rsvpId === rsvp.id && editingField?.field === 'email' ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="email"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="px-2 py-1 border border-border rounded text-foreground bg-background"
                                      autoFocus
                                    />
                                    <button
                                      onClick={saveEdit}
                                      className="p-1 bg-green-100 text-green-700 hover:bg-green-200 rounded"
                                      title="Guardar"
                                    >
                                      <Icon name="Check" className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={cancelEditing}
                                      className="p-1 bg-red-100 text-red-700 hover:bg-red-200 rounded"
                                      title="Cancelar"
                                    >
                                      <Icon name="X" className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEditing(rsvp.id, 'email', rsvp.email)}
                                    className="hover:text-primary cursor-pointer"
                                    title="Clic para editar"
                                  >
                                    {rsvp.email}
                                  </button>
                                )}
                              </span>
                              {rsvp.phone && (
                                <span className="flex items-center gap-1">
                                  <Icon name="Phone" className="w-4 h-4" />
                                  {rsvp.phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Icon name="Globe" className="w-4 h-4" />
                                {editingField?.rsvpId === rsvp.id && editingField?.field === 'language' ? (
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="px-2 py-1 border border-border rounded text-foreground bg-background"
                                      autoFocus
                                    >
                                      <option value="es">Español</option>
                                      <option value="en">English</option>
                                    </select>
                                    <button
                                      onClick={saveEdit}
                                      className="p-1 bg-green-100 text-green-700 hover:bg-green-200 rounded"
                                      title="Guardar"
                                    >
                                      <Icon name="Check" className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={cancelEditing}
                                      className="p-1 bg-red-100 text-red-700 hover:bg-red-200 rounded"
                                      title="Cancelar"
                                    >
                                      <Icon name="X" className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEditing(rsvp.id, 'language', rsvp.language)}
                                    className="hover:text-primary cursor-pointer"
                                    title="Clic para editar"
                                  >
                                    {rsvp.language === 'es' ? 'Español' : 'English'}
                                  </button>
                                )}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 space-y-1">
                              <p>
                                Enviado: {new Date(rsvp.submittedAt).toLocaleDateString('es-CL', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {rsvp.updatedAt && (
                                <p className="text-blue-600 dark:text-blue-400 font-medium">
                                  <Icon name="RefreshCw" className="w-3 h-3 inline mr-1" />
                                  Actualizado: {new Date(rsvp.updatedAt).toLocaleDateString('es-CL', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Plus One */}
                        {rsvp.hasPlusOne && rsvp.attendance === 'yes' && (
                          <div className="mb-4 pl-16">
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm font-medium mb-1">Acompañante:</p>
                              <p className="text-sm">
                                {rsvp.plusOneFirstName} {rsvp.plusOneLastName}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Details Grid */}
                        {rsvp.attendance === 'yes' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-16">
                            {/* Dietary Restrictions */}
                            {rsvp.dietaryRestrictions && (
                              <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Restricciones Alimentarias:
                                </p>
                                <p className="text-sm">{rsvp.dietaryRestrictions}</p>
                              </div>
                            )}

                            {/* Accessibility Needs */}
                            {(rsvp.needsWheelchairAccess || rsvp.needsHearingAssistance || rsvp.needsVisualAssistance) && (
                              <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Necesidades de Accesibilidad:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {rsvp.needsWheelchairAccess && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                      <Icon name="Wheelchair" className="w-3 h-3" />
                                      Silla de ruedas
                                    </span>
                                  )}
                                  {rsvp.needsHearingAssistance && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                      <Icon name="Ear" className="w-3 h-3" />
                                      Asistencia auditiva
                                    </span>
                                  )}
                                  {rsvp.needsVisualAssistance && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                      <Icon name="Eye" className="w-3 h-3" />
                                      Asistencia visual
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Transportation & Accommodation */}
                            {(rsvp.needsTransportation || rsvp.needsAccommodation) && (
                              <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Servicios Adicionales:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {rsvp.needsTransportation && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-sm rounded-full">
                                      <Icon name="Car" className="w-3 h-3" />
                                      Transporte
                                    </span>
                                  )}
                                  {rsvp.needsAccommodation && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-sm rounded-full">
                                      <Icon name="Home" className="w-3 h-3" />
                                      Alojamiento
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Special Notes */}
                            {rsvp.specialNotes && (
                              <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Notas Especiales:
                                </p>
                                <p className="text-sm bg-muted/50 rounded-lg p-3">
                                  {rsvp.specialNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t border-border mt-4">
                          <button
                            onClick={() => handleToggleApproval(rsvp.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                              rsvp.approved
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            <Icon name={rsvp.approved ? 'X' : 'CheckCircle2'} className="w-4 h-4" />
                            {rsvp.approved ? 'Desaprobar' : 'Aprobar'}
                          </button>
                          <button
                            onClick={() => handleDelete(rsvp.id, `${rsvp.firstName} ${rsvp.lastName}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                          >
                            <Icon name="Trash2" className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
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

export default RSVPAdmin;
