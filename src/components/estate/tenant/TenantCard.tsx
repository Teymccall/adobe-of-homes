
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Edit, FileText, Power, Printer } from 'lucide-react';

interface TenantCardProps {
  tenant: any;
  onView: (tenant: any) => void;
  onEdit: (tenant: any) => void;
  onAddReport?: (tenant: any) => void;
  onToggleStatus?: (tenant: any) => void;
  onPrintIndividual?: (tenant: any) => void;
}

const TenantCard = ({ 
  tenant, 
  onView, 
  onEdit, 
  onAddReport, 
  onToggleStatus,
  onPrintIndividual
}: TenantCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{tenant.name}</div>
          <div className="text-sm text-muted-foreground">{tenant.email}</div>
        </div>
      </TableCell>
      <TableCell>{tenant.apartment}</TableCell>
      <TableCell>
        <div>
          <div>{tenant.phone}</div>
          <div className="text-sm text-muted-foreground">{tenant.email}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div>{tenant.leaseStart} - {tenant.leaseEnd}</div>
        </div>
      </TableCell>
      <TableCell>GH₵ {tenant.rent?.toLocaleString()}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(tenant.status)}>
          {tenant.status}
        </Badge>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => onView(tenant)}>
                  <Eye size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Details</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => onEdit(tenant)}>
                  <Edit size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Tenant</p>
              </TooltipContent>
            </Tooltip>
            
            {onAddReport && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => onAddReport(tenant)}>
                    <FileText size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Report</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {onPrintIndividual && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => onPrintIndividual(tenant)}>
                    <Printer size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print Individual Report</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {onToggleStatus && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onToggleStatus(tenant)}
                    className={tenant.status === 'inactive' ? 'text-green-600' : 'text-red-600'}
                  >
                    <Power size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tenant.status === 'inactive' ? 'Activate Tenant' : 'Deactivate Tenant'}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};

export default TenantCard;
