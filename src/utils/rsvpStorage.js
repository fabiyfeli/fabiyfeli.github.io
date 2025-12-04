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
    submittedAt: new Date(),
    approved: false // New RSVPs need approval
  };
  const updatedRSVPs = [rsvpWithMetadata, ...rsvps];
  saveRSVPs(updatedRSVPs);
  return rsvpWithMetadata;
};

// Get RSVP statistics
export const getRSVPStats = () => {
  const rsvps = loadRSVPs();
  const approvedRSVPs = rsvps.filter(r => r.approved === true);
  
  const attending = approvedRSVPs.filter(r => r.attendance === 'yes');
  const notAttending = approvedRSVPs.filter(r => r.attendance === 'no');
  const pending = rsvps.filter(r => !r.approved);
  
  let totalGuests = 0;
  attending.forEach(rsvp => {
    totalGuests += 1; // Main guest
    if (rsvp.hasPlusOne && (rsvp.plusOneFirstName || rsvp.plusOneLastName)) {
      totalGuests += 1; // Plus one
    }
  });

  return {
    totalResponses: rsvps.length,
    approved: approvedRSVPs.length,
    pending: pending.length,
    attending: attending.length,
    notAttending: notAttending.length,
    totalGuests: totalGuests
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

// Export RSVPs as downloadable CSV
export const exportRSVPs = () => {
  const rsvps = loadRSVPs();
  
  // Define CSV headers (added ID column first)
  const headers = [
    'ID',
    'Nombre',
    'Apellido',
    'Email',
    'Teléfono',
    'Asistencia',
    'Idioma',
    'Restricciones Alimentarias',
    'Acceso Silla de Ruedas',
    'Asistencia Auditiva',
    'Asistencia Visual',
    'Necesita Transporte',
    'Necesita Alojamiento',
    'Notas Adicionales',
    'Aprobado',
    'Fecha de Envío'
  ];
  
  // Convert RSVPs to CSV rows (include ID as first column)
  const rows = rsvps.map(rsvp => [
    rsvp.id || '',
    rsvp.firstName || '',
    rsvp.lastName || '',
    rsvp.email || '',
    rsvp.phone || '',
    rsvp.attendance === 'yes' ? 'Sí' : 'No',
    rsvp.language === 'es' ? 'Español' : 'English',
    rsvp.dietaryRestrictions || '',
    rsvp.needsWheelchairAccess ? 'Sí' : 'No',
    rsvp.needsHearingAssistance ? 'Sí' : 'No',
    rsvp.needsVisualAssistance ? 'Sí' : 'No',
    rsvp.needsTransportation ? 'Sí' : 'No',
    rsvp.needsAccommodation ? 'Sí' : 'No',
    rsvp.specialNotes || '',
    rsvp.approved ? 'Sí' : 'No',
    new Date(rsvp.submittedAt).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  ]);
  
  // Escape CSV values that contain commas, quotes, or newlines
  const escapeCSV = (value) => {
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };
  
  // Build CSV content
  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');
  
  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `confirmaciones-rsvp-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Toggle RSVP approval status
export const toggleRSVPApproval = (rsvpId) => {
  const rsvps = loadRSVPs();
  const updatedRSVPs = rsvps.map(rsvp => {
    if (rsvp.id === rsvpId) {
      return { ...rsvp, approved: !rsvp.approved };
    }
    return rsvp;
  });
  saveRSVPs(updatedRSVPs);
  return updatedRSVPs;
};

// Update RSVP data (for manual edits)
export const updateRSVP = (rsvpId, updates) => {
  const rsvps = loadRSVPs();
  const updatedRSVPs = rsvps.map(rsvp => {
    if (rsvp.id === rsvpId) {
      return { ...rsvp, ...updates };
    }
    return rsvp;
  });
  saveRSVPs(updatedRSVPs);
  return updatedRSVPs;
};

// Delete a specific RSVP
export const deleteRSVP = (rsvpId) => {
  const rsvps = loadRSVPs();
  const updatedRSVPs = rsvps.filter(rsvp => rsvp.id !== rsvpId);
  saveRSVPs(updatedRSVPs);
  return updatedRSVPs;
};

// Import RSVPs from CSV
export const importRSVPsFromCSV = (csvContent) => {
  try {
    // Remove BOM if present
    const cleanContent = csvContent.replace(/^\uFEFF/, '');
    const lines = cleanContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('El archivo CSV está vacío o no tiene datos');
    }

    // Skip header line
    const dataLines = lines.slice(1);
    const newRSVPs = [];

    dataLines.forEach((line, index) => {
      try {
        // Parse CSV line handling quoted values
        const values = [];
        let currentValue = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
              currentValue += '"';
              i++; // Skip next quote
            } else {
              insideQuotes = !insideQuotes;
            }
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim()); // Push last value

        if (values.length < 16) {
          console.warn(`Línea ${index + 2} tiene columnas insuficientes, saltando...`);
          return;
        }

        // Check if ID exists (first column)
        const existingId = values[0] ? parseInt(values[0]) : null;

        const rsvp = {
          id: existingId || (Date.now() + index), // Use existing ID or generate new one
          firstName: values[1] || '',
          lastName: values[2] || '',
          email: values[3] || '',
          phone: values[4] || '',
          attendance: values[5] === 'Sí' ? 'yes' : 'no',
          language: values[6] === 'Español' ? 'es' : 'en',
          dietaryRestrictions: values[7] || '',
          needsWheelchairAccess: values[8] === 'Sí',
          needsHearingAssistance: values[9] === 'Sí',
          needsVisualAssistance: values[10] === 'Sí',
          needsTransportation: values[11] === 'Sí',
          needsAccommodation: values[12] === 'Sí',
          specialNotes: values[13] || '',
          approved: values[14] === 'Sí',
          submittedAt: new Date(),
          hasPlusOne: false,
          plusOneFirstName: '',
          plusOneLastName: ''
        };

        newRSVPs.push(rsvp);
      } catch (error) {
        console.error(`Error procesando línea ${index + 2}:`, error);
      }
    });

    if (newRSVPs.length === 0) {
      throw new Error('No se pudieron procesar registros del CSV');
    }

    // Replace existing RSVPs with matching IDs, add new ones
    const existingRSVPs = loadRSVPs();
    const importedIds = new Set(newRSVPs.map(r => r.id));
    
    // Update existing records that have matching IDs in the import
    let updatedCount = 0;
    let addedCount = 0;
    
    const mergedRSVPs = existingRSVPs.map(existing => {
      const importedMatch = newRSVPs.find(imported => imported.id === existing.id);
      if (importedMatch) {
        updatedCount++;
        return importedMatch;
      }
      return existing;
    });
    
    // Add truly new records (those without matching ID in existing data)
    const existingIds = new Set(existingRSVPs.map(r => r.id));
    newRSVPs.forEach(imported => {
      if (!existingIds.has(imported.id)) {
        mergedRSVPs.push(imported);
        addedCount++;
      }
    });
    
    saveRSVPs(mergedRSVPs);

    return { success: true, count: newRSVPs.length, updated: updatedCount, added: addedCount };
  } catch (error) {
    console.error('Error importing CSV:', error);
    return { success: false, error: error.message };
  }
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
