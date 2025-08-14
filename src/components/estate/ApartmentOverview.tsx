
import React, { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ApartmentStats from './apartment/ApartmentStats';
import ApartmentGrid from './apartment/ApartmentGrid';
import { mockApartmentData, filterApartments } from './apartment/ApartmentUtils';
import ApartmentForm from './forms/ApartmentForm';
import EstateReportsPrintDialog from './dialogs/EstateReportsPrintDialog';
import { generateEstatePrintContent, createEstatePrintWindow } from './utils/EstatePrintUtils';

interface ApartmentOverviewProps {
  searchTerm: string;
}

const ApartmentOverview = ({ searchTerm }: ApartmentOverviewProps) => {
  const { toast } = useToast();
  const [apartments, setApartments] = useState(mockApartmentData);
  const [showApartmentForm, setShowApartmentForm] = useState(false);
  const [editingApartment, setEditingApartment] = useState<any>(null);
  
  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('current-month');
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    occupied: true,
    vacant: true,
    maintenance: true
  });

  const filteredApartments = filterApartments(apartments, searchTerm);

  const handleAddApartment = () => {
    setEditingApartment(null);
    setShowApartmentForm(true);
  };

  const handleEditApartment = (apartment: any) => {
    setEditingApartment(apartment);
    setShowApartmentForm(true);
  };

  const handleApartmentSubmit = (apartmentData: any) => {
    if (editingApartment) {
      setApartments(apartments.map(a => a.id === editingApartment.id ? apartmentData : a));
      toast({
        title: "Apartment Updated",
        description: "Apartment details have been updated successfully.",
      });
    } else {
      setApartments([...apartments, apartmentData]);
      toast({
        title: "Apartment Added",
        description: "New apartment has been added successfully.",
      });
    }
    setShowApartmentForm(false);
  };

  const handleViewDetails = (apartmentId: string) => {
    toast({
      title: "View Apartment Details",
      description: `Opening detailed view for apartment ${apartmentId}`,
    });
  };

  const handleAddTenant = (apartmentId: string) => {
    toast({
      title: "Add Tenant",
      description: `Opening tenant form for apartment ${apartmentId}`,
    });
  };

  const handlePrint = () => {
    const apartmentStats = {
      totalApartments: apartments.length,
      occupiedApartments: apartments.filter(a => a.status === 'occupied').length,
      vacantApartments: apartments.filter(a => a.status === 'vacant').length,
      maintenanceApartments: apartments.filter(a => a.status === 'maintenance').length,
      apartments: apartments
    };

    const { title, data, timeRangeLabel } = generateEstatePrintContent(
      'apartments',
      selectedSections,
      selectedTimeRange,
      apartmentStats
    );

    createEstatePrintWindow(title, data, timeRangeLabel);
    setShowPrintDialog(false);
    
    toast({
      title: "Report Generated",
      description: "Apartment overview report has been generated and sent to printer.",
    });
  };

  const handleSectionChange = (section: string, checked: boolean) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: checked
    }));
  };

  // Calculate stats for ApartmentStats component
  const apartmentStats = {
    totalApartments: apartments.length,
    occupiedApartments: apartments.filter(a => a.status === 'occupied').length,
    vacantApartments: apartments.filter(a => a.status === 'vacant').length,
    totalRevenue: apartments.filter(a => a.status === 'occupied').reduce((sum, a) => sum + a.rent, 0),
    pendingPayments: apartments.filter(a => a.status === 'occupied' && !a.lastPayment).length,
    maintenanceRequests: apartments.filter(a => a.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Apartment Overview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPrintDialog(true)}>
            <Printer className="mr-2" size={16} />
            Print Report
          </Button>
          <Button onClick={handleAddApartment}>
            <Plus className="mr-2" size={16} />
            Add Apartment
          </Button>
        </div>
      </div>

      <ApartmentStats stats={apartmentStats} />
      <ApartmentGrid 
        apartments={filteredApartments}
        onViewDetails={handleViewDetails}
        onAddTenant={handleAddTenant}
      />

      <ApartmentForm 
        open={showApartmentForm}
        onClose={() => setShowApartmentForm(false)}
        onSubmit={handleApartmentSubmit}
      />

      <EstateReportsPrintDialog
        open={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        reportType="apartments"
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
        selectedSections={selectedSections}
        onSectionChange={handleSectionChange}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default ApartmentOverview;
