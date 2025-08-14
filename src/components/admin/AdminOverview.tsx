import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Home, 
  FileCheck, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  Hammer,
  Building2,
  DollarSign,
  Activity
} from 'lucide-react';
import { adminService, AdminStats, PendingItem } from '@/services/adminService';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  variant = 'default' 
}) => {
  const variantStyles = {
    default: 'border-gray-200',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    destructive: 'border-red-200 bg-red-50'
  };

  return (
    <Card className={`${variantStyles[variant]} transition-all hover:shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="text-gray-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <ArrowUpRight 
              className={`h-4 w-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500 rotate-90'}`} 
            />
            <span className={`text-xs font-medium ml-1 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};



const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProperties: 0,
    pendingApplications: 0,
    monthlyRevenue: 0,
    verificationRequests: 0,
    activeListings: 0,
    approvedAgents: 0,
    totalArtisans: 0,
    systemHealth: {
      userEngagement: 0,
      systemUptime: 0,
      responseTime: 0,
      errorRate: 0
    }
  });
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, pendingData] = await Promise.all([
          adminService.getAdminStats(),
          adminService.getPendingItems()
        ]);
        setStats(statsData);
        setPendingItems(pendingData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home_owner': return <Users className="h-4 w-4" />;
      case 'artisan': return <Hammer className="h-4 w-4" />;
      case 'property': return <Home className="h-4 w-4" />;
      case 'verification': return <FileCheck className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          description="All registered users"
          icon={<Users className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Total Properties"
          value={stats.totalProperties.toLocaleString()}
          description="Listed properties"
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          description="Awaiting review"
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
        />
        <StatCard
          title="Monthly Revenue"
          value={`GH₵ ${stats.monthlyRevenue.toLocaleString()}`}
          description="This month's earnings"
          icon={<DollarSign className="h-5 w-5" />}
          variant="success"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Verification Requests"
          value={stats.verificationRequests}
          description="Properties awaiting verification"
          icon={<FileCheck className="h-5 w-5" />}
          variant="warning"
        />
        <StatCard
          title="Active Listings"
          value={stats.activeListings}
          description="Currently available"
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          title="Approved Home Owners"
          value={stats.approvedAgents}
          description="Verified property agents"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          title="Total Artisans"
          value={stats.totalArtisans}
          description="Service providers"
          icon={<Hammer className="h-5 w-5" />}
        />
      </div>

      {/* System Health & Pending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Platform performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>User Engagement</span>
                <span className="font-medium">{stats.systemHealth.userEngagement}%</span>
              </div>
              <Progress value={stats.systemHealth.userEngagement} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>System Uptime</span>
                <span className="font-medium">{stats.systemHealth.systemUptime}%</span>
              </div>
              <Progress value={stats.systemHealth.systemUptime} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Time</span>
                <span className="font-medium">Good</span>
              </div>
              <Progress value={stats.systemHealth.responseTime} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Error Rate</span>
                <span className="font-medium">{stats.systemHealth.errorRate}%</span>
              </div>
              <Progress value={stats.systemHealth.errorRate * 10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Pending Actions
                </CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.subtitle}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(item.priority) as any} className="text-xs">
                      {item.priority}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileCheck className="h-6 w-6" />
              <span>Verify Properties</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Building2 className="h-6 w-6" />
              <span>System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;