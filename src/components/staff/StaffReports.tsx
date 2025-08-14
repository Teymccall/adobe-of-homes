import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  FileText, 
  Download, 
  Calendar,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

interface StaffReportsProps {
  canAccess: (permission: string) => boolean;
}

interface ReportData {
  totalProperties: number;
  verifiedProperties: number;
  pendingVerifications: number;
  totalUsers: number;
  activeUsers: number;
  recentActivities: any[];
  topLocations: any[];
  systemHealth: {
    userEngagement: number;
    systemUptime: number;
    responseTime: number;
    errorRate: number;
  };
}

const StaffReports = ({ canAccess }: StaffReportsProps) => {
  const [reportData, setReportData] = useState<ReportData>({
    totalProperties: 0,
    verifiedProperties: 0,
    pendingVerifications: 0,
    totalUsers: 0,
    activeUsers: 0,
    recentActivities: [],
    topLocations: [],
    systemHealth: {
      userEngagement: 87,
      systemUptime: 99.9,
      responseTime: 85,
      errorRate: 0.1
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        const [adminStats, analyticsData] = await Promise.all([
          adminService.getAdminStats(),
          adminService.getAnalyticsData()
        ]);

        setReportData({
          totalProperties: adminStats.totalProperties,
          verifiedProperties: adminStats.activeListings,
          pendingVerifications: adminStats.verificationRequests,
          totalUsers: adminStats.totalUsers,
          activeUsers: adminStats.totalUsers, // You might want to calculate this differently
          recentActivities: analyticsData.recentActivities || [],
          topLocations: analyticsData.topLocations || [],
          systemHealth: adminStats.systemHealth
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          title: "Error",
          description: "Failed to load report data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [toast]);

  const exportReportData = async (reportType: string) => {
    setIsExporting(true);
    try {
      // Generate CSV content
      let csvContent = '';
      
      switch (reportType) {
        case 'properties':
          csvContent = `Property Report\n`;
          csvContent += `Total Properties,${reportData.totalProperties}\n`;
          csvContent += `Verified Properties,${reportData.verifiedProperties}\n`;
          csvContent += `Pending Verifications,${reportData.pendingVerifications}\n`;
          break;
        case 'users':
          csvContent = `User Report\n`;
          csvContent += `Total Users,${reportData.totalUsers}\n`;
          csvContent += `Active Users,${reportData.activeUsers}\n`;
          break;
        case 'activities':
          csvContent = `Recent Activities Report\n`;
          csvContent += `Activity,Type,Description,Date\n`;
          reportData.recentActivities.forEach(activity => {
            csvContent += `${activity.title},${activity.type},${activity.description},${activity.timestamp}\n`;
          });
          break;
        case 'locations':
          csvContent = `Top Locations Report\n`;
          csvContent += `Location,Property Count\n`;
          reportData.topLocations.forEach(location => {
            csvContent += `${location.location},${location.count}\n`;
          });
          break;
        default:
          csvContent = `System Report\n`;
          csvContent += `Total Properties,${reportData.totalProperties}\n`;
          csvContent += `Total Users,${reportData.totalUsers}\n`;
          csvContent += `System Uptime,${reportData.systemHealth.systemUptime}%\n`;
          csvContent += `User Engagement,${reportData.systemHealth.userEngagement}%\n`;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${reportType} report has been exported successfully.`,
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 size={24} />
            Reports & Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive system reports and analytics for staff members
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => exportReportData('system')}
            disabled={isExporting}
          >
            <Download className="mr-2" size={16} />
            {isExporting ? 'Exporting...' : 'Export All'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {reportData.pendingVerifications} pending verification
            </p>
            <Progress 
              value={(reportData.verifiedProperties / reportData.totalProperties) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {reportData.activeUsers} active users
            </p>
            <Progress 
              value={(reportData.activeUsers / reportData.totalUsers) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            {getSystemHealthIcon(reportData.systemHealth.systemUptime)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSystemHealthColor(reportData.systemHealth.systemUptime)}`}>
              {reportData.systemHealth.systemUptime}%
            </div>
            <p className="text-xs text-muted-foreground">
              Uptime
            </p>
            <Progress value={reportData.systemHealth.systemUptime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.recentActivities.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent activities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">User Engagement</span>
                  <span className="text-sm font-medium">{reportData.systemHealth.userEngagement}%</span>
                </div>
                <Progress value={reportData.systemHealth.userEngagement} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Time</span>
                  <span className="text-sm font-medium">{reportData.systemHealth.responseTime}ms</span>
                </div>
                <Progress value={reportData.systemHealth.responseTime} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Error Rate</span>
                  <span className="text-sm font-medium">{reportData.systemHealth.errorRate}%</span>
                </div>
                <Progress value={reportData.systemHealth.errorRate} />
              </CardContent>
            </Card>

            {/* Top Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search size={20} />
                  Top Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.topLocations.slice(0, 5).map((location, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{location.location}</span>
                      <Badge variant="secondary">{location.count} properties</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Property Statistics</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportReportData('properties')}
                  disabled={isExporting}
                >
                  <Download className="mr-2" size={14} />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{reportData.totalProperties}</div>
                  <div className="text-sm text-muted-foreground">Total Properties</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{reportData.verifiedProperties}</div>
                  <div className="text-sm text-muted-foreground">Verified Properties</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{reportData.pendingVerifications}</div>
                  <div className="text-sm text-muted-foreground">Pending Verification</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Statistics</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportReportData('users')}
                  disabled={isExporting}
                >
                  <Download className="mr-2" size={14} />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{reportData.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{reportData.activeUsers}</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Activities</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportReportData('activities')}
                  disabled={isExporting}
                >
                  <Download className="mr-2" size={14} />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.recentActivities.slice(0, 10).map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-xs text-muted-foreground">{activity.description}</div>
                    </div>
                    <div className="flex-shrink-0 text-xs text-muted-foreground">
                      {activity.timestamp instanceof Date 
                        ? activity.timestamp.toLocaleDateString()
                        : new Date(activity.timestamp).toLocaleDateString()
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffReports; 