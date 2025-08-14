
import React from 'react';
import { Building, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EstateOverviewStatsProps {
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  maintenanceRequests: number;
}

const EstateOverviewStats = ({ 
  totalUnits, 
  occupiedUnits, 
  monthlyRevenue, 
  maintenanceRequests 
}: EstateOverviewStatsProps) => {
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUnits}</div>
          <p className="text-xs text-muted-foreground">
            {occupiedUnits} occupied
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupancyRate}%</div>
          <p className="text-xs text-green-600">
            +2% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">GH₵ {monthlyRevenue.toLocaleString()}</div>
          <p className="text-xs text-green-600">
            +8% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maintenanceRequests}</div>
          <p className="text-xs text-red-600">
            2 pending resolution
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstateOverviewStats;
