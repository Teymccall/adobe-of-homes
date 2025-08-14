import React, { useState } from 'react';
import { Printer, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { transactionData } from './ReportsDataUtils';
import EstateUserDetailReports from './EstateUserDetailReports';

interface TransactionReportsProps {
  onPrintReport: (reportType: string) => void;
}

const TransactionReports = ({ onPrintReport }: TransactionReportsProps) => {
  const [showEstateDetails, setShowEstateDetails] = useState(false);
  const [selectedEstateUser, setSelectedEstateUser] = useState<string>('');

  const handleEstateUserSelect = (userId: string, userName: string) => {
    setSelectedEstateUser(userId);
    setShowEstateDetails(true);
  };

  const handleBackToOverview = () => {
    setShowEstateDetails(false);
    setSelectedEstateUser('');
  };

  if (showEstateDetails) {
    return (
      <EstateUserDetailReports 
        userId={selectedEstateUser}
        onBack={handleBackToOverview}
        onPrintReport={onPrintReport}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transaction Analytics</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Estate User Details
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleEstateUserSelect('est-001', 'Royal Palms Estate')}>
                Royal Palms Estate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEstateUserSelect('est-002', 'Golden Gate Residences')}>
                Golden Gate Residences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEstateUserSelect('est-003', 'Sunset Heights')}>
                Sunset Heights
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEstateUserSelect('est-004', 'Ocean View Apartments')}>
                Ocean View Apartments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEstateUserSelect('est-005', 'Green Valley Estate')}>
                Green Valley Estate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => onPrintReport('transactions')}>
            <Printer className="mr-2" size={16} />
            Print Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
            <p className="text-xs text-green-600">↑ 15% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Rental Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">174</div>
            <p className="text-xs text-green-600">↑ 20% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GH₵ 283,000</div>
            <p className="text-xs text-green-600">↑ 22% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12%</div>
            <p className="text-xs text-green-600">↑ 2% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales & Rentals</CardTitle>
            <CardDescription>Transaction volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                  <Bar dataKey="rentals" fill="#82ca9d" name="Rentals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`GH₵ ${value.toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Detailed monthly breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Month</th>
                  <th className="text-right p-3">Sales</th>
                  <th className="text-right p-3">Rentals</th>
                  <th className="text-right p-3">Revenue</th>
                  <th className="text-right p-3">Growth</th>
                </tr>
              </thead>
              <tbody>
                {transactionData.map((item, index) => (
                  <tr key={item.name} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-right">{item.sales}</td>
                    <td className="p-3 text-right">{item.rentals}</td>
                    <td className="p-3 text-right">GH₵ {item.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right text-green-600">
                      {index > 0 ? `+${Math.round(((item.revenue - transactionData[index-1].revenue) / transactionData[index-1].revenue) * 100)}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionReports;
