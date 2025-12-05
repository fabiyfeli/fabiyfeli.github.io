// Test Firebase Connection
// Run this in the browser console to verify Firebase setup

import { db } from './src/config/firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function testFirebaseConnection() {
  console.log('🧪 Testing Firebase Connection...\n');
  
  try {
    // Test 1: Check if Firebase is configured
    console.log('✓ Step 1: Firebase imported successfully');
    console.log('  Database:', db ? 'Connected' : 'Not configured');
    
    if (!db) {
      throw new Error('Firebase not configured. Update src/config/firebase.js with your credentials.');
    }
    
    // Test 2: Write to Firestore
    console.log('\n✓ Step 2: Attempting to write test document...');
    const testData = {
      test: true,
      message: 'Firebase connection test',
      timestamp: new Date(),
      randomId: Math.random().toString(36).substring(7)
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('  ✅ Write successful! Document ID:', docRef.id);
    
    // Test 3: Read from Firestore
    console.log('\n✓ Step 3: Attempting to read test documents...');
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('  ✅ Read successful! Found', querySnapshot.size, 'document(s)');
    
    querySnapshot.forEach((doc) => {
      console.log('  -', doc.id, '=>', doc.data());
    });
    
    // Test 4: Delete test document
    console.log('\n✓ Step 4: Cleaning up test document...');
    await deleteDoc(doc(db, 'test', docRef.id));
    console.log('  ✅ Delete successful!');
    
    // Final result
    console.log('\n🎉 SUCCESS! Firebase is configured correctly.');
    console.log('\nNext steps:');
    console.log('1. Configure Firestore security rules (see FIREBASE_SETUP.md)');
    console.log('2. Test RSVP submission');
    console.log('3. Check Firebase Console for data');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nCommon issues:');
    console.error('- Missing credentials in src/config/firebase.js');
    console.error('- Incorrect Firestore security rules');
    console.error('- Network/firewall blocking Firebase');
    console.error('\nSee FIREBASE_SETUP.md for troubleshooting.');
    return false;
  }
}

// Run test
testFirebaseConnection();

export { testFirebaseConnection };
