import React, { useState } from 'react';
import { Plus, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import TenantForm from './forms/TenantForm';
import TenantReportForm from './forms/TenantReportForm';
import TenantStats from './tenant/TenantStats';
import TenantTable from './tenant/TenantTable';
import { mockTenantData, filterTenants } from './tenant/TenantUtils';
import { TenantReport } from '@/data/types';
import EstateReportsPrintDialog from './dialogs/EstateReportsPrintDialog';
import { generateEstatePrintContent, createEstatePrintWindow, createIndividualTenantPrintWindow } from './utils/EstatePrintUtils';

interface TenantManagementProps {
  searchTerm: string;
}

const TenantManagement = ({ searchTerm }: TenantManagementProps) => {
  const { toast } = useToast();
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any>(null);
  const [selectedTenantForReport, setSelectedTenantForReport] = useState<any>(null);
  const [tenants, setTenants] = useState(mockTenantData);
  const [showInactive, setShowInactive] = useState(false);
  
  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('current-month');
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    active: true,
    inactive: false,
    overdue: true
  });

  const filteredTenants = filterTenants(tenants, searchTerm, showInactive);

  const handleAddTenant = () => {
    setEditingTenant(null);
    setShowTenantForm(true);
  };

  const handleViewTenant = (tenantId: string) => {
    toast({
      title: "View Tenant Details",
      description: `Opening detailed view for tenant ${tenantId}`,
    });
  };

  const handleEditTenant = (tenant: any) => {
    setEditingTenant(tenant);
    setShowTenantForm(true);
  };

  const handleTenantSubmit = (tenantData: any) => {
    if (editingTenant) {
      setTenants(tenants.map(t => t.id === editingTenant.id ? tenantData : t));
    } else {
      setTenants([...tenants, tenantData]);
    }
  };

  const handleToggleStatus = (tenant: any) => {
    const newStatus = tenant.status === 'inactive' ? 'active' : 'inactive';
    const updatedTenants = tenants.map(t => 
      t.id === tenant.id ? { ...t, status: newStatus } : t
    );
    setTenants(updatedTenants);
    
    toast({
      title: newStatus === 'inactive' ? "Tenant Deactivated" : "Tenant Reactivated",
      description: `${tenant.name} has been ${newStatus === 'inactive' ? 'deactivated' : 'reactivated'}.`,
    });
  };

  const handleAddReport = (tenant?: any) => {
    setSelectedTenantForReport(tenant);
    setShowReportForm(true);
  };

  const handleReportSubmit = (reportData: Partial<TenantReport>) => {
    // In a real app, this would save to a database
    console.log('Tenant report submitted:', reportData);
    toast({
      title: "Report Saved",
      description: "Tenant report has been saved and will be available for search by admins and home owners.",
    });
  };

  const handlePrintIndividualTenant = (tenant: any) => {
    createIndividualTenantPrintWindow(tenant);
    
    toast({
      title: "Individual Report Generated",
      description: `Individual tenant report for ${tenant.name} has been generated and sent to printer.`,
    });
  };

  const handlePrint = () => {
    const tenantStats = {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.status === 'active').length,
      overdueTenants: tenants.filter(t => t.status === 'overdue').length,
      inactiveTenants: tenants.filter(t => t.status === 'inactive').length,
      tenants: tenants
    };

    const { title, data, timeRangeLabel } = generateEstatePrintContent(
      'tenants',
      selectedSections,
      selectedTimeRange,
      tenantStats
    );

    createEstatePrintWindow(title, data, timeRangeLabel);
    setShowPrintDialog(false);
    
    toast({
      title: "Report Generated",
      description: "Tenant management report has been generated and sent to printer.",
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
        <h2 className="text-xl font-semibold">Tenant Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPrintDialog(true)}>
            <Printer className="mr-2" size={16} />
            Print Report
          </Button>
          <Button variant="outline" onClick={() => handleAddReport()}>
            <FileText className="mr-2" size={16} />
            Add Tenant Report
          </Button>
          <Button onClick={handleAddTenant}>
            <Plus className="mr-2" size={16} />
            Add New Tenant
          </Button>
        </div>
      </div>

      <TenantStats tenants={tenants} />
      
      <TenantTable 
        tenants={filteredTenants}
        onViewTenant={handleViewTenant}
        onEditTenant={handleEditTenant}
        onAddReport={handleAddReport}
        onToggleStatus={handleToggleStatus}
        onPrintIndividual={handlePrintIndividualTenant}
        showInactive={showInactive}
        onToggleShowInactive={setShowInactive}
      />

      <TenantForm 
        open={showTenantForm}
        onClose={() => setShowTenantForm(false)}
        onSubmit={handleTenantSubmit}
        tenant={editingTenant}
      />

      <TenantReportForm
        open={showReportForm}
        onClose={() => setShowReportForm(false)}
        onSubmit={handleReportSubmit}
        reporterType="estate_manager"
        reporterName="Estate Manager"
        reporterId="EM001"
        tenantId={selectedTenantForReport?.id}
        tenantName={selectedTenantForReport?.name}
      />

      <EstateReportsPrintDialog
        open={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        reportType="tenants"
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
        selectedSections={selectedSections}
        onSectionChange={handleSectionChange}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default TenantManagement;
