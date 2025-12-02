import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Icon from '../../components/AppIcon';
import { 
  loadRSVPs, 
  getRSVPStats, 
  checkAuth, 
  setAuthSession, 
  isAuthenticated,
  exportRSVPs,
  clearAllRSVPs
} from '../../utils/rsvpStorage';

const RSVPAdmin = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all'); // all, attending, notAttending
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      setIsAuth(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const loadedRSVPs = loadRSVPs();
    setRsvps(loadedRSVPs);
    setStats(getRSVPStats());
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

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las confirmaciones? Esta acción no se puede deshacer.')) {
      clearAllRSVPs();
      loadData();
    }
  };

  const filteredRSVPs = rsvps.filter(rsvp => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'attending' && rsvp.attendance === 'yes') ||
      (filter === 'notAttending' && rsvp.attendance === 'no');
    
    const matchesSearch = 
      searchTerm === '' ||
      `${rsvp.firstName} ${rsvp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rsvp.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
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
              <h1 className="text-3xl sm:text-4xl font-display mb-2">
                Confirmaciones RSVP
              </h1>
              <p className="text-muted-foreground">
                Gestiona las confirmaciones de asistencia
              </p>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Total Respuestas</span>
                    <Icon name="Users" className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold">{stats.totalResponses}</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Confirman Asistencia</span>
                    <Icon name="Check" className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">{stats.attending}</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">No Asisten</span>
                    <Icon name="X" className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{stats.notAttending}</div>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Total Invitados</span>
                    <Icon name="UserPlus" className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold">{stats.totalGuests}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Incluyendo acompañantes
                  </p>
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
              <div className="flex gap-2">
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
                  onClick={() => setFilter('attending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'attending'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  Asisten
                </button>
                <button
                  onClick={() => setFilter('notAttending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'notAttending'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  No Asisten
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="Download" className="w-4 h-4" />
                Exportar JSON
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
                  <div key={rsvp.id} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                            rsvp.attendance === 'yes' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            <Icon 
                              name={rsvp.attendance === 'yes' ? 'Check' : 'X'} 
                              className="w-6 h-6" 
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-display mb-1">
                              {rsvp.firstName} {rsvp.lastName}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon name="Mail" className="w-4 h-4" />
                                {rsvp.email}
                              </span>
                              {rsvp.phone && (
                                <span className="flex items-center gap-1">
                                  <Icon name="Phone" className="w-4 h-4" />
                                  {rsvp.phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Icon name="Globe" className="w-4 h-4" />
                                {rsvp.language === 'es' ? 'Español' : 'English'}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Enviado: {new Date(rsvp.submittedAt).toLocaleDateString('es-CL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
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
                            {/* Meal Preferences */}
                            {rsvp.mealPreference && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Menú Principal:
                                </p>
                                <p className="text-sm">
                                  {rsvp.mealPreference === 'meat' && '🥩 Carne'}
                                  {rsvp.mealPreference === 'fish' && '🐟 Pescado'}
                                  {rsvp.mealPreference === 'vegetarian' && '🥗 Vegetariano'}
                                  {rsvp.mealPreference === 'vegan' && '🌱 Vegano'}
                                </p>
                              </div>
                            )}

                            {rsvp.hasPlusOne && rsvp.plusOneMealPreference && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Menú Acompañante:
                                </p>
                                <p className="text-sm">
                                  {rsvp.plusOneMealPreference === 'meat' && '🥩 Carne'}
                                  {rsvp.plusOneMealPreference === 'fish' && '🐟 Pescado'}
                                  {rsvp.plusOneMealPreference === 'vegetarian' && '🥗 Vegetariano'}
                                  {rsvp.plusOneMealPreference === 'vegan' && '🌱 Vegano'}
                                </p>
                              </div>
                            )}

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
