import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const createAdminAccount = async () => {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Test Firebase Auth connection
    const testUser = await createUserWithEmailAndPassword(
      auth,
      'teymccall@gmail.com',
      'Admin123!@#'
    );
    
    console.log('✅ Firebase Auth working! User created:', testUser.user.uid);
    
    // Update display name
    await updateProfile(testUser.user, {
      displayName: 'Super Admin'
    });
    
    // Create admin profile in Firestore
    const adminProfile = {
      uid: testUser.user.uid,
      email: 'teymccall@gmail.com',
      displayName: 'Super Admin',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: true,
      verificationDate: new Date()
    };
    
    await setDoc(doc(db, 'users', testUser.user.uid), adminProfile);
    
    console.log('✅ Admin profile created in Firestore!');
    console.log('🎉 Admin account created successfully!');
    console.log('📧 Email: teymccall@gmail.com');
    console.log('🔑 Password: Admin123!@#');
    console.log('👤 Role: admin');
    
    return testUser.user;
  } catch (error: any) {
    console.error('❌ Error creating admin account:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ User already exists. Trying to sign in...');
      return null;
    }
    
    throw error;
  }
};

// Run the script
createAdminAccount()
  .then((user) => {
    if (user) {
      console.log('✅ Script completed successfully!');
    } else {
      console.log('ℹ️ User already exists. You can now login.');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }); 