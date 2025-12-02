// RSVP Storage Utilities
const STORAGE_KEY = 'wedding_rsvp_responses';
const AUTH_KEY = 'wedding_rsvp_auth';

// Password for accessing RSVP data
export const RSVP_PASSWORD = 'FabiYFeli2026';

// Load RSVPs from localStorage
export const loadRSVPs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const rsvps = JSON.parse(stored);
      // Convert date strings back to Date objects
      return rsvps.map(rsvp => ({
        ...rsvp,
        submittedAt: new Date(rsvp.submittedAt)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading RSVPs:', error);
    return [];
  }
};

// Save RSVPs to localStorage
export const saveRSVPs = (rsvps) => {
  try {
    // Convert Date objects to ISO strings for storage
    const rsvpsForStorage = rsvps.map(rsvp => ({
      ...rsvp,
      submittedAt: rsvp.submittedAt instanceof Date ? rsvp.submittedAt.toISOString() : rsvp.submittedAt
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvpsForStorage));
    return true;
  } catch (error) {
    console.error('Error saving RSVPs:', error);
    return false;
  }
};

// Add a new RSVP
export const addRSVP = (rsvpData) => {
  const rsvps = loadRSVPs();
  const rsvpWithMetadata = {
    ...rsvpData,
    id: Date.now(), // Use timestamp as unique ID
    submittedAt: new Date()
  };
  const updatedRSVPs = [rsvpWithMetadata, ...rsvps];
  saveRSVPs(updatedRSVPs);
  return rsvpWithMetadata;
};

// Get RSVP statistics
export const getRSVPStats = () => {
  const rsvps = loadRSVPs();
  
  const attending = rsvps.filter(r => r.attending === true || r.attending === 'yes');
  const notAttending = rsvps.filter(r => r.attending === false || r.attending === 'no');
  
  let totalGuests = 0;
  attending.forEach(rsvp => {
    totalGuests += 1; // Main guest
    if (rsvp.hasPlusOne && rsvp.plusOneName) {
      totalGuests += 1; // Plus one
    }
  });

  return {
    totalResponses: rsvps.length,
    attending: attending.length,
    notAttending: notAttending.length,
    totalGuests: totalGuests,
    pendingResponses: 0 // You can adjust this if you track invited guests
  };
};

// Check authentication
export const checkAuth = (password) => {
  return password === RSVP_PASSWORD;
};

// Set auth session (temporary, expires on page reload)
export const setAuthSession = (isAuthenticated) => {
  if (isAuthenticated) {
    sessionStorage.setItem(AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
};

// Check if user is authenticated in current session
export const isAuthenticated = () => {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
};

// Export RSVPs as downloadable JSON
export const exportRSVPs = () => {
  const rsvps = loadRSVPs();
  const dataStr = JSON.stringify(rsvps, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rsvp-responses-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Clear all RSVPs (for resetting)
export const clearAllRSVPs = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing RSVPs:', error);
    return false;
  }
};
