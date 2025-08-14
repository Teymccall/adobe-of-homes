
import { Zap, Droplets, Wifi, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface UtilityBill {
  id: string;
  apartment: string;
  tenant: string;
  type: string;
  amount: number;
  units: number;
  month: string;
  dueDate: string;
  status: string;
  meterReading: string;
}

export const getUtilityIcon = (type: string) => {
  switch (type) {
    case 'electricity':
      return <Zap size={16} className="text-yellow-500" />;
    case 'water':
      return <Droplets size={16} className="text-blue-500" />;
    case 'internet':
      return <Wifi size={16} className="text-purple-500" />;
    case 'waste':
      return <Trash2 size={16} className="text-green-500" />;
    default:
      return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge variant="default" className="bg-green-500">Paid</Badge>;
    case 'pending':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
    case 'overdue':
      return <Badge variant="destructive">Overdue</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const filterUtilityBills = (bills: UtilityBill[], searchTerm: string) => {
  return bills.filter(bill =>
    bill.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const calculateUtilityStats = (bills: UtilityBill[]) => {
  return {
    totalElectricity: bills.filter(b => b.type === 'electricity').reduce((sum, b) => sum + b.amount, 0),
    totalWater: bills.filter(b => b.type === 'water').reduce((sum, b) => sum + b.amount, 0),
    totalPending: bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0),
    totalOverdue: bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0)
  };
};

export const generateUtilityBillsPrintContent = (bills: UtilityBill[]) => {
  return `
    <html>
      <head>
        <title>Utility Bills Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 20px; }
          .status-paid { color: green; font-weight: bold; }
          .status-pending { color: orange; font-weight: bold; }
          .status-overdue { color: red; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Utility Bills Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Apartment</th>
              <th>Tenant</th>
              <th>Utility Type</th>
              <th>Usage</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${bills.map(bill => `
              <tr>
                <td>${bill.id}</td>
                <td>${bill.apartment}</td>
                <td>${bill.tenant}</td>
                <td>${bill.type}</td>
                <td>${bill.units} units (${bill.meterReading})</td>
                <td>GH₵ ${bill.amount.toLocaleString()}</td>
                <td>${bill.dueDate}</td>
                <td class="status-${bill.status}">${bill.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
};
