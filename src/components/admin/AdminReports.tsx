
import React, { useState } from 'react';
import ReportsOverview from './reports/ReportsOverview';
import PropertyReports from './reports/PropertyReports';
import TransactionReports from './reports/TransactionReports';
import HomeOwnerReports from './reports/HomeOwnerReports';
import EstateUserDetailReports from './reports/EstateUserDetailReports';
import ReportsPrintDialog from './reports/ReportsPrintDialog';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer } from 'lucide-react';

import TenantSearch from './TenantSearch';

const AdminReports = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('current-month');
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    monthly: true,
    breakdown: true,
    performance: false
  });

  const handlePrintReport = (reportType: string) => {
    setIsPrintDialogOpen(true);
  };

  const handlePrint = () => {
    console.log('Printing report...', { activeSection, selectedTimeRange, selectedSections });
    setIsPrintDialogOpen(false);
    // Here you would implement the actual print functionality
  };

  const handleSectionChange = (section: string, checked: boolean) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: checked
    }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <ReportsOverview />;
      case 'properties':
        return <PropertyReports onPrintReport={handlePrintReport} />;
      case 'transactions':
        return <TransactionReports onPrintReport={handlePrintReport} />;
      case 'homeowners':
        return <HomeOwnerReports onPrintReport={handlePrintReport} />;
      case 'estate':
        // For now, we'll show a placeholder since EstateUserDetailReports needs specific user data
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Select an estate user from the Transaction Reports to view detailed reports.</p>
          </div>
        );
      case 'tenant-search':
        return <TenantSearch userType="super_admin" />;
      default:
        return <ReportsOverview />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Reports & Analytics</h1>
        <Button variant="outline" onClick={() => handlePrintReport(activeSection)}>
          <Printer className="mr-2" size={16} />
          Print Report
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('properties')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === 'properties'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveSection('transactions')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === 'transactions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveSection('homeowners')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === 'homeowners'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Home Owners
            </button>
            <button
              onClick={() => setActiveSection('estate')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === 'estate'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Estate Users
            </button>
            <button
              onClick={() => setActiveSection('tenant-search')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === 'tenant-search'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Tenant Search
            </button>
          </div>
          <div className="p-6">
            {renderContent()}
          </div>
        </CardContent>
      </Card>

      <ReportsPrintDialog
        open={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        reportType={activeSection}
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
        selectedSections={selectedSections}
        onSectionChange={handleSectionChange}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default AdminReports;
