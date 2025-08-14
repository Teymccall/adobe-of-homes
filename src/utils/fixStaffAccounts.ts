import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';

// Utility to fix existing staff accounts that were created with wrong structure
export const fixExistingStaffAccounts = async () => {
  console.log('🔧 Starting to fix existing staff accounts...');
  
  try {
    // Get all staff accounts
    const staffRef = collection(db, 'users');
    const q = query(staffRef, where('role', 'in', ['admin', 'staff', 'moderator']));
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.size} staff accounts to check...`);
    
    let fixedCount = 0;
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const needsFix = !data.updatedAt || data.department || data.permissions;
      
      if (needsFix) {
        console.log(`Fixing account: ${data.email}`);
        
        const updates: any = {
          updatedAt: serverTimestamp(),
        };
        
        // Map department to company if it exists
        if (data.department && !data.company) {
          updates.company = data.department;
          updates.department = null; // Remove old field
        }
        
        // Map permissions to skills if it exists
        if (data.permissions && !data.skills) {
          updates.skills = data.permissions;
          updates.permissions = null; // Remove old field
        }
        
        // Update the document
        updateDoc(doc(db, 'users', docSnapshot.id), updates)
          .then(() => {
            console.log(`✅ Fixed account: ${data.email}`);
            fixedCount++;
          })
          .catch((error) => {
            console.error(`❌ Error fixing account ${data.email}:`, error);
          });
      } else {
        console.log(`✅ Account ${data.email} is already correct`);
      }
    });
    
    console.log(`🎉 Fixed ${fixedCount} staff accounts!`);
    console.log('Please refresh the page to see the updated data.');
    
  } catch (error) {
    console.error('❌ Error fixing staff accounts:', error);
  }
};

// Function to check staff account structure
export const checkStaffAccountStructure = async () => {
  console.log('🔍 Checking staff account structure...');
  
  try {
    const staffRef = collection(db, 'users');
    const q = query(staffRef, where('role', 'in', ['admin', 'staff', 'moderator']));
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.size} staff accounts:`);
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      console.log(`\n📋 Account: ${data.email}`);
      console.log(`   - Has updatedAt: ${!!data.updatedAt}`);
      console.log(`   - Has company: ${!!data.company}`);
      console.log(`   - Has skills: ${!!data.skills}`);
      console.log(`   - Has department: ${!!data.department}`);
      console.log(`   - Has permissions: ${!!data.permissions}`);
      console.log(`   - Document ID: ${docSnapshot.id}`);
      console.log(`   - User UID: ${data.uid}`);
      console.log(`   - ID matches UID: ${docSnapshot.id === data.uid}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking staff accounts:', error);
  }
};

// Function to check for orphaned or duplicate staff accounts
export const checkForOrphanedStaffAccounts = async () => {
  console.log('🔍 Checking for orphaned staff accounts...');
  
  try {
    const staffRef = collection(db, 'users');
    const q = query(staffRef, where('role', 'in', ['admin', 'staff', 'moderator']));
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.size} staff documents in Firestore`);
    
    const emailCounts: { [email: string]: number } = {};
    const uidCounts: { [uid: string]: number } = {};
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const email = data.email;
      const uid = data.uid;
      
      emailCounts[email] = (emailCounts[email] || 0) + 1;
      uidCounts[uid] = (uidCounts[uid] || 0) + 1;
      
      console.log(`📋 Document ${docSnapshot.id}:`);
      console.log(`   - Email: ${email}`);
      console.log(`   - UID: ${uid}`);
      console.log(`   - Document ID: ${docSnapshot.id}`);
      console.log(`   - ID matches UID: ${docSnapshot.id === uid}`);
    });
    
    // Check for duplicates
    const duplicateEmails = Object.entries(emailCounts).filter(([email, count]) => count > 1);
    const duplicateUids = Object.entries(uidCounts).filter(([uid, count]) => count > 1);
    
    if (duplicateEmails.length > 0) {
      console.log('⚠️ Found duplicate emails:', duplicateEmails);
    }
    
    if (duplicateUids.length > 0) {
      console.log('⚠️ Found duplicate UIDs:', duplicateUids);
    }
    
    if (duplicateEmails.length === 0 && duplicateUids.length === 0) {
      console.log('✅ No duplicate accounts found');
    }
    
  } catch (error) {
    console.error('❌ Error checking for orphaned accounts:', error);
  }
}; 