import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaymentViewDialog from '../dialogs/PaymentViewDialog';

interface PaymentTableProps {
  payments: any[];
  onMarkPaid: (paymentId: string) => void;
  onViewPayment: (paymentId: string) => void;
}

const PaymentTable = ({ payments, onMarkPaid, onViewPayment }: PaymentTableProps) => {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
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

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case 'rent':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Rent</Badge>;
      case 'deposit':
        return <Badge variant="outline" className="border-green-500 text-green-600">Deposit</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Maintenance</Badge>;
      case 'utility':
        return <Badge variant="outline" className="border-purple-500 text-purple-600">Utility</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Payment Report</title>
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
            <h1>Payment Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Tenant</th>
                <th>Apartment</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Status</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              ${payments.map(payment => `
                <tr>
                  <td>${payment.id}</td>
                  <td>${payment.tenant}</td>
                  <td>${payment.apartment}</td>
                  <td>${payment.type}</td>
                  <td>GH₵ ${payment.amount.toLocaleString()}</td>
                  <td>${payment.dueDate}</td>
                  <td>${payment.paidDate || 'Not paid'}</td>
                  <td class="status-${payment.status}">${payment.status}</td>
                  <td>${payment.method || 'N/A'}</td>
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
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payment Records</CardTitle>
            <Button variant="outline" onClick={handlePrint}>
              Print Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Apartment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.tenant}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.apartment}</Badge>
                  </TableCell>
                  <TableCell>{getPaymentTypeBadge(payment.type)}</TableCell>
                  <TableCell className="font-medium">
                    GH₵ {payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewPayment(payment)}
                      >
                        View
                      </Button>
                      {payment.status !== 'paid' && (
                        <Button 
                          size="sm"
                          onClick={() => onMarkPaid(payment.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaymentViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        payment={selectedPayment}
      />
    </>
  );
};

export default PaymentTable;
