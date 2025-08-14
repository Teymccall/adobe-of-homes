
import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentStatsProps {
  payments: any[];
}

const PaymentStats = ({ payments }: PaymentStatsProps) => {
  const paymentStats = {
    totalCollected: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    totalPending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    totalOverdue: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collected This Month</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            GH₵ {paymentStats.totalCollected.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            GH₵ {paymentStats.totalPending.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            GH₵ {paymentStats.totalOverdue.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStats;
