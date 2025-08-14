
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  revenue: number;
  occupancy: number;
  maintenance: number;
}

interface EstateOccupancyChartProps {
  monthlyData: MonthlyData[];
}

const EstateOccupancyChart = ({ monthlyData }: EstateOccupancyChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy & Maintenance Trends</CardTitle>
        <CardDescription>Monthly occupancy rates and maintenance requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="occupancy" fill="#8884d8" name="Occupancy %" />
              <Bar yAxisId="right" dataKey="maintenance" fill="#82ca9d" name="Maintenance Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstateOccupancyChart;
