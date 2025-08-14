import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  updateDoc,
  getDoc,
  deleteDoc,
  addDoc,
  setDoc
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail
} from "firebase/auth";
import { db, auth } from "@/lib/firebase";

// Admin Dashboard Statistics Interface
export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  pendingApplications: number;
  monthlyRevenue: number;
  verificationRequests: number;
  activeListings: number;
  approvedAgents: number;
  totalArtisans: number;
  systemHealth: {
    userEngagement: number;
    systemUptime: number;
    responseTime: number;
    errorRate: number;
  };
}

// Pending Item Interface
export interface PendingItem {
  id: string;
  type: 'home_owner' | 'artisan' | 'property' | 'verification';
  title: string;
  subtitle: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  status: string;
}

class AdminService {
  // Get admin dashboard statistics
  async getAdminStats(): Promise<AdminStats> {
    try {
      // Get total users
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;

      // Get total properties
      const propertiesQuery = query(collection(db, 'properties'));
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const totalProperties = propertiesSnapshot.size;

      // Get pending applications
      const homeOwnerAppsQuery = query(
        collection(db, 'homeOwnerApplications'),
        where('status', '==', 'pending')
      );
      const homeOwnerAppsSnapshot = await getDocs(homeOwnerAppsQuery);
      const pendingHomeOwnerApps = homeOwnerAppsSnapshot.size;

      const artisanAppsQuery = query(
        collection(db, 'artisanApplications'),
        where('status', '==', 'pending')
      );
      const artisanAppsSnapshot = await getDocs(artisanAppsQuery);
      const pendingArtisanApps = artisanAppsSnapshot.size;

      // Get verification requests
      const verificationQuery = query(
        collection(db, 'properties'),
        where('isVerified', '==', false)
      );
      const verificationSnapshot = await getDocs(verificationQuery);
      const verificationRequests = verificationSnapshot.size;

      // Get active listings
      const activeListingsQuery = query(
        collection(db, 'properties'),
        where('isVerified', '==', true),
        where('availability', '==', 'available')
      );
      const activeListingsSnapshot = await getDocs(activeListingsQuery);
      const activeListings = activeListingsSnapshot.size;

      // Get approved agents
      const approvedAgentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'home_owner'),
        where('isVerified', '==', true)
      );
      const approvedAgentsSnapshot = await getDocs(approvedAgentsQuery);
      const approvedAgents = approvedAgentsSnapshot.size;

      // Get total artisans
      const artisansQuery = query(
        collection(db, 'users'),
        where('role', '==', 'artisan')
      );
      const artisansSnapshot = await getDocs(artisansQuery);
      const totalArtisans = artisansSnapshot.size;

      // Placeholder for monthly revenue
      const monthlyRevenue = 45200;

      // System health metrics
      const systemHealth = {
        userEngagement: 87,
        systemUptime: 99.9,
        responseTime: 85,
        errorRate: 0.1
      };

