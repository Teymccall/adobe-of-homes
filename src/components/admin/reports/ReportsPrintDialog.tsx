
import React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ReportsPrintDialogProps {
  open: boolean;
  onClose: () => void;
  reportType: string;
  selectedTimeRange: string;
  onTimeRangeChange: (value: string) => void;
  selectedSections: Record<string, boolean>;
  onSectionChange: (section: string, checked: boolean) => void;
  onPrint: () => void;
}

const ReportsPrintDialog = ({
  open,
  onClose,
  reportType,
  selectedTimeRange,
  onTimeRangeChange,
  selectedSections,
  onSectionChange,
  onPrint
}: ReportsPrintDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer size={20} />
            Print Configuration
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
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="overview" 
                  checked={selectedSections.overview}
                  onCheckedChange={(checked) => onSectionChange('overview', checked as boolean)}
                />
                <Label htmlFor="overview" className="text-sm">Overview Statistics</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="monthly" 
                  checked={selectedSections.monthly}
                  onCheckedChange={(checked) => onSectionChange('monthly', checked as boolean)}
                />
                <Label htmlFor="monthly" className="text-sm">Monthly Trends</Label>
              </div>
              
              {reportType !== 'transactions' && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="breakdown" 
                    checked={selectedSections.breakdown}
                    onCheckedChange={(checked) => onSectionChange('breakdown', checked as boolean)}
                  />
                  <Label htmlFor="breakdown" className="text-sm">
                    {reportType === 'properties' ? 'Type & Region Breakdown' : 'Detailed Breakdown'}
                  </Label>
                </div>
              )}
              
              {reportType === 'homeowners' && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="performance" 
                    checked={selectedSections.performance}
                    onCheckedChange={(checked) => onSectionChange('performance', checked as boolean)}
                  />
                  <Label htmlFor="performance" className="text-sm">Performance Rankings</Label>
                </div>
              )}
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

export default ReportsPrintDialog;
