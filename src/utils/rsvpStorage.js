// RSVP Storage Utilities
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  where,
  Timestamp 
} from 'firebase/firestore';

const STORAGE_KEY = 'wedding_rsvp_responses';
const AUTH_KEY = 'wedding_rsvp_auth';
const FIREBASE_COLLECTION = 'rsvps';

// Password for accessing RSVP data
export const RSVP_PASSWORD = 'FabiYFeli2026';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  try {
    return db && db !== undefined;
  } catch {
    return false;
  }
};

// Helper function to generate safe email key
const getEmailKey = (rsvp) => {
  try {
    if (!rsvp) return null;
    
    // Check if has valid email
    if (rsvp.email && typeof rsvp.email === 'string' && rsvp.email.trim() !== '' && !rsvp.email.includes('@placeholder.com')) {
      return rsvp.email.toLowerCase();
    }
    
    // Generate placeholder email
    const firstName = (rsvp.firstName || '').toLowerCase().replace(/\s+/g, '-');
    const lastName = (rsvp.lastName || '').toLowerCase().replace(/\s+/g, '-');
    const id = rsvp.id || Date.now();
    
    return `no-email-${firstName}-${lastName}-${id}@placeholder.com`;
  } catch (error) {
    console.error('Error generating email key:', error);
    return null;
  }
};

// Load RSVPs from Firebase
export const loadRSVPsFromFirebase = async () => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, using localStorage only');
    return [];
  }

  try {
    console.log('🔍 Querying Firestore collection:', FIREBASE_COLLECTION);
    const q = query(collection(db, FIREBASE_COLLECTION), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log('📦 Firestore query returned', querySnapshot.size, 'documents');
    
    const rsvps = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Document ID:', doc.id, 'Email:', data.email, 'Submitted:', data.submittedAt);
      rsvps.push({
        ...data,
        id: data.id || doc.id, // Prefer stored id, fallback to doc id
        submittedAt: data.submittedAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || null,
        firebaseId: doc.id // Store Firebase document ID separately
      });
    });
    
    return rsvps;
  } catch (error) {
    console.error('❌ Error loading RSVPs from Firebase:', error);
    console.error('Error code:', error.code, 'Message:', error.message);
    return [];
  }
};

// Merge RSVPs from localStorage and Firebase (Firebase is source of truth)
const mergeRSVPs = (localRSVPs, firebaseRSVPs) => {
  const merged = new Map();
  
  // Add local RSVPs first
  localRSVPs.forEach(rsvp => {
    merged.set(rsvp.email.toLowerCase(), rsvp);
  });
  
  // Override with Firebase data (source of truth)
  firebaseRSVPs.forEach(rsvp => {
    merged.set(rsvp.email.toLowerCase(), rsvp);
  });
  
  // Convert back to array, sorted by submission date (newest first)
  return Array.from(merged.values())
    .sort((a, b) => {
      const dateA = a.submittedAt instanceof Date ? a.submittedAt : new Date(a.submittedAt);
      const dateB = b.submittedAt instanceof Date ? b.submittedAt : new Date(b.submittedAt);
      return dateB - dateA;
    });
};

// Load RSVPs with Firebase sync (async version for admin panels)
export const loadRSVPsWithSync = async () => {
  // Try to load from Firebase first
  if (isFirebaseConfigured()) {
    try {
      console.log('🔄 Loading RSVPs from Firebase...');
      const firebaseRSVPs = await loadRSVPsFromFirebase();
      console.log('📊 Firebase returned:', firebaseRSVPs.length, 'RSVPs');
      
      if (firebaseRSVPs.length > 0) {
        // Log first RSVP for debugging
        console.log('📝 First Firebase RSVP:', {
          email: firebaseRSVPs[0].email,
          submittedAt: firebaseRSVPs[0].submittedAt,
          firebaseId: firebaseRSVPs[0].firebaseId
        });
        
        console.log('✓ Loaded', firebaseRSVPs.length, 'RSVPs from Firebase');
        // Merge with localStorage
        const localRSVPs = loadRSVPsFromLocalStorage();
        console.log('💾 localStorage had:', localRSVPs.length, 'RSVPs');
        
        const merged = mergeRSVPs(localRSVPs, firebaseRSVPs);
        console.log('🔀 Merged result:', merged.length, 'RSVPs');
        
        saveRSVPs(merged); // Save to localStorage as cache
        return merged;
      } else {
        console.warn('⚠️ Firebase returned 0 RSVPs, using localStorage');
      }
    } catch (err) {
      console.error('❌ Failed to load from Firebase:', err);
      console.error('Error details:', err.message, err.code);
    }
  } else {
    console.warn('⚠️ Firebase not configured, using localStorage only');
  }
  
  // Fallback to localStorage
  const localRSVPs = loadRSVPsFromLocalStorage();
  console.log('💾 Using localStorage:', localRSVPs.length, 'RSVPs');
  return localRSVPs;
};

