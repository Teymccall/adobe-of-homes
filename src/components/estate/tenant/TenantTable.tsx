
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import TenantCard from './TenantCard';
import TenantViewDialog from '../dialogs/TenantViewDialog';

interface TenantTableProps {
  tenants: any[];
  onViewTenant: (tenantId: string) => void;
  onEditTenant: (tenant: any) => void;
  onAddReport?: (tenant: any) => void;
  onToggleStatus?: (tenant: any) => void;
  onPrintIndividual?: (tenant: any) => void;
  showInactive?: boolean;
  onToggleShowInactive?: (show: boolean) => void;
}

const TenantTable = ({ 
  tenants, 
  onViewTenant, 
  onEditTenant, 
  onAddReport, 
  onToggleStatus,
  onPrintIndividual,
  showInactive = false,
  onToggleShowInactive
}: TenantTableProps) => {
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsViewDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Tenants</CardTitle>
            {onToggleShowInactive && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-inactive"
                  checked={showInactive}
                  onCheckedChange={onToggleShowInactive}
                />
                <Label htmlFor="show-inactive">Show Inactive Tenants</Label>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Apartment</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Lease Period</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TenantCard
                  key={tenant.id}
                  tenant={tenant}
                  onView={handleViewTenant}
                  onEdit={onEditTenant}
                  onAddReport={onAddReport}
                  onToggleStatus={onToggleStatus}
                  onPrintIndividual={onPrintIndividual}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TenantViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        tenant={selectedTenant}
      />
    </>
  );
};

export default TenantTable;
