
import React, { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import GenerateBillForm from './forms/GenerateBillForm';
import UtilityStats from './utility/UtilityStats';
import UtilityBillsTable from './utility/UtilityBillsTable';
import { UtilityBill, filterUtilityBills } from './utility/UtilityHelpers';
import EstateReportsPrintDialog from './dialogs/EstateReportsPrintDialog';
import { generateEstatePrintContent, createEstatePrintWindow } from './utils/EstatePrintUtils';

interface UtilityBillsProps {
  searchTerm: string;
}

const UtilityBills = ({ searchTerm }: UtilityBillsProps) => {
  const { toast } = useToast();
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  
  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('current-month');
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    electricity: true,
    water: true,
    pending: true
  });
  
  // Mock utility bills data
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>([
    {
      id: 'UTIL001',
      apartment: 'A101',
      tenant: 'John Doe',
      type: 'electricity',
      amount: 120,
      units: 85,
      month: 'June 2024',
      dueDate: '2024-06-25',
      status: 'pending',
      meterReading: '1250 kWh'
    },
    {
      id: 'UTIL002',
      apartment: 'A101',
      tenant: 'John Doe',
      type: 'water',
      amount: 150,
      units: 12,
      month: 'June 2024',
      dueDate: '2024-06-20',
      status: 'pending',
      meterReading: '45 m³'
    },
    {
      id: 'UTIL003',
      apartment: 'A103',
      tenant: 'Jane Smith',
      type: 'electricity',
      amount: 95,
      units: 68,
      month: 'June 2024',
      dueDate: '2024-06-25',
      status: 'paid',
      meterReading: '980 kWh'
    },
    {
      id: 'UTIL004',
      apartment: 'A103',
      tenant: 'Jane Smith',
      type: 'water',
      amount: 130,
      units: 10,
      month: 'June 2024',
      dueDate: '2024-06-20',
      status: 'paid',
      meterReading: '38 m³'
    },
    {
      id: 'UTIL005',
      apartment: 'A104',
      tenant: 'Mike Johnson',
      type: 'electricity',
      amount: 180,
      units: 125,
      month: 'June 2024',
      dueDate: '2024-06-25',
      status: 'overdue',
      meterReading: '1450 kWh'
    }
  ]);

  const filteredBills = filterUtilityBills(utilityBills, searchTerm);

  const handleGenerateBill = (billData: any) => {
    setUtilityBills(prevBills => [...prevBills, billData]);
    setShowGenerateForm(false);
  };

  const handleViewBill = (billId: string) => {
    toast({
      title: "View Bill Details",
      description: `Opening detailed view for bill ${billId}`,
    });
  };

  const handleSendBill = (billId: string) => {
    toast({
      title: "Send Bill",
      description: `Sending bill ${billId} to tenant via email/SMS`,
    });
  };

  const handlePrint = () => {
    const utilityStats = {
      totalBills: utilityBills.length,
      totalAmount: utilityBills.reduce((sum, bill) => sum + bill.amount, 0),
      pendingBills: utilityBills.filter(b => b.status === 'pending').length,
      overdueBills: utilityBills.filter(b => b.status === 'overdue').length,
      electricityBills: utilityBills.filter(b => b.type === 'electricity').length,
      waterBills: utilityBills.filter(b => b.type === 'water').length,
      bills: utilityBills
    };

    const { title, data, timeRangeLabel } = generateEstatePrintContent(
      'utilities',
      selectedSections,
      selectedTimeRange,
      utilityStats
    );

    createEstatePrintWindow(title, data, timeRangeLabel);
    setShowPrintDialog(false);
    
    toast({
      title: "Report Generated",
      description: "Utility bills report has been generated and sent to printer.",
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
        <h2 className="text-xl font-semibold">Utility Bills Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPrintDialog(true)}>
            <Printer className="mr-2" size={16} />
            Print Report
          </Button>
          <Button onClick={() => setShowGenerateForm(true)}>
            <Plus className="mr-2" size={16} />
            Generate Bill
          </Button>
        </div>
      </div>

      <UtilityStats bills={utilityBills} />

      <UtilityBillsTable
        bills={filteredBills}
        onViewBill={handleViewBill}
        onSendBill={handleSendBill}
      />

      <GenerateBillForm
        open={showGenerateForm}
        onClose={() => setShowGenerateForm(false)}
        onSubmit={handleGenerateBill}
      />

      <EstateReportsPrintDialog
        open={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        reportType="utilities"
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
        selectedSections={selectedSections}
        onSectionChange={handleSectionChange}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default UtilityBills;
