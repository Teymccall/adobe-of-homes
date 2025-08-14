
import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, UserCog, TrendingUp, AlertTriangle, CheckCircle, Clock, Activity, BarChart3, Plus, Search, MessageSquare, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { adminService } from '@/services/adminService';

interface StaffOverviewProps {
  canAccess: (priority: string) => boolean;
}

interface QuickStats {
  totalProperties: number;
  pendingVerifications: number;
  totalUsers: number;
  activeUsers: number;
  systemHealth: number;
  recentActivities: number;
}

const StaffOverview = ({ canAccess }: StaffOverviewProps) => {
  const [stats, setStats] = useState<QuickStats>({
    totalProperties: 0,
    pendingVerifications: 0,
    totalUsers: 0,
    activeUsers: 0,
    systemHealth: 98,
    recentActivities: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const adminStats = await adminService.getAdminStats();
        const analyticsData = await adminService.getAnalyticsData();
        
        setStats({
          totalProperties: adminStats.totalProperties,
          pendingVerifications: adminStats.verificationRequests,
          totalUsers: adminStats.totalUsers,
          activeUsers: adminStats.totalUsers, // You might want to calculate this differently
          systemHealth: adminStats.systemHealth.systemUptime,
          recentActivities: analyticsData.recentActivities?.length || 0
        });
      } catch (error) {
        console.error('Error fetching staff overview stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getSystemHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600';
    if (health >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSystemHealthIcon = (health: number) => {
    if (health >= 95) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (health >= 80) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingVerifications} pending verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            {getSystemHealthIcon(stats.systemHealth)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSystemHealthColor(stats.systemHealth)}`}>
              {isLoading ? '...' : `${stats.systemHealth}%`}
            </div>
            <Progress value={stats.systemHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.recentActivities}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {canAccess('property_verification') && (
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Shield size={20} />
                <span className="text-sm">Verify Properties</span>
              </Button>
            )}
            
            {canAccess('user_management') && (
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users size={20} />
                <span className="text-sm">Manage Users</span>
              </Button>
            )}
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Search size={20} />
              <span className="text-sm">Search Tenants</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText size={20} />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Permission-Based Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {canAccess('property_verification') && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield size={20} />
                Property Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Verify and approve property listings submitted by home owners.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{stats.pendingVerifications} pending</Badge>
                <Button size="sm" variant="outline">View All</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {canAccess('user_management') && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users size={20} />
                Home Owner Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Add and manage home owners in the system.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{stats.totalUsers} total users</Badge>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {canAccess('reports') && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 size={20} />
                Reports & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Generate and view system reports and analytics data.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{stats.recentActivities} activities</Badge>
                <Button size="sm" variant="outline">View Reports</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {canAccess('user_management') && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCog size={20} />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Manage user accounts and access permissions.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{stats.activeUsers} active</Badge>
                <Button size="sm" variant="outline">Manage Users</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search size={20} />
              Tenant Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Search tenant reports and history for informed decisions.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Available</Badge>
              <Button size="sm" variant="outline">Search</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare size={20} />
              Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Send notifications and manage communications with users.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">New</Badge>
              <Button size="sm" variant="outline">Send Message</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffOverview;