// Migrate all localStorage RSVPs to Firebase (force overwrite mode)
export const migrateLocalStorageToFirebase = async (forceOverwrite = false) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const localRSVPs = loadRSVPsFromLocalStorage();
  console.log('🚀 Starting migration of', localRSVPs.length, 'RSVPs to Firebase');
  console.log('📋 Mode:', forceOverwrite ? 'FORCE OVERWRITE (will update existing)' : 'Skip existing');
  
  let successCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const rsvp of localRSVPs) {
    try {
      const emailKey = getEmailKey(rsvp);
      if (!emailKey) {
        console.warn('⏭️  Skipped (invalid data):', rsvp);
        skippedCount++;
        continue;
      }
      
      // Check if already exists in Firebase
      const q = query(
        collection(db, FIREBASE_COLLECTION), 
        where('email', '==', emailKey)
      );
      const querySnapshot = await getDocs(q);
      
      // Sanitize data for Firebase
      const sanitizedData = {
        id: rsvp.id || Date.now(),
        firstName: rsvp.firstName || '',
        lastName: rsvp.lastName || '',
        email: emailKey,
        phone: rsvp.phone || '',
        attendance: rsvp.attendance || 'no',
        language: rsvp.language || 'es',
        dietaryRestrictions: rsvp.dietaryRestrictions || '',
        needsWheelchairAccess: rsvp.needsWheelchairAccess === true,
        needsHearingAssistance: rsvp.needsHearingAssistance === true,
        needsVisualAssistance: rsvp.needsVisualAssistance === true,
        needsTransportation: rsvp.needsTransportation === true,
        needsAccommodation: rsvp.needsAccommodation === true,
        specialNotes: rsvp.specialNotes || '',
        approved: rsvp.approved === true,
        hasPlusOne: rsvp.hasPlusOne === true,
        plusOneFirstName: rsvp.plusOneFirstName || '',
        plusOneLastName: rsvp.plusOneLastName || '',
        submittedAt: rsvp.submittedAt ? Timestamp.fromDate(new Date(rsvp.submittedAt)) : Timestamp.now()
      };
      
      if (querySnapshot.empty) {
        // Create new document in Firebase
        await addDoc(collection(db, FIREBASE_COLLECTION), sanitizedData);
        successCount++;
        console.log('✓ Created:', rsvp.email);
      } else if (forceOverwrite) {
        // Update existing document
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...sanitizedData,
          updatedAt: Timestamp.now()
        });
        updatedCount++;
        console.log('✓ Updated:', rsvp.email);
      } else {
        skippedCount++;
        console.log('⏭️  Skipped (already exists):', rsvp.email);
      }
    } catch (error) {
      errorCount++;
      errors.push({ email: rsvp.email, error: error.message });
      console.error('❌ Error migrating:', rsvp.email, error);
    }
  }

  console.log('✅ Migration complete:', successCount, 'created,', updatedCount, 'updated,', skippedCount, 'skipped,', errorCount, 'errors');
  return { successCount, updatedCount, skippedCount, errorCount, errors };
};

// Load RSVPs from localStorage (with Firebase sync in background)
export const loadRSVPs = () => {
  // Sync from Firebase in background (non-blocking)
  if (isFirebaseConfigured()) {
    loadRSVPsFromFirebase()
      .then(firebaseRSVPs => {
        if (firebaseRSVPs.length > 0) {
          // Merge with localStorage - use Firebase as source of truth
          const localRSVPs = loadRSVPsFromLocalStorage();
          const merged = mergeRSVPs(localRSVPs, firebaseRSVPs);
          saveRSVPs(merged);
          console.log('✓ Synced', firebaseRSVPs.length, 'RSVPs from Firebase');
        }
      })
      .catch(err => console.warn('Background Firebase sync failed:', err));
  }
  
  // Return local data immediately (don't block UI)
  return loadRSVPsFromLocalStorage();
};

