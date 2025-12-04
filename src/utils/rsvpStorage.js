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
      const rsvpsWithDates = rsvps.map(rsvp => ({
        ...rsvp,
        submittedAt: new Date(rsvp.submittedAt)
      }));
      
      // Remove duplicates by ID (keep the most recent one)
      const uniqueRsvps = [];
      const seenIds = new Set();
      
      // Sort by submission date (newest first) to keep most recent duplicates
      rsvpsWithDates.sort((a, b) => b.submittedAt - a.submittedAt);
      
      for (const rsvp of rsvpsWithDates) {
        if (!seenIds.has(rsvp.id)) {
          seenIds.add(rsvp.id);
          uniqueRsvps.push(rsvp);
        }
      }
      
      // If we removed duplicates, save the clean version
      if (uniqueRsvps.length < rsvpsWithDates.length) {
        console.log(`Removed ${rsvpsWithDates.length - uniqueRsvps.length} duplicate RSVPs`);
        saveRSVPs(uniqueRsvps);
      }
      
      return uniqueRsvps;
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

// Add a new RSVP or update existing one if email matches
export const addRSVP = (rsvpData) => {
  const rsvps = loadRSVPs();
  
  // Check if an RSVP with the same email already exists
  const existingIndex = rsvps.findIndex(r => 
    r.email.toLowerCase() === rsvpData.email.toLowerCase()
  );
  
  if (existingIndex !== -1) {
    // Update existing RSVP
    const existingRSVP = rsvps[existingIndex];
    const updatedRSVP = {
      ...existingRSVP,
      ...rsvpData,
      id: existingRSVP.id, // Keep the original ID
      submittedAt: new Date(), // Update submission time
      // Keep approved status if it was already approved
      approved: existingRSVP.approved || false
    };
    rsvps[existingIndex] = updatedRSVP;
    saveRSVPs(rsvps);
    return updatedRSVP;
  } else {
    // Generate unique ID using timestamp + random number to avoid collisions
    const generateUniqueId = () => {
      let newId;
      const existingIds = new Set(rsvps.map(r => r.id));
      do {
        newId = Date.now() + Math.floor(Math.random() * 10000);
      } while (existingIds.has(newId));
      return newId;
    };
    
    // Add new RSVP
    const rsvpWithMetadata = {
      ...rsvpData,
      id: generateUniqueId(),
      submittedAt: new Date(),
      approved: false // New RSVPs need approval
    };
    const updatedRSVPs = [rsvpWithMetadata, ...rsvps];
    saveRSVPs(updatedRSVPs);
    return rsvpWithMetadata;
  }
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

    // Detect delimiter (comma or semicolon)
    const firstLine = lines[0];
    const delimiter = firstLine.includes(';') ? ';' : ',';
    console.log('CSV delimiter detected:', delimiter);

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
          } else if (char === delimiter && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim()); // Push last value

        console.log(`Línea ${index + 2}: ${values.length} columnas`, values);

        if (values.length < 16) {
          console.warn(`Línea ${index + 2} tiene ${values.length} columnas (esperadas: 16), saltando...`);
          return;
        }

        // Check if ID exists (first column) - must be valid number
        const csvId = values[0] ? parseInt(values[0]) : null;
        const hasValidId = csvId && !isNaN(csvId) && csvId > 0;

        const rsvp = {
          id: hasValidId ? csvId : null, // Keep valid ID or mark as null for new records
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
          plusOneLastName: '',
          _hasValidId: hasValidId // Track if this came with a valid ID
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
    
    let updatedCount = 0;
    let addedCount = 0;
    
    // First, handle records with valid IDs (updates)
    const recordsWithIds = newRSVPs.filter(r => r._hasValidId);
    const recordsWithoutIds = newRSVPs.filter(r => !r._hasValidId);
    
    console.log(`Records with IDs: ${recordsWithIds.length}, Records without IDs: ${recordsWithoutIds.length}`);
    
    // Start with existing RSVPs and update matching ones
    const mergedRSVPs = existingRSVPs.map(existing => {
      const importedMatch = recordsWithIds.find(imported => imported.id === existing.id);
      if (importedMatch) {
        updatedCount++;
        // Remove _hasValidId flag before returning
        const { _hasValidId, ...cleanRecord } = importedMatch;
        return cleanRecord;
      }
      return existing;
    });
    
    // Add records that have IDs but don't match any existing ones
    const existingIds = new Set(existingRSVPs.map(r => r.id));
    recordsWithIds.forEach(imported => {
      if (!existingIds.has(imported.id)) {
        const { _hasValidId, ...cleanRecord } = imported;
        mergedRSVPs.push(cleanRecord);
        addedCount++;
      }
    });
    
    // Add all new records (without IDs) with generated IDs
    recordsWithoutIds.forEach((imported, index) => {
      const { _hasValidId, ...cleanRecord } = imported;
      cleanRecord.id = Date.now() + index + Math.floor(Math.random() * 1000);
      mergedRSVPs.push(cleanRecord);
      addedCount++;
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
