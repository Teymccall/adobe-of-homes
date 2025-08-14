
import React from 'react';
import { Zap, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtilityBill } from './UtilityHelpers';

interface UtilityStatsProps {
  bills: UtilityBill[];
}

const UtilityStats = ({ bills }: UtilityStatsProps) => {
  const stats = {
    totalElectricity: bills.filter(b => b.type === 'electricity').reduce((sum, b) => sum + b.amount, 0),
    totalWater: bills.filter(b => b.type === 'water').reduce((sum, b) => sum + b.amount, 0),
    totalPending: bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0),
    totalOverdue: bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Electricity Bills</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            GH₵ {stats.totalElectricity.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Water Bills</CardTitle>
          <Droplets className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            GH₵ {stats.totalWater.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
          <div className="h-4 w-4 bg-yellow-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            GH₵ {stats.totalPending.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Bills</CardTitle>
          <div className="h-4 w-4 bg-red-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            GH₵ {stats.totalOverdue.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityStats;
