
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, FileHeart, Settings, LogOut, Check, X, 
  UserCheck, UserX, LayoutDashboard, FileText,
  Shield, Hammer, Building2, ChevronDown, UserCog, BarChart3, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import PropertyVerificationManagement from '@/components/admin/PropertyVerificationManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import AgentApplicationsList from '@/components/admin/AgentApplicationsList';
import AgentManagement from '@/components/admin/AgentManagement';
import AdminReports from '@/components/admin/AdminReports';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminProfile from '@/components/admin/AdminProfile';
import PropertyVerifications from '@/components/admin/PropertyVerifications';
import ArtisanApplicationsList from '@/components/admin/ArtisanApplicationsList';
import EstateUserManagement from '@/components/admin/EstateUserManagement';
import StaffManagement from '@/components/admin/StaffManagement';
import ScrapingManagement from '@/components/admin/ScrapingManagement';
import { adminService } from '@/services/adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [quickStats, setQuickStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingReviews: 0,
    systemHealth: 98
  });

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const stats = await adminService.getAdminStats();
        setQuickStats({
          totalUsers: stats.totalUsers,
          totalProperties: stats.totalProperties,
          pendingReviews: stats.pendingApplications,
          systemHealth: stats.systemHealth.systemUptime
        });
      } catch (error) {
        console.error('Error fetching quick stats:', error);
      }
    };

    fetchQuickStats();
  }, []);

  // Check for tab parameter in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['profile', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out of the admin dashboard.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="mb-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  {userProfile && (
                    <p className="text-lg text-gray-600 mt-1">
                      Welcome back, <span className="font-semibold text-blue-600">{userProfile.displayName}</span> 👋
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your platform, review applications, and monitor system performance
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <Button variant="outline" onClick={handleLogout} className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Active users</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Properties Listed</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.totalProperties.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Total properties</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.pendingReviews}</p>
                  <p className="text-xs text-yellow-600">Requires attention</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.systemHealth}%</p>
                  <p className="text-xs text-green-600">All systems operational</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
              <LayoutDashboard size={16} />
              <span className="hidden md:inline">Overview</span>
              <span className="md:hidden">Overview</span>
            </TabsTrigger>
            <div className="flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={activeTab === 'applications' || activeTab === 'agents' ? 'default' : 'ghost'} 
                    className="flex items-center gap-2 h-10"
                  >
                    <Users size={16} />
                    <span className="hidden md:inline">Home Owners</span>
                    <span className="md:hidden">Home Owners</span>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('applications')}
                    className="flex items-center gap-2"
                  >
                    <UserCheck size={16} />
                    Applications
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('agents')}
                    className="flex items-center gap-2"
                  >
                    <Users size={16} />
                    Manage
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <TabsTrigger value="artisans" className="flex items-center gap-2">
              <Hammer size={16} />
              <span className="hidden md:inline">Artisan Applications</span>
              <span className="md:hidden">Artisans</span>
            </TabsTrigger>
            
            <div className="flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={activeTab === 'users' || activeTab === 'estate-users' || activeTab === 'staffs' ? 'default' : 'ghost'} 
                    className="flex items-center gap-2 h-10"
                  >
                    <UserCog size={16} />
                    <span className="hidden md:inline">User Management</span>
                    <span className="md:hidden">Users</span>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('users')}
                    className="flex items-center gap-2"
                  >
                    <Users size={16} />
                    All Users
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('estate-users')}
                    className="flex items-center gap-2"
                  >
                    <Building2 size={16} />
                    Estate Users
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('staffs')}
                    className="flex items-center gap-2"
                  >
                    <UserCog size={16} />
                    Staff Members
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <TabsTrigger value="verifications" className="flex items-center gap-2">
              <Shield size={16} />
              <span className="hidden md:inline">Verification Requests</span>
              <span className="md:hidden">Verifications</span>
            </TabsTrigger>
            <TabsTrigger value="scraping" className="flex items-center gap-2">
              <Download size={16} />
              <span className="hidden md:inline">Property Scraping</span>
              <span className="md:hidden">Scraping</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden md:inline">System Reports</span>
              <span className="md:hidden">Reports</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <AdminOverview />
          </TabsContent>
          
          <TabsContent value="applications" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <AgentApplicationsList />
          </TabsContent>
          
          <TabsContent value="agents" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Manage Verified Home Owners</h2>
            <AgentManagement />
          </TabsContent>
          
          <TabsContent value="artisans" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ArtisanApplicationsList />
          </TabsContent>
          
          <TabsContent value="users" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="estate-users" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Estate Management Users</h2>
            <EstateUserManagement />
          </TabsContent>
          
          <TabsContent value="staffs" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">System Staff Management</h2>
            <StaffManagement />
          </TabsContent>
          
          <TabsContent value="verifications" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <PropertyVerificationManagement />
          </TabsContent>
          
          <TabsContent value="scraping" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ScrapingManagement />
          </TabsContent>
          
          <TabsContent value="reports" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <AnalyticsDashboard />
          </TabsContent>
          
          {/* Profile and Settings tabs - accessible via URL parameters */}
          <TabsContent value="profile" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <AdminProfile />
          </TabsContent>
          
          <TabsContent value="settings" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
