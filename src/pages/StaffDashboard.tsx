import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  LogOut, UserCog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import HomeOwnerManagement from '@/components/staff/HomeOwnerManagement';
import StaffUserInfo from '@/components/staff/StaffUserInfo';
import StaffTabNavigation from '@/components/staff/StaffTabNavigation';
import StaffOverview from '@/components/staff/StaffOverview';
import StaffPlaceholderTab from '@/components/staff/StaffPlaceholderTab';
import PropertyVerificationManagement from '@/components/staff/PropertyVerificationManagement';
import TenantSearch from '@/components/admin/TenantSearch';
import StaffReports from '@/components/staff/StaffReports';
import StaffUserManagement from '@/components/staff/StaffUserManagement';
import StaffPropertyManagement from '@/components/staff/StaffPropertyManagement';
import StaffRentalApplications from '@/components/staff/StaffRentalApplications';
import StaffMaintenanceRequests from '@/components/staff/StaffMaintenanceRequests';
import StaffCalendar from '@/components/staff/StaffCalendar';
import StaffPayments from '@/components/staff/StaffPayments';
import StaffSupport from '@/components/staff/StaffSupport';
import { Shield, FileText } from 'lucide-react';

interface StaffUser {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'moderator';
  department: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
}

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile, signOut } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is authenticated and has staff role
    if (!user || !userProfile) {
      toast({
        title: "Unauthorized Access",
        description: "You must be logged in as staff to view this page.",
        variant: "destructive"
      });
      navigate('/staff-login');
      return;
    }
    
    // Check if user has staff role
    if (!['admin', 'staff', 'moderator'].includes(userProfile.role)) {
      toast({
        title: "Access Denied",
        description: "You don't have staff privileges to access this dashboard.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    // Check if staff is suspended
    if (userProfile.status === 'suspended') {
      toast({
        title: "Account Suspended",
        description: "Your account has been suspended. Please contact the administrator.",
        variant: "destructive"
      });
      navigate('/staff-login');
      return;
    }
    
    // Set current user data
    setCurrentUser({
      id: userProfile.uid,
      uid: userProfile.uid,
      displayName: userProfile.displayName,
      email: userProfile.email,
      phone: userProfile.phone || '',
      role: userProfile.role as 'admin' | 'staff' | 'moderator',
      department: userProfile.company || '',
      permissions: userProfile.skills || [],
      status: userProfile.status as 'active' | 'inactive' | 'suspended',
      createdAt: userProfile.createdAt || new Date(),
    });
    
    setIsAuthorized(true);
    
    // Set default tab based on user permissions
    if (userProfile.skills?.includes('property_verification')) {
      setActiveTab('property_verification');
    } else if (userProfile.skills?.includes('reports')) {
      setActiveTab('reports');
    } else if (userProfile.skills?.includes('user_management')) {
      setActiveTab('user_management');
    }
  }, [user, userProfile, navigate, toast]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out of the staff dashboard.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canAccess = (permission: string) => {
    return currentUser?.permissions.includes(permission) || false;
  };

  if (!isAuthorized || !currentUser) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <UserCog className="mr-2" size={28} />
              Staff Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back, {currentUser.displayName}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="gap-1">
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        <StaffUserInfo user={currentUser} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <StaffTabNavigation canAccess={canAccess} />

          <TabsContent value="overview">
            <StaffOverview canAccess={canAccess} />
          </TabsContent>

          <TabsContent value="property_management" className="bg-white p-6 rounded-lg shadow">
            <StaffPropertyManagement />
          </TabsContent>

          <TabsContent value="rental_applications" className="bg-white p-6 rounded-lg shadow">
            <StaffRentalApplications />
          </TabsContent>

          <TabsContent value="maintenance_requests" className="bg-white p-6 rounded-lg shadow">
            <StaffMaintenanceRequests />
          </TabsContent>

          <TabsContent value="payments" className="bg-white p-6 rounded-lg shadow">
            <StaffPayments />
          </TabsContent>

          <TabsContent value="calendar" className="bg-white p-6 rounded-lg shadow">
            <StaffCalendar />
          </TabsContent>

          <TabsContent value="support" className="bg-white p-6 rounded-lg shadow">
            <StaffSupport />
          </TabsContent>

          {canAccess('property_verification') && (
            <TabsContent value="property_verification">
              <PropertyVerificationManagement />
            </TabsContent>
          )}

          {canAccess('user_management') && (
            <TabsContent value="home_owners" className="bg-white p-6 rounded-lg shadow">
              <HomeOwnerManagement />
            </TabsContent>
          )}

          <TabsContent value="tenant_search" className="bg-white p-6 rounded-lg shadow">
            <TenantSearch userType="staff" />
          </TabsContent>

          {canAccess('reports') && (
            <TabsContent value="reports">
              <StaffReports />
            </TabsContent>
          )}

          {canAccess('user_management') && (
            <TabsContent value="user_management">
              <StaffUserManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default StaffDashboard;