// Internal function to load from localStorage only
const loadRSVPsFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const rsvps = JSON.parse(stored);
      // Convert date strings back to Date objects safely
      const rsvpsWithDates = rsvps.map(rsvp => {
        try {
          return {
            ...rsvp,
            submittedAt: rsvp.submittedAt ? new Date(rsvp.submittedAt) : new Date(),
            updatedAt: rsvp.updatedAt ? new Date(rsvp.updatedAt) : null
          };
        } catch (e) {
          console.error('Error parsing date for RSVP:', e);
          return {
            ...rsvp,
            submittedAt: new Date(),
            updatedAt: null
          };
        }
      });
      
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
    const rsvpsForStorage = rsvps.map(rsvp => {
      try {
        return {
          ...rsvp,
          submittedAt: rsvp.submittedAt instanceof Date 
            ? rsvp.submittedAt.toISOString() 
            : (rsvp.submittedAt || new Date().toISOString()),
          updatedAt: rsvp.updatedAt instanceof Date 
            ? rsvp.updatedAt.toISOString() 
            : (rsvp.updatedAt || null)
        };
      } catch (e) {
        console.error('Error converting RSVP dates:', e);
        return {
          ...rsvp,
          submittedAt: new Date().toISOString(),
          updatedAt: null
        };
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvpsForStorage));
    return true;
  } catch (error) {
    console.error('Error saving RSVPs:', error);
    // Try to provide more context
    if (error.name === 'QuotaExceededError') {
      alert('Almacenamiento lleno. Por favor contacta al administrador.');
    }
    return false;
  }
};

// Save RSVP to Firebase
const saveRSVPToFirebase = async (rsvpData) => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    // Check if RSVP with same email exists
    const q = query(
      collection(db, FIREBASE_COLLECTION), 
      where('email', '==', rsvpData.email.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        ...rsvpData,
        updatedAt: Timestamp.now(),
        approved: false,
        previouslyApproved: querySnapshot.docs[0].data().approved || false
      });
      return { id: docRef.id, isUpdate: true };
    } else {
      // Create new - include the local id so we can match later
      const docRef = await addDoc(collection(db, FIREBASE_COLLECTION), {
        ...rsvpData,
        id: rsvpData.id, // Store local ID for reference
        email: rsvpData.email.toLowerCase(),
        submittedAt: Timestamp.now(),
        approved: false
      });
      return { id: docRef.id, isUpdate: false };
    }
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return null;
  }
};

// Add a new RSVP or update existing one if email matches (Hybrid: localStorage + Firebase)
export const addRSVP = async (rsvpData) => {
  const rsvps = loadRSVPs();
  
  // Validate email
  if (!rsvpData.email || typeof rsvpData.email !== 'string' || rsvpData.email.trim() === '') {
    throw new Error('Email is required');
  }
  
  // Check if an RSVP with the same email already exists
  const userEmail = rsvpData.email.toLowerCase().trim();
  const existingIndex = rsvps.findIndex(r => 
    r.email && typeof r.email === 'string' && r.email.toLowerCase().trim() === userEmail
  );
  
  let localResult;
  
  if (existingIndex !== -1) {
    // Update existing RSVP
    const existingRSVP = rsvps[existingIndex];
    const updatedRSVP = {
      ...existingRSVP,
      ...rsvpData,
      id: existingRSVP.id, // Keep the original ID
      submittedAt: existingRSVP.submittedAt, // Keep original submission time
      updatedAt: new Date(), // Track when it was updated
      approved: false, // Reset approval status so admin can review changes
      previouslyApproved: existingRSVP.approved // Track if it was previously approved
    };
    rsvps[existingIndex] = updatedRSVP;
    saveRSVPs(rsvps);
    localResult = { ...updatedRSVP, isUpdate: true };
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
    localResult = { ...rsvpWithMetadata, isUpdate: false };
  }
  
  // Try to sync to Firebase in background
  try {
    const firebaseResult = await saveRSVPToFirebase(rsvpData);
    if (firebaseResult) {
      console.log('✓ RSVP synced to Firebase');
    }
  } catch (error) {
    console.warn('Failed to sync to Firebase, saved locally only:', error);
  }
  
  return localResult;
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

// Toggle RSVP approval status - Hybrid: localStorage + Firebase
export const toggleRSVPApproval = async (rsvpId) => {
  const rsvps = loadRSVPsFromLocalStorage();
  const updatedRSVPs = rsvps.map(rsvp => {
    if (rsvp.id === rsvpId) {
      return { ...rsvp, approved: !rsvp.approved };
    }
    return rsvp;
  });
  saveRSVPs(updatedRSVPs);
  
  // Sync to Firebase by email
  const updatedRSVP = updatedRSVPs.find(r => r.id === rsvpId);
  if (updatedRSVP && isFirebaseConfigured()) {
    try {
      const emailKey = (updatedRSVP.email && updatedRSVP.email.trim() !== '' && !updatedRSVP.email.includes('@placeholder.com')) 
        ? updatedRSVP.email.toLowerCase()
        : `no-email-${updatedRSVP.firstName.toLowerCase()}-${updatedRSVP.lastName.toLowerCase()}-${updatedRSVP.id}@placeholder.com`;
      
      const q = query(collection(db, FIREBASE_COLLECTION), where('email', '==', emailKey));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { approved: updatedRSVP.approved });
        console.log('✓ Approval status synced to Firebase:', emailKey);
      }
    } catch (error) {
      console.warn('Failed to sync approval to Firebase:', error);
    }
  }
  
  return updatedRSVPs;
};

