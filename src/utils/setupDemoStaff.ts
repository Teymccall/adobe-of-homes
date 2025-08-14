import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

interface DemoStaffAccount {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'staff' | 'moderator';
  department: string;
  phone: string;
  location: string;
  permissions: string[];
}

const demoStaffAccounts: DemoStaffAccount[] = [
  {
    email: 'staff@ghanahomes.com',
    password: 'staff123',
    displayName: 'John Staff',
    role: 'staff',
    department: 'Customer Support',
    phone: '+233 24 123 4567',
    location: 'Accra, Ghana',
    permissions: ['user_management', 'reports']
  },
  {
    email: 'moderator@ghanahomes.com',
    password: 'moderator123',
    displayName: 'Sarah Moderator',
    role: 'moderator',
    department: 'Content Management',
    phone: '+233 24 234 5678',
    location: 'Kumasi, Ghana',
    permissions: ['property_verification', 'user_management', 'reports']
  },
  {
    email: 'admin@ghanahomes.com',
    password: 'admin123',
    displayName: 'Michael Admin',
    role: 'admin',
    department: 'System Administration',
    phone: '+233 24 345 6789',
    location: 'Accra, Ghana',
    permissions: ['property_verification', 'estate_management', 'reports', 'user_management', 'system_settings']
  }
];

export const setupDemoStaff = async () => {
  console.log('Setting up demo staff accounts...');
  
  for (const account of demoStaffAccounts) {
    try {
      // Check if user already exists
      console.log(`Creating account for ${account.email}...`);
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        account.email, 
        account.password
      );
      
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, {
        displayName: account.displayName
      });
      
      // Create staff profile in Firestore
      const staffData = {
        uid: user.uid,
        email: account.email,
        displayName: account.displayName,
        phone: account.phone,
        location: account.location,
        role: account.role,
        department: account.department,
        status: 'active',
        permissions: account.permissions,
        bio: `Demo ${account.role} account for testing`,
        isVerified: true,
        createdAt: serverTimestamp(),
        createdBy: 'demo-setup',
      };
      
      await addDoc(collection(db, 'users'), staffData);
      
      console.log(`✅ Successfully created account for ${account.email}`);
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ Account ${account.email} already exists, skipping...`);
      } else {
        console.error(`❌ Error creating account for ${account.email}:`, error);
      }
    }
  }
  
  console.log('Demo staff setup complete!');
  console.log('\n📋 Demo Staff Accounts:');
  demoStaffAccounts.forEach(account => {
    console.log(`Email: ${account.email}`);
    console.log(`Password: ${account.password}`);
    console.log(`Role: ${account.role}`);
    console.log('---');
  });
};

// Function to reset passwords for existing accounts
export const resetDemoStaffPasswords = async () => {
  console.log('Resetting passwords for demo staff accounts...');
  
  for (const account of demoStaffAccounts) {
    try {
      await sendPasswordResetEmail(auth, account.email);
      console.log(`✅ Password reset email sent to ${account.email}`);
    } catch (error: any) {
      console.error(`❌ Error sending password reset to ${account.email}:`, error);
    }
  }
  
  console.log('Password reset process complete!');
}; 