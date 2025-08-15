import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { auth, db, firebaseConfig } from "@/lib/firebase";

export type UserRole = 'home_owner' | 'artisan' | 'admin' | 'staff' | 'estate_manager' | 'tenant';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'suspended';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  phone?: string;
  location?: string;
  region?: string;
  bio?: string;
  company?: string;
  yearsOfExperience?: number;
  skills?: string[];
  idType?: string;
  idNumber?: string;
  idImageUrl?: string;
  isVerified?: boolean;
  verificationDate?: Date;
}

class AuthService {
  // Sign up with role
  async signUp(email: string, password: string, displayName: string, role: UserRole, additionalData?: Partial<UserProfile>) {
    try {
      console.log('[Auth] signUp init', { email, displayName, role });
      console.log('[Auth] using project', firebaseConfig.projectId, 'authDomain', firebaseConfig.authDomain);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role,
        status: role === 'admin' ? 'active' : 'pending', // Admin is auto-approved
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        ...additionalData
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      return { user, profile: userProfile };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in
  async signIn(email: string, password: string) {
    try {
      console.log('🔐 Attempting to sign in with:', email);
      console.log('[Auth] projectId:', firebaseConfig.projectId);
      console.log('[Auth] authDomain:', firebaseConfig.authDomain);
      console.log('[Auth] apiKey prefix:', firebaseConfig.apiKey?.slice(0, 6));
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Firebase Auth successful, user ID:', user.uid);
      
      // Get user profile
      console.log('📋 Fetching user profile...');
      let profile = await this.getUserProfile(user.uid);
      
      if (profile) {
        console.log('✅ User profile found:', profile.role, profile.status);
      } else {
        console.log('⚠️ No user profile found in Firestore - creating default profile');
        // Create a default profile if none exists
        profile = await this.createDefaultProfile(user);
      }
      
      return { user, profile };
    } catch (error: any) {
      console.error('❌ Error signing in:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide more specific error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address. Please create an account first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Helper method to safely convert Firebase timestamps to Date objects
  private safeToDate(timestamp: any): Date | null {
    if (!timestamp) return null;
    try {
      return timestamp.toDate();
    } catch (error) {
      console.warn('Failed to convert timestamp to date:', error);
      return null;
    }
  }

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        return {
          ...data,
          createdAt: this.safeToDate(data.createdAt) || new Date(),
          updatedAt: this.safeToDate(data.updatedAt) || new Date(),
          verificationDate: this.safeToDate(data.verificationDate)
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Create default profile for existing users
  private async createDefaultProfile(user: User): Promise<UserProfile> {
    try {
      console.log('🔧 Creating default profile for user:', user.uid);
      
      const defaultProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        role: 'home_owner', // Default role
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false
      };
      
      await setDoc(doc(db, 'users', user.uid), defaultProfile);
      console.log('✅ Default profile created successfully');
      
      return defaultProfile;
    } catch (error) {
      console.error('❌ Error creating default profile:', error);
      throw new Error('Failed to create user profile. Please try again.');
    }
  }

  // Check if user has role
  async checkUserRole(uid: string, allowedRoles: UserRole[]): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(uid);
      return profile ? allowedRoles.includes(profile.role) : false;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  // Approve user application
  async approveUser(uid: string) {
    try {
      await this.updateUserProfile(uid, {
        status: 'approved',
        isVerified: true,
        verificationDate: new Date()
      });
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  }

  // Reject user application
  async rejectUser(uid: string) {
    try {
      await this.updateUserProfile(uid, {
        status: 'rejected'
      });
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  }

  // Get verified home owners
  async getVerifiedHomeOwners(): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'home_owner'),
        where('isVerified', '==', true),
        where('status', '==', 'approved')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: this.safeToDate(data.createdAt) || new Date(),
          updatedAt: this.safeToDate(data.updatedAt) || new Date(),
          verificationDate: this.safeToDate(data.verificationDate)
        } as UserProfile;
      });
    } catch (error) {
      console.error('Error getting verified home owners:', error);
      throw error;
    }
  }

  // Get all home owners (verified and unverified)
  async getAllHomeOwners(): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'home_owner')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: this.safeToDate(data.createdAt) || new Date(),
          updatedAt: this.safeToDate(data.updatedAt) || new Date(),
          verificationDate: this.safeToDate(data.verificationDate)
        } as UserProfile;
      });
    } catch (error) {
      console.error('Error getting all home owners:', error);
      throw error;
    }
  }

  // Get all artisans
  async getAllArtisans(): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'artisan')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: this.safeToDate(data.createdAt) || new Date(),
          updatedAt: this.safeToDate(data.updatedAt) || new Date(),
          verificationDate: this.safeToDate(data.verificationDate)
        } as UserProfile;
      });
    } catch (error) {
      console.error('Error getting all artisans:', error);
      throw error;
    }
  }

  // Submit home owner application
  async submitHomeOwnerApplication(applicationData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    region: string;
    idType: string;
    idNumber: string;
    about: string;
    profileImageUrl?: string;
    idImageUrl?: string;
    profileImagePublicId?: string;
    idImagePublicId?: string;
  }): Promise<string> {
    try {
      // For application forms, we allow unauthenticated submissions
      // The applicantId will be null until they're approved and create an account
      const currentUser = auth.currentUser;

      const application = {
        ...applicationData,
        applicantId: currentUser?.uid || null, // Can be null for new applications
        status: 'pending' as const,
        submittedDate: new Date().toISOString(),
        priority: 'medium',
        reviewedBy: null,
        reviewNotes: null,
        lastUpdated: new Date().toISOString(),
        // Store Cloudinary metadata for future reference
        cloudinaryData: {
          profileImage: {
            url: applicationData.profileImageUrl,
            publicId: applicationData.profileImagePublicId
          },
          idImage: {
            url: applicationData.idImageUrl,
            publicId: applicationData.idImagePublicId
          }
        }
      };

      console.log('Submitting application:', application);
      const docRef = await addDoc(collection(db, 'homeOwnerApplications'), application);
      console.log('Application submitted successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting home owner application:', error);
      throw error;
    }
  }

  // Submit artisan application
  async submitArtisanApplication(applicationData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    skills: string[];
    about: string;
    profileImageUrl?: string;
    idImageUrl?: string;
  }): Promise<string> {
    try {
      // Get current authenticated user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User must be authenticated to submit an application');
      }

      const application = {
        ...applicationData,
        applicantId: currentUser.uid,
        status: 'pending' as const,
        submittedDate: new Date().toISOString(),
        priority: 'medium',
        reviewedBy: null,
        reviewNotes: null,
        lastUpdated: new Date().toISOString()
      };

      console.log('Submitting artisan application:', application);
      const docRef = await addDoc(collection(db, 'artisanApplications'), application);
      console.log('Artisan application submitted successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting artisan application:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService; 