
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
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
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
import { notificationService } from '@/services/notificationService';
import AdminFeaturedPropertyUploader from '@/components/admin/AdminFeaturedPropertyUploader';
import AdminFeaturedPropertyList from '@/components/admin/AdminFeaturedPropertyList';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile, signOut, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [quickStats, setQuickStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingReviews: 0,
    systemHealth: 98
  });
  const [notificationCounts, setNotificationCounts] = useState({
    homeOwnerApplications: 0,
    artisanApplications: 0,
    propertyVerifications: 0,
    maintenanceRequests: 0,
    payments: 0,
    reports: 0
  });

  // Debug: Log authentication state
  useEffect(() => {
    console.log('🔍 AdminDashboard Debug Info:');
    console.log('User:', user);
    console.log('User Profile:', userProfile);
    console.log('User Role:', userProfile?.role);
    console.log('User Status:', userProfile?.status);
    console.log('Has Admin Role:', hasRole(['admin']));
    console.log('Has Staff Role:', hasRole(['staff']));
    console.log('Has Estate Manager Role:', hasRole(['estate_manager']));
    console.log('Is Verified:', userProfile?.isVerified);
    console.log('Is Approved:', userProfile?.status === 'approved' || userProfile?.status === 'active');
  }, [user, userProfile, hasRole]);

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

    const fetchNotificationCounts = async () => {
      try {
        await notificationService.fetchNotificationCounts();
      } catch (error) {
        console.error('Error fetching notification counts:', error);
      }
    };

    fetchQuickStats();
    fetchNotificationCounts();

    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((counts) => {
      setNotificationCounts(counts);
    });

    return () => unsubscribe();
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
      
      {/* Debug Banner - Remove this after fixing the issue */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Debug Information</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p><strong>User ID:</strong> {user?.uid || 'Not authenticated'}</p>
              <p><strong>User Email:</strong> {user?.email || 'Not available'}</p>
              <p><strong>Profile Role:</strong> {userProfile?.role || 'No role'}</p>
              <p><strong>Profile Status:</strong> {userProfile?.status || 'No status'}</p>
              <p><strong>Is Verified:</strong> {userProfile?.isVerified ? 'Yes' : 'No'}</p>
              <p><strong>Has Admin Role:</strong> {hasRole(['admin']) ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
      
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
        
        {/* Tab Navigation - Redesigned for better spacing and layout */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3 justify-start">
            {/* Overview Tab */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-200
                ${activeTab === 'overview'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                min-w-fit whitespace-nowrap
              `}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>

            {/* Home Owners Dropdown */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost"
                    className={`
                      inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-200
                      ${(activeTab === 'applications' || activeTab === 'agents') 
                        ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm' 
                        : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }
                      min-w-fit whitespace-nowrap
                    `}
                  >
                    <Users size={18} />
                    <span>Home Owners</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('applications')}
                    className="flex items-center gap-2"
                  >
                    <UserCheck size={18} />
                    Applications
                    {notificationCounts.homeOwnerApplications > 0 && (
                      <Badge variant="destructive" className="ml-auto rounded-full text-white">{notificationCounts.homeOwnerApplications}</Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('agents')}
                    className="flex items-center gap-2"
                  >
                    <Users size={18} />
                    Manage
                    {quickStats.totalUsers > 0 && (
                      <Badge variant="secondary" className="ml-auto rounded-full">{quickStats.totalUsers}</Badge>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Artisan Applications Tab */}
            <button
              onClick={() => setActiveTab('artisans')}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-200
                ${activeTab === 'artisans'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                min-w-fit whitespace-nowrap
              `}
            >
              <Hammer size={18} />
              <span>Artisan Applications</span>
              {notificationCounts.artisanApplications > 0 && (
                <Badge variant="destructive" className="ml-1 rounded-full text-white">{notificationCounts.artisanApplications}</Badge>
              )}
            </button>

            {/* User Management Dropdown */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost"
                    className={`
                      inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-200
                      ${(activeTab === 'users' || activeTab === 'estate-users' || activeTab === 'staffs') 
                        ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm' 
                        : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }
                      min-w-fit whitespace-nowrap
                    `}
                  >
                    <UserCog size={18} />
                    <span>User Management</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('users')}
                    className="flex items-center gap-2"
                  >
                    <Users size={18} />
                    All Users
                    {quickStats.totalUsers > 0 && (
                      <Badge variant="secondary" className="ml-auto rounded-full">{quickStats.totalUsers}</Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('estate-users')}
                    className="flex items-center gap-2"
                  >
                    <Building2 size={18} />
                    Estate Users
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('staffs')}
                    className="flex items-center gap-2"
                  >
                    <UserCog size={18} />
                    Staff Members
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Verification Requests Tab */}
            <button
              onClick={() => setActiveTab('verifications')}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-200
                ${activeTab === 'verifications'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                min-w-fit whitespace-nowrap
              `}
            >
              <Shield size={18} />
              <span>Verification Requests</span>
              {notificationCounts.propertyVerifications > 0 && (
                <Badge variant="destructive" className="ml-1 rounded-full text-white">{notificationCounts.propertyVerifications}</Badge>
              )}
            </button>

            {/* Property Scraping Tab */}
            <button
              onClick={() => setActiveTab('scraping')}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-200
                ${activeTab === 'scraping'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                min-w-fit whitespace-nowrap
              `}
            >
              <Download size={18} />
              <span>Property Scraping</span>
            </button>

            {/* System Reports Tab */}
            <button
              onClick={() => setActiveTab('reports')}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-200
                ${activeTab === 'reports'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                min-w-fit whitespace-nowrap
              `}
            >
              <FileText size={18} />
              <span>System Reports</span>
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="w-full">
          {/* New: Featured Properties management for Admins */}
          {activeTab === 'overview' && (
            <div className="mb-6 flex flex-wrap gap-3">
              <Button
                onClick={() => setActiveTab('add-featured')}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Add Featured Property
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('manage-featured')}
              >
                Manage Featured
              </Button>
            </div>
          )}
          {activeTab === 'overview' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <AdminOverview />
            </div>
          )}
          
          {activeTab === 'applications' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <AgentApplicationsList />
            </div>
          )}
          
          {activeTab === 'agents' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Manage Verified Home Owners</h2>
              <AgentManagement />
            </div>
          )}
          
          {activeTab === 'artisans' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <ArtisanApplicationsList />
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <UserManagement />
            </div>
          )}
          
          {activeTab === 'estate-users' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Estate Management Users</h2>
              <EstateUserManagement />
            </div>
          )}
          
          {activeTab === 'staffs' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">System Staff Management</h2>
              <StaffManagement />
            </div>
          )}
          
          {activeTab === 'verifications' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <PropertyVerificationManagement />
            </div>
          )}
          
          {activeTab === 'scraping' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <ScrapingManagement />
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <AnalyticsDashboard />
            </div>
          )}

          {activeTab === 'add-featured' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Add Featured Property</h2>
              <p className="text-sm text-gray-600 mb-6">Upload a property and mark it as featured. Featured properties appear on the homepage.</p>
              {/* Reuse agent upload form but admins will own the property; we toggle featured flag after create */}
              <AdminFeaturedPropertyUploader />
            </div>
          )}

          {activeTab === 'manage-featured' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Manage Featured Properties</h2>
              <AdminFeaturedPropertyList />
            </div>
          )}
          
          {/* Profile and Settings tabs - accessible via URL parameters */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <AdminProfile />
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <AdminSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
