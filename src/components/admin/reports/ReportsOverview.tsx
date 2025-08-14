
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const overviewData = [
  { name: 'Properties', count: 155, color: '#8884d8' },
  { name: 'Home Owners', count: 32, color: '#82ca9d' },
  { name: 'Transactions', count: 274, color: '#ffc658' },
  { name: 'Estate Users', count: 8, color: '#ff7300' },
];

const ReportsOverview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">155</div>
            <p className="text-xs text-green-600">↑ 12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Home Owners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-green-600">↑ 6% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">274</div>
            <p className="text-xs text-green-600">↑ 18% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Estate Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-green-600">↑ 14% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Activity Overview</CardTitle>
          <CardDescription>Current status across all platform segments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">New Property Listed</p>
                  <p className="text-sm text-gray-500">2-bedroom apartment in Accra</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Home Owner Verified</p>
                  <p className="text-sm text-gray-500">Kofi Mensah completed verification</p>
                </div>
                <span className="text-xs text-gray-400">4 hours ago</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Transaction Completed</p>
                  <p className="text-sm text-gray-500">Rental agreement signed</p>
                </div>
                <span className="text-xs text-gray-400">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Property Verification Rate</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Property Price</span>
                <span className="font-medium">GH₵ 215,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Growth</span>
                <span className="font-medium text-green-600">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Home Owners</span>
                <span className="font-medium">28</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsOverview;
