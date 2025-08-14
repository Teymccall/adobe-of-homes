
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Calendar, Home, DollarSign } from 'lucide-react';

interface TenantViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    apartment: string;
    rent: number;
    leaseStart: string;
    leaseEnd: string;
    status: string;
  } | null;
}

const TenantViewDialog = ({ isOpen, onClose, tenant }: TenantViewDialogProps) => {
  if (!tenant) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User size={20} />
            Tenant Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Personal Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-muted-foreground" />
                <span className="font-medium">{tenant.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" />
                <span>{tenant.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                <span>{tenant.phone}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Lease Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home size={16} className="text-muted-foreground" />
                <span>Apartment {tenant.apartment}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-muted-foreground" />
                <span>GH₵ {tenant.rent.toLocaleString()}/month</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span>{tenant.leaseStart} - {tenant.leaseEnd}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              {getStatusBadge(tenant.status)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantViewDialog;
