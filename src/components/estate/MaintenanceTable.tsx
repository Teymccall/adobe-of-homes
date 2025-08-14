import React from 'react';
import { Wrench, User, Droplets, Zap, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MaintenanceRequest {
  id: string;
  apartment: string;
  tenant: string;
  issue: string;
  category: string;
  priority: string;
  status: string;
  dateRequested: string;
  assignedTo: string | null;
  estimatedCost: number;
  description: string;
}

interface MaintenanceTableProps {
  requests: MaintenanceRequest[];
  onView?: (requestId: string) => void;
  onAssign?: (requestId: string) => void;
}

const MaintenanceTable = ({ requests, onView, onAssign }: MaintenanceTableProps) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plumbing':
        return <Droplets size={16} className="text-blue-500" />;
      case 'electrical':
        return <Zap size={16} className="text-yellow-500" />;
      case 'hvac':
        return <div className="w-4 h-4 bg-green-500 rounded-full" />;
      default:
        return <Wrench size={16} className="text-gray-500" />;
    }
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Maintenance Requests Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .priority-high { color: red; font-weight: bold; }
            .priority-medium { color: orange; font-weight: bold; }
            .priority-low { color: gray; }
            .status-pending { color: orange; }
            .status-in_progress { color: blue; }
            .status-completed { color: green; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Maintenance Requests Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Apartment</th>
                <th>Tenant</th>
                <th>Issue</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date Requested</th>
                <th>Assigned To</th>
                <th>Estimated Cost</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${requests.map(request => `
                <tr>
                  <td>${request.id}</td>
                  <td>${request.apartment}</td>
                  <td>${request.tenant}</td>
                  <td>${request.issue}</td>
                  <td>${request.category}</td>
                  <td class="priority-${request.priority}">${request.priority}</td>
                  <td class="status-${request.status}">${request.status}</td>
                  <td>${request.dateRequested}</td>
                  <td>${request.assignedTo || 'Unassigned'}</td>
                  <td>GH₵ ${request.estimatedCost.toLocaleString()}</td>
                  <td>${request.description}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Maintenance Requests</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2" size={16} />
                  Print Report
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print Maintenance Report</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Apartment</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{request.apartment}</div>
                    <div className="text-sm text-muted-foreground">{request.tenant}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium">{request.issue}</div>
                    <div className="text-sm text-muted-foreground truncate">{request.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(request.category)}
                    <span className="capitalize">{request.category}</span>
                  </div>
                </TableCell>
                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  {request.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span className="text-sm">{request.assignedTo}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  GH₵ {request.estimatedCost.toLocaleString()}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onView?.(request.id)}
                          >
                            View
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Request Details</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {request.status === 'pending' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm"
                              onClick={() => onAssign?.(request.id)}
                            >
                              Assign
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Assign to Technician</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MaintenanceTable;
