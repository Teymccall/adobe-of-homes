import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user profile
      const profile = await this.getUserProfile(user.uid);
      return { user, profile };
    } catch (error) {
      console.error('Error signing in:', error);
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

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          verificationDate: data.verificationDate?.toDate()
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
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          verificationDate: data.verificationDate?.toDate()
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
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          verificationDate: data.verificationDate?.toDate()
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
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          verificationDate: data.verificationDate?.toDate()
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
  }): Promise<string> {
    try {
      const application = {
        ...applicationData,
        status: 'pending' as const,
        submittedDate: new Date().toISOString(),
        priority: 'medium',
        reviewedBy: null,
        reviewNotes: null,
        lastUpdated: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'homeOwnerApplications'), application);
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
      const application = {
        ...applicationData,
        status: 'pending' as const,
        submittedDate: new Date().toISOString(),
        priority: 'medium',
        reviewedBy: null,
        reviewNotes: null,
        lastUpdated: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'artisanApplications'), application);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting artisan application:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService; 