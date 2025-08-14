
import React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface EstateReportsPrintDialogProps {
  open: boolean;
  onClose: () => void;
  reportType: string;
  selectedTimeRange: string;
  onTimeRangeChange: (value: string) => void;
  selectedSections: Record<string, boolean>;
  onSectionChange: (section: string, checked: boolean) => void;
  onPrint: () => void;
}

const EstateReportsPrintDialog = ({
  open,
  onClose,
  reportType,
  selectedTimeRange,
  onTimeRangeChange,
  selectedSections,
  onSectionChange,
  onPrint
}: EstateReportsPrintDialogProps) => {
  const getReportTitle = () => {
    switch (reportType) {
      case 'tenants':
        return 'Tenant Management Report';
      case 'payments':
        return 'Payment Management Report';
      case 'maintenance':
        return 'Maintenance Requests Report';
      case 'utilities':
        return 'Utility Bills Report';
      case 'apartments':
        return 'Apartment Overview Report';
      default:
        return 'Estate Management Report';
    }
  };

  const getSectionOptions = () => {
    switch (reportType) {
      case 'tenants':
        return [
          { id: 'overview', label: 'Overview Statistics' },
          { id: 'active', label: 'Active Tenants' },
          { id: 'inactive', label: 'Inactive Tenants' },
          { id: 'overdue', label: 'Overdue Payments' }
        ];
      case 'payments':
        return [
          { id: 'overview', label: 'Payment Statistics' },
          { id: 'pending', label: 'Pending Payments' },
          { id: 'paid', label: 'Paid Payments' },
          { id: 'overdue', label: 'Overdue Payments' }
        ];
      case 'maintenance':
        return [
          { id: 'overview', label: 'Request Statistics' },
          { id: 'pending', label: 'Pending Requests' },
          { id: 'progress', label: 'In Progress' },
          { id: 'completed', label: 'Completed Requests' }
        ];
      case 'utilities':
        return [
          { id: 'overview', label: 'Utility Statistics' },
          { id: 'electricity', label: 'Electricity Bills' },
          { id: 'water', label: 'Water Bills' },
          { id: 'pending', label: 'Pending Bills' }
        ];
      case 'apartments':
        return [
          { id: 'overview', label: 'Apartment Statistics' },
          { id: 'occupied', label: 'Occupied Units' },
          { id: 'vacant', label: 'Vacant Units' },
          { id: 'maintenance', label: 'Under Maintenance' }
        ];
      default:
        return [
          { id: 'overview', label: 'Overview Statistics' },
          { id: 'summary', label: 'Summary Report' }
        ];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer size={20} />
            {getReportTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Time Range</Label>
            <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Report Sections</Label>
            <div className="space-y-3">
              {getSectionOptions().map((section) => (
                <div key={section.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={section.id}
                    checked={selectedSections[section.id] || false}
                    onCheckedChange={(checked) => onSectionChange(section.id, checked as boolean)}
                  />
                  <Label htmlFor={section.id} className="text-sm">{section.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onPrint} className="flex-1">
              <Printer className="mr-2" size={16} />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EstateReportsPrintDialog;
