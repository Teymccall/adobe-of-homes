import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Home, 
  DollarSign, 
  Activity,
  Calendar,
  Download,
  Eye,
  UserPlus,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  period: string;
  users: {
    total: number;
    new: number;
    active: number;
    growth: number;
  };
  properties: {
    total: number;
    listed: number;
    verified: number;
    growth: number;
  };
  revenue: {
    total: number;
    monthly: number;
    growth: number;
  };
  engagement: {
    pageViews: number;
    sessions: number;
    avgDuration: string;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    period: 'January 2024',
    users: { total: 0, new: 0, active: 0, growth: 0 },
    properties: { total: 0, listed: 0, verified: 0, growth: 0 },
    revenue: { total: 0, monthly: 0, growth: 0 },
    engagement: { pageViews: 0, sessions: 0, avgDuration: '0m 0s' }
  });
  const [topLocations, setTopLocations] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Fetch analytics data from Firebase
      const analyticsData = await adminService.getAnalyticsData();
      
      // Update analytics data
      setAnalyticsData({
        period: 'January 2024',
        users: { 
          total: analyticsData.totalUsers, 
          new: analyticsData.totalUsers, 
          active: analyticsData.activeUsers, 
          growth: 12.5 
        },
        properties: { 
          total: analyticsData.totalProperties, 
          listed: analyticsData.totalProperties, 
          verified: analyticsData.totalProperties, 
          growth: 8.2 
        },
        revenue: { total: 45200, monthly: 45200, growth: 15.3 },
        engagement: { pageViews: 12500, sessions: 3200, avgDuration: '4m 32s' }
      });
      
      setTopLocations(analyticsData.topLocations);
      setRecentActivities(analyticsData.recentActivities);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount.toLocaleString()}`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <UserPlus className="h-4 w-4" />;
      case 'property_listed':
        return <Home className="h-4 w-4" />;
      case 'verification':
        return <CheckCircle className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registration': return 'text-blue-600';
      case 'property_listed': return 'text-green-600';
      case 'verification': return 'text-purple-600';
      case 'payment': return 'text-yellow-600';
      case 'review': return 'text-pink-600';
      default: return 'text-gray-600';
    }
  };

  const refreshAnalytics = async () => {
    try {
      setIsRefreshing(true);
      await fetchAnalytics();
      toast({
        title: "Data Refreshed",
        description: "Analytics data has been updated successfully.",
      });
    } catch (error) {
      console.error('Error refreshing analytics:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh analytics data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportAnalyticsData = async () => {
    try {
      setIsExporting(true);
      // Create CSV content
      const csvContent = [
        // Headers
        ['Metric', 'Value', 'Growth', 'Period'],
        // User metrics
        ['Total Users', analyticsData.users.total, `${analyticsData.users.growth}%`, timeRange],
        ['Active Users', analyticsData.users.active, '', timeRange],
        ['New Users', analyticsData.users.new, '', timeRange],
        // Property metrics
        ['Total Properties', analyticsData.properties.total, `${analyticsData.properties.growth}%`, timeRange],
        ['Listed Properties', analyticsData.properties.listed, '', timeRange],
        ['Verified Properties', analyticsData.properties.verified, '', timeRange],
        // Revenue metrics
        ['Monthly Revenue', `GH₵ ${analyticsData.revenue.monthly.toLocaleString()}`, `${analyticsData.revenue.growth}%`, timeRange],
        ['Total Revenue', `GH₵ ${analyticsData.revenue.total.toLocaleString()}`, '', timeRange],
        // Engagement metrics
        ['Page Views', analyticsData.engagement.pageViews, '', timeRange],
        ['Sessions', analyticsData.engagement.sessions, '', timeRange],
        ['Avg Session Duration', analyticsData.engagement.avgDuration, '', timeRange],
        // Performance metrics
        ['User Registration Rate', '87%', '', timeRange],
        ['Property Verification Rate', '92%', '', timeRange],
        ['Customer Satisfaction', '94%', '', timeRange],
        ['Response Time (Support)', '78%', '', timeRange],
        ['Platform Uptime', '99.9%', '', timeRange],
        // Recent activities
        ...recentActivities.map(activity => [
          activity.title,
          activity.description,
          activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : 'Unknown date',
          'Recent Activity'
        ]),
        // Top locations
        ...topLocations.map(location => [
          location.location,
          `${location.count} properties`,
          '',
          'Top Location'
        ])
      ].map(row => row.join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      toast({
        title: "Export Successful",
        description: `Analytics report for ${timeRange} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export analytics data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Reports</h2>
          <p className="text-gray-600">Platform performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={refreshAnalytics} 
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={exportAnalyticsData} 
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading analytics data...</span>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.users.total)}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(analyticsData.users.growth)}`}>
                {getGrowthIcon(analyticsData.users.growth)}
                <span className="ml-1">+{analyticsData.users.growth}% from last month</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium">{formatNumber(analyticsData.users.new)}</span> new this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.properties.total)}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(analyticsData.properties.growth)}`}>
                {getGrowthIcon(analyticsData.properties.growth)}
                <span className="ml-1">+{analyticsData.properties.growth}% from last month</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium">{formatNumber(analyticsData.properties.verified)}</span> verified properties
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analyticsData.revenue.monthly)}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(analyticsData.revenue.growth)}`}>
                {getGrowthIcon(analyticsData.revenue.growth)}
                <span className="ml-1">+{analyticsData.revenue.growth}% from last month</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Total: <span className="font-medium">{formatCurrency(analyticsData.revenue.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.engagement.pageViews)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="ml-1">+18% from last month</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Avg. session: <span className="font-medium">{analyticsData.engagement.avgDuration}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts and Analytics */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Metrics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Key performance indicators for the current period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">User Registration Rate</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Property Verification Rate</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Customer Satisfaction</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Response Time (Support)</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Platform Uptime</span>
                  <span>99.9%</span>
                </div>
                <Progress value={99.9} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`${getActivityColor(activity.type)} mt-1`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No recent activities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Locations and Status Overview */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Locations
              </CardTitle>
              <CardDescription>Most popular property locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLocations.length > 0 ? (
                  topLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{location.location}</p>
                          <p className="text-xs text-muted-foreground">{location.count} properties</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {location.count} properties
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No location data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>System Status Overview</CardTitle>
              <CardDescription>Current platform statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <span className="text-sm font-medium">{formatNumber(analyticsData.users.active)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Listed Properties</span>
                    <span className="text-sm font-medium">{formatNumber(analyticsData.properties.listed)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Verified Properties</span>
                    <span className="text-sm font-medium">{formatNumber(analyticsData.properties.verified)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sessions Today</span>
                    <span className="text-sm font-medium">{formatNumber(analyticsData.engagement.sessions)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Database: Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">API: Healthy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Storage: Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Email: Slow</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;