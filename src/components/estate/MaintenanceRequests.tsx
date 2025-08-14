import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MaintenanceStats from './MaintenanceStats';
import MaintenanceTable from './MaintenanceTable';
import { mockMaintenanceRequests, filterMaintenanceRequests } from './MaintenanceUtils';
import MaintenanceRequestForm from './forms/MaintenanceRequestForm';
import EstateReportsPrintDialog from './dialogs/EstateReportsPrintDialog';
import { generateEstatePrintContent, createEstatePrintWindow } from './utils/EstatePrintUtils';

interface MaintenanceRequestsProps {
  searchTerm: string;
}

const MaintenanceRequests = ({ searchTerm }: MaintenanceRequestsProps) => {
  const { toast } = useToast();
  const [requests, setRequests] = useState(mockMaintenanceRequests);
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('current-month');
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    pending: true,
    progress: true,
    completed: true
  });
  
  const filteredRequests = filterMaintenanceRequests(requests, searchTerm);

  const handleAddRequest = () => {
    setShowRequestForm(true);
  };

  const handleRequestSubmit = (newRequest: any) => {
    setRequests([...requests, newRequest]);
  };

  const handleViewRequest = (requestId: string) => {
    toast({
      title: "View Request",
      description: `Opening details for request ${requestId}`,
    });
  };

  const handleAssignRequest = (requestId: string) => {
    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'in_progress', assignedTo: 'Available Technician' }
        : request
    );
    setRequests(updatedRequests);
    
    toast({
      title: "Request Assigned",
      description: `Request ${requestId} has been assigned to a technician`,
    });
  };

  const handlePrint = () => {
    const maintenanceStats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      inProgressRequests: requests.filter(r => r.status === 'in_progress').length,
      completedRequests: requests.filter(r => r.status === 'completed').length,
      requests: requests
    };

    const { title, data, timeRangeLabel } = generateEstatePrintContent(
      'maintenance',
      selectedSections,
      selectedTimeRange,
      maintenanceStats
    );

    createEstatePrintWindow(title, data, timeRangeLabel);
    setShowPrintDialog(false);
    
    toast({
      title: "Report Generated",
      description: "Maintenance requests report has been generated and sent to printer.",
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
        <h2 className="text-xl font-semibold">Maintenance Requests</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPrintDialog(true)}>
            <Printer className="mr-2" size={16} />
            Print Report
          </Button>
          <Button onClick={handleAddRequest}>
            <Plus className="mr-2" size={16} />
            Add Request
          </Button>
        </div>
      </div>

      <MaintenanceStats requests={requests} />
      <MaintenanceTable 
        requests={filteredRequests} 
        onView={handleViewRequest}
        onAssign={handleAssignRequest}
      />

      <MaintenanceRequestForm 
        open={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSubmit={handleRequestSubmit}
      />

      <EstateReportsPrintDialog
        open={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        reportType="maintenance"
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
        selectedSections={selectedSections}
        onSectionChange={handleSectionChange}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default MaintenanceRequests;