      return {
        totalUsers,
        totalProperties,
        pendingApplications: pendingHomeOwnerApps + pendingArtisanApps,
        monthlyRevenue,
        verificationRequests,
        activeListings,
        approvedAgents,
        totalArtisans,
        systemHealth
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  // Get pending items
  async getPendingItems(): Promise<PendingItem[]> {
    try {
      const pendingItems: PendingItem[] = [];

      // Get pending home owner applications
      const homeOwnerAppsQuery = query(
        collection(db, 'homeOwnerApplications'),
        where('status', '==', 'pending'),
        orderBy('submittedDate', 'desc'),
        limit(5)
      );
      const homeOwnerAppsSnapshot = await getDocs(homeOwnerAppsQuery);
      
      homeOwnerAppsSnapshot.forEach((doc) => {
        const data = doc.data();
        pendingItems.push({
          id: doc.id,
          type: 'home_owner',
          title: `${data.name} - Home Owner Application`,
          subtitle: data.location || 'Location not specified',
          priority: data.priority || 'medium',
          date: this.formatTimeAgo(data.submittedDate),
          status: data.status
        });
      });

      // Get pending artisan applications
      const artisanAppsQuery = query(
        collection(db, 'artisanApplications'),
        where('status', '==', 'pending'),
        orderBy('submittedDate', 'desc'),
        limit(5)
      );
      const artisanAppsSnapshot = await getDocs(artisanAppsQuery);
      
      artisanAppsSnapshot.forEach((doc) => {
        const data = doc.data();
        pendingItems.push({
          id: doc.id,
          type: 'artisan',
          title: `${data.name} - Artisan Application`,
          subtitle: data.skills?.join(', ') || 'Skills not specified',
          priority: data.priority || 'medium',
          date: this.formatTimeAgo(data.submittedDate),
          status: data.status
        });
      });

      // Get unverified properties
      const propertiesQuery = query(
        collection(db, 'properties'),
        where('isVerified', '==', false),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const propertiesSnapshot = await getDocs(propertiesQuery);
      
      propertiesSnapshot.forEach((doc) => {
        const data = doc.data();
        pendingItems.push({
          id: doc.id,
          type: 'property',
          title: `Property Verification Request`,
          subtitle: `${data.bedrooms || 0} Bedroom ${data.propertyType} - ${data.location}`,
          priority: 'medium',
          date: this.formatTimeAgo(data.createdAt),
          status: 'pending'
        });
      });

      return pendingItems
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching pending items:', error);
      throw error;
    }
  }

  // Get all home owner applications
  async getHomeOwnerApplications(): Promise<any[]> {
    try {
      const applicationsQuery = query(
        collection(db, 'homeOwnerApplications'),
        orderBy('submittedDate', 'desc')
      );
      const snapshot = await getDocs(applicationsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching home owner applications:', error);
      throw error;
    }
  }

  // Get all artisan applications
  async getArtisanApplications(): Promise<any[]> {
    try {
      const applicationsQuery = query(
        collection(db, 'artisanApplications'),
        orderBy('submittedDate', 'desc')
      );
      const snapshot = await getDocs(applicationsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching artisan applications:', error);
      throw error;
    }
  }

  // Update application status
  async updateApplicationStatus(
    collectionName: 'homeOwnerApplications' | 'artisanApplications',
    applicationId: string,
    status: 'approved' | 'rejected' | 'pending',
    reviewedBy: string,
    reviewNotes?: string
  ): Promise<void> {
    try {
      const applicationRef = doc(db, collectionName, applicationId);
      await updateDoc(applicationRef, {
        status,
        reviewedBy,
        reviewNotes,
        lastUpdated: serverTimestamp()
      });

      // If approving, create a user account
      if (status === 'approved') {
        const applicationDoc = await getDoc(applicationRef);
        if (applicationDoc.exists()) {
          const applicationData = applicationDoc.data();
          
          console.log('Application data for approval:', applicationData);
          
          // Validate required fields
          if (!applicationData.email || !applicationData.name) {
            throw new Error('Missing required fields: email or name');
          }
          
          // Log the application data for debugging
          console.log('Processing application approval for:', applicationData.email);
          
          // Create user account with Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            applicationData.email, 
            'tempPassword123!' // Temporary password, user will reset it
          );
          
          const user = userCredential.user;
          
          // Update display name
          await updateProfile(user, { displayName: applicationData.name });
          
          // Create user profile in Firestore
          const userProfile = {
            uid: user.uid,
            email: applicationData.email,
            displayName: applicationData.name,
            role: collectionName === 'homeOwnerApplications' ? 'home_owner' : 'artisan',
            status: 'approved',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isVerified: true,
            verificationDate: serverTimestamp(),
            phone: applicationData.phone || '',
            location: applicationData.location || '',
            region: applicationData.region || '',
            profileImage: applicationData.profileImageUrl || '',
            idImageUrl: applicationData.idImageUrl || '',
            ...(collectionName === 'homeOwnerApplications' ? {
              company: applicationData.company || '',
              yearsOfExperience: applicationData.experience || 0,
              idType: applicationData.idType || '',
              idNumber: applicationData.idNumber || '',
              bio: applicationData.about || ''
            } : {
              skills: applicationData.skills || [],
              bio: applicationData.about || ''
            })
          };
          
          await setDoc(doc(db, 'users', user.uid), userProfile);
          
          // Send password reset email so user can set their own password
          let emailSent = false;
          try {
            console.log('Sending password reset email to:', applicationData.email);
            await sendPasswordResetEmail(auth, applicationData.email);
            console.log('Password reset email sent successfully to:', applicationData.email);
            emailSent = true;
          } catch (emailError) {
            console.error('Error sending password reset email:', emailError);
            console.error('Email error details:', {
              email: applicationData.email,
              error: emailError,
              errorCode: (emailError as any)?.code,
              errorMessage: (emailError as any)?.message
            });
            
            // Log common Firebase email issues
            if ((emailError as any)?.code === 'auth/invalid-email') {
              console.error('Invalid email address format');
            } else if ((emailError as any)?.code === 'auth/user-not-found') {
              console.error('User not found in Firebase Auth');
            } else if ((emailError as any)?.code === 'auth/too-many-requests') {
              console.error('Too many password reset requests');
            }
          }
          
          // Log the result for debugging
          console.log('Application approval completed:', {
            email: applicationData.email,
            uid: user.uid,
            role: userProfile.role,
            emailSent,
            userCreated: true
          });
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Get all users for user management
  async getAllUsers(): Promise<any[]> {
    try {
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get verified home owners/agents
  async getVerifiedAgents(): Promise<any[]> {
    try {
      const agentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'home_owner'),
        where('isVerified', '==', true)
      );
      const snapshot = await getDocs(agentsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching verified agents:', error);
      throw error;
    }
  }

  // Get estate users
  async getEstateUsers(): Promise<any[]> {
    try {
      const estateUsersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'estate_manager')
      );
      const snapshot = await getDocs(estateUsersQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching estate users:', error);
      throw error;
    }
  }

  // Update user status
  async updateUserStatus(userId: string, status: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Add estate user
  async addEstateUser(userData: any): Promise<string> {
    try {
      console.log('Starting estate user creation for:', userData.email);
      
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4) + '!1';
      console.log('Generated temporary password for:', userData.email);
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, tempPassword);
      const user = userCredential.user;
      console.log('Firebase Auth user created with UID:', user.uid);
      
      // Update display name
      await updateProfile(user, {
        displayName: userData.name
      });
      console.log('Display name updated for user:', user.uid);
      
      // Create estate user profile in Firestore
      const estateData = {
        uid: user.uid,
        email: userData.email,
        displayName: userData.name,
        phone: userData.phone || '',
        location: userData.location || '',
        role: 'estate_manager', // Firebase role for authentication
        displayRole: 'Estate Manager', // Display role
        company: userData.estate || '',
        status: 'active',
        isVerified: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userData.createdBy || '',
      };
      
      // Use setDoc with user.uid as document ID to match AuthService expectations
      await setDoc(doc(db, 'users', user.uid), estateData);
      console.log('Firestore profile created for user:', user.uid);
      
      // Send password reset email so they can set their own password
      try {
        console.log('Attempting to send password reset email to:', userData.email);
        await sendPasswordResetEmail(auth, userData.email);
        console.log('Password reset email sent successfully to:', userData.email);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        // Store the temporary password in a secure way for manual distribution
        // For now, we'll log it (in production, you might want to store it in a secure location)
        console.log('Temporary password for manual distribution:', tempPassword);
        console.log('User email:', userData.email);
        // You might want to implement a fallback mechanism or retry logic
      }
      
      return user.uid;
    } catch (error) {
      console.error('Error adding estate user:', error);
      throw error;
    }
  }

  // Add staff user
  async addStaffUser(userData: any): Promise<string> {
    try {
      console.log('Starting staff user creation for:', userData.email);
      
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4) + '!1';
      console.log('Generated temporary password for:', userData.email);
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, tempPassword);
      const user = userCredential.user;
      console.log('Firebase Auth user created with UID:', user.uid);
      
      // Update display name
      await updateProfile(user, {
        displayName: userData.displayName
      });
      console.log('Display name updated for user:', user.uid);
      
      // Create staff profile in Firestore using the correct UserProfile structure
      const staffData = {
        uid: user.uid,
        email: userData.email,
        displayName: userData.displayName,
        phone: userData.phone || '',
        location: userData.location || '',
        role: 'staff', // Always set Firebase role as 'staff' for authentication
        displayRole: userData.role || 'Staff Member', // Store the display role separately
        company: userData.department || '', // Map department to company field
        status: 'active',
        skills: userData.permissions || [], // Map permissions to skills field
        bio: userData.bio || '',
        isVerified: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userData.createdBy || '',
      };
      
      // Use setDoc with user.uid as document ID to match AuthService expectations
      await setDoc(doc(db, 'users', user.uid), staffData);
      console.log('Firestore profile created for user:', user.uid);
      
      // Send password reset email so they can set their own password
      try {
        console.log('Attempting to send password reset email to:', userData.email);
        await sendPasswordResetEmail(auth, userData.email);
        console.log('Password reset email sent successfully to:', userData.email);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        // Store the temporary password in a secure way for manual distribution
        // For now, we'll log it (in production, you might want to store it in a secure location)
        console.log('Temporary password for manual distribution:', tempPassword);
        console.log('User email:', userData.email);
        // You might want to implement a fallback mechanism or retry logic
      }
      
      return user.uid;
    } catch (error) {
      console.error('Error adding staff user:', error);
      throw error;
    }
  }

  // Get all properties (for debugging)
  async getAllPropertiesForDebug(): Promise<any[]> {
    try {
      console.log('AdminService: Fetching ALL properties for debugging...');
      const propertiesQuery = query(collection(db, 'properties'));
      const snapshot = await getDocs(propertiesQuery);
      console.log('AdminService: Found', snapshot.docs.length, 'total properties');
      
      const properties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('AdminService: All properties data:', properties);
      return properties;
    } catch (error) {
      console.error('Error fetching all properties:', error);
      throw error;
    }
  }

  // Get properties for verification
  async getPropertiesForVerification(): Promise<any[]> {
    try {
      console.log('AdminService: Fetching properties for verification...');
      const propertiesQuery = query(
        collection(db, 'properties'),
        where('isVerified', '==', false)
      );
      console.log('AdminService: Query created, executing...');
      const snapshot = await getDocs(propertiesQuery);
      console.log('AdminService: Query executed, found', snapshot.docs.length, 'documents');
      
      const properties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('AdminService: Properties data:', properties);
      return properties;
    } catch (error) {
      console.error('Error fetching properties for verification:', error);
      throw error;
    }
  }

  // Search tenant reports
  async searchTenantReports(searchTerm: string): Promise<any[]> {
    try {
      const reportsQuery = query(
        collection(db, 'tenantReports'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(reportsQuery);
      
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter reports by tenant name (case-insensitive search)
      const filteredReports = reports.filter(report => 
        report.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return filteredReports;
    } catch (error) {
      console.error('Error searching tenant reports:', error);
      throw error;
    }
  }

  // Get analytics data
  async getAnalyticsData(): Promise<any> {
    try {
      // Get all properties for location analysis
      const propertiesQuery = query(collection(db, 'properties'));
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const properties = propertiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get all users for activity analysis
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Analyze top locations
      const locationCounts: { [key: string]: number } = {};
      properties.forEach(property => {
        const location = property.location || 'Unknown';
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      });

      const topLocations = Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([location, count]) => ({ location, count }));

      // Analyze recent activities (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentActivities = users
        .filter(user => {
          const createdAt = user.createdAt ? new Date(user.createdAt.toDate()) : new Date();
          return createdAt >= thirtyDaysAgo;
        })
        .map(user => ({
          id: user.id,
          type: 'user_registration',
          title: `New ${user.role || 'user'} registered`,
          description: `${user.name || user.email} joined the platform`,
          timestamp: user.createdAt ? new Date(user.createdAt.toDate()) : new Date()
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);

      return {
        topLocations,
        recentActivities,
        totalProperties: properties.length,
        totalUsers: users.length,
        activeUsers: users.filter(user => user.status === 'active').length
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  // Helper method to format time ago
  private formatTimeAgo(date: any): string {
    if (!date) return 'Unknown';
    
    const timestamp = date instanceof Timestamp ? date.toDate() : new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return timestamp.toLocaleDateString();
  }
}

export const adminService = new AdminService();
export default adminService; 