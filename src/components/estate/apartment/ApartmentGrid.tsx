
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApartmentCard from './ApartmentCard';
import ApartmentViewDialog from '../dialogs/ApartmentViewDialog';

interface ApartmentGridProps {
  apartments: Array<{
    id: string;
    tenant: string | null;
    rent: number;
    status: string;
    lastPayment: string | null;
    phone: string | null;
  }>;
  onViewDetails: (apartmentId: string) => void;
  onAddTenant: (apartmentId: string) => void;
}

const ApartmentGrid = ({ apartments, onViewDetails, onAddTenant }: ApartmentGridProps) => {
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewDetails = (apartment: any) => {
    setSelectedApartment(apartment);
    setIsViewDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Apartment Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apartments.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onViewDetails={handleViewDetails}
                onAddTenant={onAddTenant}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <ApartmentViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        apartment={selectedApartment}
      />
    </>
  );
};

export default ApartmentGrid;
