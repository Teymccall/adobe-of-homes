import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  LogOut, UserCog, LayoutDashboard, Building2, FileText, 
  Wrench, CreditCard, Calendar, HelpCircle, Shield, 
  Users, BarChart3, Search, Settings, Bell, 
  TrendingUp, Activity, CheckCircle, Clock, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCog className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Staff Dashboard
                  </h1>
                  <p className="text-slate-600 text-sm font-medium">
                    Welcome back, <span className="text-blue-600 font-semibold">{currentUser.displayName}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell size={18} className="text-slate-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings size={18} className="text-slate-600" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Properties</p>
                    <p className="text-2xl font-bold text-slate-900">1,247</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp size={12} className="mr-1" />
                      +12% this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pending Requests</p>
                    <p className="text-2xl font-bold text-slate-900">23</p>
                    <p className="text-xs text-yellow-600 flex items-center mt-1">
                      <Clock size={12} className="mr-1" />
                      5 urgent
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Active Users</p>
                    <p className="text-2xl font-bold text-slate-900">892</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <CheckCircle size={12} className="mr-1" />
                      98% verified
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">System Health</p>
                    <p className="text-2xl font-bold text-slate-900">99.9%</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <Activity size={12} className="mr-1" />
                      All systems operational
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Info Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-xl mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <UserCog className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your Account Information</h3>
                    <div className="flex items-center space-x-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-100">Role:</span>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {currentUser.role}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-100">Email:</span>
                        <span className="font-medium">{currentUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-100">Status:</span>
                        <Badge 
                          variant="secondary" 
                          className={`${
                            currentUser.status === 'active' 
                              ? 'bg-green-500/20 text-green-100 border-green-300/30' 
                              : 'bg-red-500/20 text-red-100 border-red-300/30'
                          }`}
                        >
                          {currentUser.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Access Permissions</p>
                  <p className="text-white font-medium">
                    {currentUser.permissions.length > 0 
                      ? currentUser.permissions.join(', ') 
                      : 'No permissions assigned'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 mb-6">
              <StaffTabNavigation canAccess={canAccess} />
            </div>

            <div className="space-y-6">
              <TabsContent value="overview" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaffOverview canAccess={canAccess} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="property_management" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Building2 className="mr-2 h-5 w-5" />
                      Property Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaffPropertyManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rental_applications" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <FileText className="mr-2 h-5 w-5" />
                      Rental Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaffRentalApplications />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="maintenance_requests" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Wrench className="mr-2 h-5 w-5" />
                      Maintenance Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaffMaintenanceRequests />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaffPayments />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Calendar className="mr-2 h-5 w-5" />
                      Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaffCalendar />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <HelpCircle className="mr-2 h-5 w-5" />
                      Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaffSupport />
                  </CardContent>
                </Card>
              </TabsContent>

              {canAccess('property_verification') && (
                <TabsContent value="property_verification" className="mt-0">
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800">
                        <Shield className="mr-2 h-5 w-5" />
                        Property Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PropertyVerificationManagement />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {canAccess('user_management') && (
                <TabsContent value="home_owners" className="mt-0">
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800">
                        <Users className="mr-2 h-5 w-5" />
                        Home Owner Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <HomeOwnerManagement />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="tenant_search" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <Search className="mr-2 h-5 w-5" />
                      Tenant Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TenantSearch userType="staff" />
                  </CardContent>
                </Card>
              </TabsContent>

              {canAccess('reports') && (
                <TabsContent value="reports" className="mt-0">
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StaffReports />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {canAccess('user_management') && (
                <TabsContent value="user_management" className="mt-0">
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800">
                        <Users className="mr-2 h-5 w-5" />
                        User Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StaffUserManagement />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default StaffDashboard;