// Update RSVP in Firebase by firebaseId
const updateRSVPInFirebase = async (firebaseId, updates) => {
  if (!isFirebaseConfigured() || !firebaseId) {
    return false;
  }
  
  try {
    const docRef = doc(db, FIREBASE_COLLECTION, firebaseId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating Firebase document:', error);
    return false;
  }
};

// Update RSVP data (for manual edits) - Hybrid: localStorage + Firebase
export const updateRSVP = async (rsvpId, updates) => {
  const rsvps = loadRSVPs();
  const updatedRSVPs = rsvps.map(rsvp => {
    if (rsvp.id === rsvpId) {
      return { ...rsvp, ...updates };
    }
    return rsvp;
  });
  saveRSVPs(updatedRSVPs);
  
  // Sync to Firebase by email
  const updatedRSVP = updatedRSVPs.find(r => r.id === rsvpId);
  if (updatedRSVP && isFirebaseConfigured()) {
    try {
      const emailKey = (updatedRSVP.email && updatedRSVP.email.trim() !== '' && !updatedRSVP.email.includes('@placeholder.com')) 
        ? updatedRSVP.email.toLowerCase()
        : `no-email-${updatedRSVP.firstName.toLowerCase()}-${updatedRSVP.lastName.toLowerCase()}-${updatedRSVP.id}@placeholder.com`;
      
      const q = query(collection(db, FIREBASE_COLLECTION), where('email', '==', emailKey));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, updates);
        console.log('✓ RSVP updated in Firebase:', emailKey);
      }
    } catch (error) {
      console.warn('Failed to update in Firebase:', error);
    }
  }
  
  return updatedRSVPs;
};

// Delete RSVP from Firebase
const deleteRSVPFromFirebase = async (firebaseId) => {
  if (!isFirebaseConfigured() || !firebaseId) {
    return false;
  }
  
  try {
    const docRef = doc(db, FIREBASE_COLLECTION, firebaseId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting from Firebase:', error);
    return false;
  }
};

// Delete a specific RSVP - Hybrid: localStorage + Firebase
export const deleteRSVP = async (rsvpId) => {
  const rsvps = loadRSVPs();
  const rsvpToDelete = rsvps.find(r => r.id === rsvpId);
  
  const updatedRSVPs = rsvps.filter(rsvp => rsvp.id !== rsvpId);
  saveRSVPs(updatedRSVPs);
  
  // Delete from Firebase by email
  if (rsvpToDelete && isFirebaseConfigured()) {
    try {
      const emailKey = getEmailKey(rsvpToDelete);
      if (!emailKey) {
        console.warn('Cannot delete from Firebase: invalid email key');
        return updatedRSVPs;
      }
      
      const q = query(collection(db, FIREBASE_COLLECTION), where('email', '==', emailKey));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await deleteDoc(docRef);
        console.log('✓ RSVP deleted from Firebase:', emailKey);
      }
    } catch (error) {
      console.warn('Failed to delete from Firebase:', error);
    }
  }
  
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

    return { 
      success: true, 
      count: newRSVPs.length, 
      updated: updatedCount, 
      added: addedCount,
      rsvps: mergedRSVPs // Return the merged data for Firebase sync
    };
  } catch (error) {
    console.error('Error importing CSV:', error);
    return { success: false, error: error.message };
  }
};

