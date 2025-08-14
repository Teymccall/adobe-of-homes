
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Calendar, DollarSign, Home, MapPin } from 'lucide-react';

interface ApartmentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: {
    id: string;
    tenant: string | null;
    rent: number;
    status: string;
    lastPayment: string | null;
    phone: string | null;
  } | null;
}

const ApartmentViewDialog = ({ isOpen, onClose, apartment }: ApartmentViewDialogProps) => {
  if (!apartment) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'occupied':
        return <Badge variant="default" className="bg-green-500">Occupied</Badge>;
      case 'vacant':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Vacant</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home size={20} />
            Apartment {apartment.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge(apartment.status)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Monthly Rent:</span>
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span className="font-medium">GH₵ {apartment.rent.toLocaleString()}</span>
            </div>
          </div>

          {apartment.tenant ? (
            <>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Tenant Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <span>{apartment.tenant}</span>
                  </div>
                  {apartment.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <span>{apartment.phone}</span>
                    </div>
                  )}
                  {apartment.lastPayment && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span>Last payment: {apartment.lastPayment}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="border-t pt-4">
              <p className="text-muted-foreground text-center py-4">No tenant assigned</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApartmentViewDialog;
