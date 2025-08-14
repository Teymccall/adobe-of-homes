
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CreditCard, User, Home, Calendar, DollarSign } from 'lucide-react';

interface PaymentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
    id: string;
    tenant: string;
    apartment: string;
    type: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: string;
    method?: string;
  } | null;
}

const PaymentViewDialog = ({ isOpen, onClose, payment }: PaymentViewDialogProps) => {
  if (!payment) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Payment Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Payment Information</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment ID:</span>
                <span className="font-medium">{payment.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Type:</span>
                {getPaymentTypeBadge(payment.type)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Amount:</span>
                <div className="flex items-center gap-1">
                  <DollarSign size={16} />
                  <span className="font-medium">GH₵ {payment.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status:</span>
                {getStatusBadge(payment.status)}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Tenant & Property</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-muted-foreground" />
                <span>{payment.tenant}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={16} className="text-muted-foreground" />
                <span>Apartment {payment.apartment}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Dates</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span>Due: {payment.dueDate}</span>
              </div>
              {payment.paidDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-green-600" />
                  <span>Paid: {payment.paidDate}</span>
                </div>
              )}
              {payment.method && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Method:</span>
                  <span className="font-medium">{payment.method}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentViewDialog;
