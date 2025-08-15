import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authService, UserProfile, UserRole } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User; profile: UserProfile | null }>;
  signUp: (email: string, password: string, displayName: string, role: UserRole, additionalData?: Partial<UserProfile>) => Promise<{ user: User; profile: UserProfile }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  isVerified: boolean;
  isApproved: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile when user changes
  const loadUserProfile = async (user: User | null) => {
    if (user) {
      try {
        const profile = await authService.getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      await loadUserProfile(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      setUser(result.user);
      setUserProfile(result.profile);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    additionalData?: Partial<UserProfile>
  ) => {
    setLoading(true);
    try {
      const result = await authService.signUp(email, password, displayName, role, additionalData);
      setUser(result.user);
      setUserProfile(result.profile);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) {
      throw new Error('No authenticated user');
    }

    try {
      await authService.updateUserProfile(user.uid, updates);
      setUserProfile({ ...userProfile, ...updates });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    await loadUserProfile(user);
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!userProfile) return false;
    return allowedRoles.includes(userProfile.role);
  };

  const isVerified = userProfile?.isVerified ?? false;
  const isApproved = userProfile?.status === 'approved' || userProfile?.status === 'active';

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    hasRole,
    isVerified,
    isApproved
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireVerification?: boolean;
  requireApproval?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireVerification = false,
  requireApproval = false,
  fallback,
  redirectTo
}) => {
  const { user, userProfile, loading, hasRole, isVerified, isApproved } = useAuth();

  // Debug logging for ProtectedRoute
  console.log('🔒 ProtectedRoute Debug:');
  console.log('Route:', window.location.pathname);
  console.log('Loading:', loading);
  console.log('User:', user?.uid);
  console.log('UserProfile:', userProfile);
  console.log('Allowed Roles:', allowedRoles);
  console.log('User Role:', userProfile?.role);
  console.log('Has Required Role:', allowedRoles ? hasRole(allowedRoles) : 'No role requirement');
  console.log('Is Verified:', isVerified);
  console.log('Is Approved:', isApproved);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ No user - redirecting to login');
    if (redirectTo) {
      window.location.href = redirectTo;
      return null;
    }
    return fallback || <div>Please sign in to access this page.</div>;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    console.log('❌ User does not have required role');
    console.log('Required roles:', allowedRoles);
    console.log('User role:', userProfile?.role);
    console.log('Has role result:', hasRole(allowedRoles));
    return fallback || <div>You don't have permission to access this page.</div>;
  }

  if (requireVerification && !isVerified) {
    return fallback || <div>Your account needs to be verified to access this page.</div>;
  }

  if (requireApproval && !isApproved) {
    return fallback || <div>Your account needs to be approved to access this page.</div>;
  }

  return <>{children}</>;
};

// Hook for role-based access
export const useRoleAccess = () => {
  const { hasRole, userProfile } = useAuth();

  return {
    isHomeOwner: hasRole(['home_owner']),
    isArtisan: hasRole(['artisan']),
    isAdmin: hasRole(['admin']),
    isStaff: hasRole(['staff']),
    isEstateManager: hasRole(['estate_manager']),
    isTenant: hasRole(['tenant']),
    isAdminOrStaff: hasRole(['admin', 'staff']),
    canManageProperties: hasRole(['admin', 'staff', 'estate_manager']),
    canVerifyProperties: hasRole(['admin', 'staff']),
    canManageUsers: hasRole(['admin']),
    userRole: userProfile?.role
  };
}; 