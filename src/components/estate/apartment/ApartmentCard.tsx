
import React from 'react';
import { User, Phone, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ApartmentCardProps {
  apartment: {
    id: string;
    tenant: string | null;
    rent: number;
    status: string;
    lastPayment: string | null;
    phone: string | null;
  };
  onViewDetails: (apartment: any) => void;
  onAddTenant: (apartmentId: string) => void;
}

const ApartmentCard = ({ apartment, onViewDetails, onAddTenant }: ApartmentCardProps) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{apartment.id}</CardTitle>
          {getStatusBadge(apartment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-muted-foreground" />
          <span className="font-medium">GH₵ {apartment.rent.toLocaleString()}/month</span>
        </div>
        
        {apartment.tenant ? (
          <>
            <div className="flex items-center gap-2">
              <User size={16} className="text-muted-foreground" />
              <span>{apartment.tenant}</span>
            </div>
            {apartment.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                <span className="text-sm">{apartment.phone}</span>
              </div>
            )}
            {apartment.lastPayment && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-sm">Last payment: {apartment.lastPayment}</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-muted-foreground text-sm">No tenant assigned</div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewDetails(apartment)}
            className="flex-1"
          >
            View Details
          </Button>
          {!apartment.tenant && (
            <Button 
              size="sm" 
              onClick={() => onAddTenant(apartment.id)}
              className="flex-1"
            >
              Add Tenant
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard;
