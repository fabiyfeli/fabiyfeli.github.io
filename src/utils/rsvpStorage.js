// RSVP Storage Utilities - SIMPLIFIED VERSION
// Direct Firebase operations, no sync complexity
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc,
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';

const FIREBASE_COLLECTION = 'rsvps';
const RSVP_PASSWORD = 'FabiYFeli2026';
const AUTH_KEY = 'wedding_rsvp_auth';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  try {
    return db && db !== undefined;
  } catch {
    return false;
  }
};

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const checkAuth = (password) => {
  return password === RSVP_PASSWORD;
};

export const isAuthenticated = () => {
  const auth = localStorage.getItem(AUTH_KEY);
  return auth === 'true';
};

export const setAuthSession = (isAuthenticated) => {
  if (isAuthenticated) {
    localStorage.setItem(AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

// ============================================================================
// LOCAL STORAGE OPERATIONS (for backwards compatibility)
// ============================================================================

const STORAGE_KEY = 'wedding_rsvp_responses';

// Load RSVPs from localStorage
export const loadRSVPs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading RSVPs from localStorage:', error);
    return [];
  }
};

// Save RSVPs to localStorage
export const saveRSVPs = (rsvps) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvps));
    return true;
  } catch (error) {
    console.error('Error saving RSVPs to localStorage:', error);
    return false;
  }
};

// Add a new RSVP
export const addRSVP = async (rsvpData) => {
  try {
    if (!isFirebaseConfigured()) {
      // Save locally only
      const rsvps = loadRSVPs();
      const newRsvp = {
        id: Date.now().toString(),
        ...rsvpData,
        createdAt: new Date().toISOString()
      };
      rsvps.push(newRsvp);
      saveRSVPs(rsvps);
      return newRsvp;
    }
    
    // Save to Firebase first
    const docRef = await addDoc(collection(db, FIREBASE_COLLECTION), {
      ...rsvpData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Also save to localStorage
    const rsvps = loadRSVPs();
    const newRsvp = {
      id: docRef.id,
      ...rsvpData,
      createdAt: new Date().toISOString()
    };
    rsvps.push(newRsvp);
    saveRSVPs(rsvps);
    
    console.log('✅ RSVP added to Firebase and localStorage:', docRef.id);
    return newRsvp;
  } catch (error) {
    console.error('Error adding RSVP:', error);
    throw error;
  }
};

// Get RSVP statistics
export const getRSVPStats = () => {
  const rsvps = loadRSVPs();
  return {
    totalResponses: rsvps.length,
    attending: rsvps.filter(r => r.attendance === 'yes').length,
    notAttendingApproved: rsvps.filter(r => r.attendance === 'no' && r.approved === true).length,
    notAttendingPending: rsvps.filter(r => r.attendance === 'no' && r.approved !== true).length,
    notAttendingTotal: rsvps.filter(r => r.attendance === 'no').length,
    pending: rsvps.filter(r => r.attendance !== 'yes' && r.attendance !== 'no').length,
    approvedToAttend: rsvps.filter(r => r.attendance === 'yes' && r.approved === true).length,
    unapprovedToAttend: rsvps.filter(r => r.attendance === 'yes' && r.approved !== true).length
  };
};

// ============================================================================
// AUTHENTICATION
// ============================================================================

// ============================================================================
// LOAD DATA FROM FIREBASE
// ============================================================================

// Helper to convert Firestore Timestamp to Date
const convertTimestamp = (timestamp) => {
  if (!timestamp) return null;
  
  // If it's a Firestore Timestamp object
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // If it's already a Date
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If it's a string or number, try to parse it
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  return null;
};

// Load all RSVPs directly from Firebase as-is
export const loadAllRSVPsFromFirebase = async () => {
  try {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured');
      return [];
    }
    
    const snapshot = await getDocs(collection(db, FIREBASE_COLLECTION));
    const rsvps = [];
    
    snapshot.forEach(doc => {
      // Get the data from the document
      const data = doc.data();
      
      // Convert Firestore timestamps to JavaScript Dates
      const convertedData = {
        ...data,
        id: doc.id,  // This MUST be the Firestore Document ID
        submittedAt: convertTimestamp(data.submittedAt),
        updatedAt: convertTimestamp(data.updatedAt)
      };
      
      rsvps.push(convertedData);
    });
    
    console.log(`✅ Loaded ${rsvps.length} RSVPs from Firebase`);
    return rsvps;
  } catch (error) {
    console.error('Error loading RSVPs from Firebase:', error);
    return [];
  }
};

// ============================================================================
// UPDATE DATA IN FIREBASE
// ============================================================================

// Update RSVP directly in Firebase
export const updateRSVPInFirebase = async (docId, updates) => {
  try {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase not configured');
    }
    
    console.log(`[updateRSVPInFirebase] Starting update`);
    console.log(`[updateRSVPInFirebase] docId:`, docId);
    console.log(`[updateRSVPInFirebase] updates:`, updates);
    
    if (!docId) {
      throw new Error('No docId provided');
    }
    
    const docRef = doc(db, FIREBASE_COLLECTION, docId);
    console.log(`[updateRSVPInFirebase] docRef created:`, docRef.path);
    
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    console.log(`[updateRSVPInFirebase] updateData:`, updateData);
    
    await updateDoc(docRef, updateData);
    
    console.log(`✅ [updateRSVPInFirebase] Successfully updated RSVP ${docId}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ [updateRSVPInFirebase] Error:`, error);
    console.error(`[updateRSVPInFirebase] Error code:`, error.code);
    console.error(`[updateRSVPInFirebase] Error message:`, error.message);
    return { error: error.message };
  }
};

// ============================================================================
// DELETE DATA FROM FIREBASE
// ============================================================================

// Delete RSVP directly from Firebase
export const deleteRSVPFromFirebase = async (docId) => {
  try {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase not configured');
    }
    
    const docRef = doc(db, FIREBASE_COLLECTION, docId);
    await deleteDoc(docRef);
    
    console.log(`✅ Deleted RSVP ${docId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    return { error: error.message };
  }
};

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export const clearAllRSVPs = async () => {
  const allRSVPs = await loadAllRSVPsFromFirebase();
  let deletedCount = 0;
  let errorCount = 0;
  
  for (const rsvp of allRSVPs) {
    const result = await deleteRSVPFromFirebase(rsvp.id);
    if (result.success) {
      deletedCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log(`✅ Deleted ${deletedCount} RSVPs${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
  return { deletedCount, errorCount };
};

export const exportRSVPs = () => {
  const rsvps = JSON.parse(localStorage.getItem('wedding_rsvp_responses') || '[]');
  
  if (rsvps.length === 0) {
    alert('No hay RSVPs para exportar');
    return;
  }
  
  const csv = convertToCSV(rsvps);
  downloadCSV(csv, 'rsvps.csv');
};

const convertToCSV = (rsvps) => {
  if (!rsvps || rsvps.length === 0) return '';
  
  const headers = Object.keys(rsvps[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = rsvps.map(rsvp => {
    return headers.map(header => {
      const value = rsvp[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