// Import RSVPs from CSV and sync to Firebase
export const importRSVPsFromCSVWithFirebase = async (csvContent) => {
  // First import to localStorage
  const result = importRSVPsFromCSV(csvContent);
  
  if (!result.success) {
    return result;
  }

  // If Firebase is configured, sync all RSVPs
  if (isFirebaseConfigured()) {
    console.log('🔄 Syncing', result.rsvps.length, 'imported RSVPs to Firebase...');
    
    let firebaseSuccessCount = 0;
    let firebaseErrorCount = 0;
    const errors = [];
    
    // Process in smaller batches to avoid rate limits
    const batchSize = 10;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (let i = 0; i < result.rsvps.length; i++) {
      const rsvp = result.rsvps[i];
      
      try {
        const emailKey = getEmailKey(rsvp);
        if (!emailKey) {
          console.warn(`⏭️  [${i + 1}/${result.rsvps.length}] Skipped (invalid data):`, rsvp);
          continue;
        }
        
        console.log(`[${i + 1}/${result.rsvps.length}] Processing:`, emailKey);
        
        // Check if exists in Firebase
        const q = query(
          collection(db, FIREBASE_COLLECTION), 
          where('email', '==', emailKey)
        );
        const querySnapshot = await getDocs(q);
        
        // Sanitize data for Firebase (remove undefined, convert dates properly)
        const sanitizedData = {
          id: rsvp.id || Date.now(),
          firstName: rsvp.firstName || '',
          lastName: rsvp.lastName || '',
          email: emailKey,
          phone: rsvp.phone || '',
          attendance: rsvp.attendance || 'no',
          language: rsvp.language || 'es',
          dietaryRestrictions: rsvp.dietaryRestrictions || '',
          needsWheelchairAccess: rsvp.needsWheelchairAccess === true,
          needsHearingAssistance: rsvp.needsHearingAssistance === true,
          needsVisualAssistance: rsvp.needsVisualAssistance === true,
          needsTransportation: rsvp.needsTransportation === true,
          needsAccommodation: rsvp.needsAccommodation === true,
          specialNotes: rsvp.specialNotes || '',
          approved: rsvp.approved === true,
          hasPlusOne: rsvp.hasPlusOne === true,
          plusOneFirstName: rsvp.plusOneFirstName || '',
          plusOneLastName: rsvp.plusOneLastName || '',
          submittedAt: rsvp.submittedAt ? Timestamp.fromDate(new Date(rsvp.submittedAt)) : Timestamp.now()
        };
        
        if (querySnapshot.empty) {
          // Create new
          await addDoc(collection(db, FIREBASE_COLLECTION), sanitizedData);
          console.log('✓ Created:', rsvp.email);
          firebaseSuccessCount++;
        } else {
          // Update existing
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            ...sanitizedData,
            updatedAt: Timestamp.now()
          });
          console.log('✓ Updated:', rsvp.email);
          firebaseSuccessCount++;
        }
        
        // Add delay every batch to avoid rate limits
        if ((i + 1) % batchSize === 0) {
          console.log(`⏸️  Pausing after ${i + 1} records...`);
          await delay(1000); // 1 second pause every 10 records
        }
        
      } catch (error) {
        console.error('❌ Error syncing:', rsvp.email, error.message);
        errors.push({ email: rsvp.email, error: error.message });
        firebaseErrorCount++;
      }
    }
    
    console.log(`✅ Firebase sync complete: ${firebaseSuccessCount} synced, ${firebaseErrorCount} errors`);
    if (errors.length > 0) {
      console.error('Errors details:', errors);
    }
    
    return {
      ...result,
      firebaseSynced: firebaseSuccessCount,
      firebaseErrors: firebaseErrorCount,
      errors: errors
    };
  }
  
  return result;
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
