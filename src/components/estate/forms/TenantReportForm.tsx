
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TenantReport } from '@/data/types';

interface TenantReportFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TenantReport>) => void;
  reporterType: 'estate_manager' | 'home_owner';
  reporterName: string;
  reporterId: string;
  tenantId?: string;
  tenantName?: string;
}

const TenantReportForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  reporterType, 
  reporterName, 
  reporterId,
  tenantId,
  tenantName 
}: TenantReportFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      tenantName: tenantName || '',
      title: '',
      description: '',
      reportType: '',
      tags: '',
      propertyId: ''
    }
  });

  const handleFormSubmit = (data: any) => {
    const reportData: Partial<TenantReport> = {
      ...data,
      id: `TR${Date.now()}`,
      tenantId: tenantId || `T${Date.now()}`,
      reporterId,
      reporterName,
      reporterType,
      createdAt: new Date(),
      tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : []
    };

    onSubmit(reportData);
    toast({
      title: "Report Submitted",
      description: `Tenant report for ${data.tenantName} has been submitted successfully`,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Submit Tenant Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenantName">Tenant Name</Label>
              <Input
                id="tenantName"
                {...register('tenantName', { required: 'Tenant name is required' })}
                placeholder="Enter tenant name"
              />
              {errors.tenantName && <p className="text-sm text-red-500">{String(errors.tenantName.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select onValueChange={(value) => setValue('reportType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Brief title for the report"
            />
            {errors.title && <p className="text-sm text-red-500">{String(errors.title.message)}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Provide detailed information about the tenant..."
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-500">{String(errors.description.message)}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyId">Property ID (Optional)</Label>
              <Input
                id="propertyId"
                {...register('propertyId')}
                placeholder="e.g., P001, A101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                {...register('tags')}
                placeholder="punctual, clean, respectful (comma-separated)"
              />
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm">
              <strong>Reporter:</strong> {reporterName} ({reporterType.replace('_', ' ')})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This report will be visible to super admins and home owners when they search for this tenant.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TenantReportForm;
