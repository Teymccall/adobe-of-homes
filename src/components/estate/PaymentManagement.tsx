import React, { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PaymentStats from './payments/PaymentStats';
import PaymentTable from './payments/PaymentTable';
import { mockPaymentData, filterPayments } from './payments/PaymentUtils';
import PaymentRecordForm from './forms/PaymentRecordForm';
import EstateReportsPrintDialog from './dialogs/EstateReportsPrintDialog';
import { generateEstatePrintContent, createEstatePrintWindow } from './utils/EstatePrintUtils';

interface PaymentManagementProps {
  searchTerm: string;
}

const PaymentManagement = ({ searchTerm }: PaymentManagementProps) => {
  const { toast } = useToast();
  const [payments, setPayments] = useState(mockPaymentData);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('current-month');
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    pending: true,
    paid: true,
    overdue: true
  });
  
  const filteredPayments = filterPayments(payments, searchTerm);

  const handleRecordPayment = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = (newPayment: any) => {
    setPayments([...payments, newPayment]);
  };

  const handleMarkPaid = (paymentId: string) => {
    const updatedPayments = payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
        : payment
    );
    setPayments(updatedPayments);
    
    toast({
      title: "Payment Marked as Paid",
      description: `Payment ${paymentId} has been marked as paid`,
    });
  };

  const handleViewPayment = (paymentId: string) => {
    toast({
      title: "View Payment Details",
      description: `Opening details for payment ${paymentId}`,
    });
  };

  const handlePrint = () => {
    const paymentStats = {
      totalPayments: payments.length,
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: payments.filter(p => p.status === 'pending').length,
      overduePayments: payments.filter(p => p.status === 'overdue').length,
      payments: payments
    };

    const { title, data, timeRangeLabel } = generateEstatePrintContent(
      'payments',
      selectedSections,
      selectedTimeRange,
      paymentStats
    );

    createEstatePrintWindow(title, data, timeRangeLabel);
    setShowPrintDialog(false);
    
    toast({
      title: "Report Generated",
      description: "Payment management report has been generated and sent to printer.",
    });
  };

  const handleSectionChange = (section: string, checked: boolean) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: checked
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payment Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPrintDialog(true)}>
            <Printer className="mr-2" size={16} />
            Print Report
          </Button>
          <Button onClick={handleRecordPayment}>
            <Plus className="mr-2" size={16} />
            Record Payment
          </Button>
        </div>
      </div>

      <PaymentStats payments={payments} />
      <PaymentTable 
        payments={filteredPayments} 
        onMarkPaid={handleMarkPaid}
        onViewPayment={handleViewPayment}
      />

      <PaymentRecordForm 
        open={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSubmit={handlePaymentSubmit}
      />

      <EstateReportsPrintDialog
        open={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        reportType="payments"
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
        selectedSections={selectedSections}
        onSectionChange={handleSectionChange}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default PaymentManagement;
