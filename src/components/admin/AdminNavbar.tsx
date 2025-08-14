
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink, Bell, Settings, User, LogOut, Home, BarChart3, Users, Building2, FileText, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { adminService } from '@/services/adminService';

const AdminNavbar = () => {
  const { userProfile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock notifications count - in real app, this would come from Firebase
  const notificationsCount = 3;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const adminStats = await adminService.getAdminStats();
        setStats({
          totalUsers: adminStats.totalUsers,
          totalProperties: adminStats.totalProperties
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD';
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg border-b border-red-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link to="/admin-dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-200">
                  <ShieldAlert size={24} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg tracking-tight">Ghana Real Estate</div>
                <div className="text-xs text-red-100 font-medium">Administration Panel</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Quick Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                <Users className="h-4 w-4" />
                <span className="font-medium">
                  {isLoading ? '...' : stats.totalUsers.toLocaleString()}
                </span>
                <span className="text-red-100">Users</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">
                  {isLoading ? '...' : stats.totalProperties.toLocaleString()}
                </span>
                <span className="text-red-100">Properties</span>
              </div>
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                  {notificationsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-yellow-500 text-white border-2 border-red-600">
                      {notificationsCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications ({notificationsCount})
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Home Owner Application</p>
                    <p className="text-xs text-gray-500">John Doe submitted an application</p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Property Verification Approved</p>
                    <p className="text-xs text-gray-500">East Legon property verified</p>
                    <p className="text-xs text-gray-400">15 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System Alert</p>
                    <p className="text-xs text-gray-500">High traffic detected</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white hover:bg-white/10">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.profileImage} alt={userProfile?.displayName} />
                    <AvatarFallback className="bg-white/20 text-white text-sm font-medium">
                      {getInitials(userProfile?.displayName || 'Admin')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium">{userProfile?.displayName || 'Admin User'}</div>
                    <div className="text-xs text-red-100">Super Administrator</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                                 <DropdownMenuItem 
                   className="flex items-center gap-2"
                   onClick={() => window.location.href = '/admin-dashboard?tab=profile'}
                 >
                   <User className="h-4 w-4" />
                   Profile
                 </DropdownMenuItem>
                 <DropdownMenuItem 
                   className="flex items-center gap-2"
                   onClick={() => window.location.href = '/admin-dashboard?tab=settings'}
                 >
                   <Settings className="h-4 w-4" />
                   Settings
                 </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Website Button */}
            <Link to="/">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white hover:text-red-600 transition-all duration-200">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Website
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {isLoading ? '...' : `${stats.totalUsers.toLocaleString()} Users`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">
                    {isLoading ? '...' : `${stats.totalProperties.toLocaleString()} Properties`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="text-sm">Notifications ({notificationsCount})</span>
              </div>
              <Link to="/" className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4" />
                View Website
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
