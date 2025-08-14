
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const MaintenanceRequestForm = ({ open, onClose, onSubmit }: MaintenanceRequestFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      apartment: '',
      tenant: '',
      issue: '',
      category: 'general',
      priority: 'medium',
      description: '',
      estimatedCost: ''
    }
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      id: `MAINT${Date.now()}`,
      status: 'pending',
      dateRequested: new Date().toISOString().split('T')[0],
      assignedTo: null,
      estimatedCost: Number(data.estimatedCost)
    });
    toast({
      title: "Maintenance Request Added",
      description: `Request for ${data.issue} has been submitted`,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apartment">Apartment</Label>
              <Input
                id="apartment"
                {...register('apartment', { required: 'Apartment is required' })}
                placeholder="e.g., A101"
              />
              {errors.apartment && <p className="text-sm text-red-500">{errors.apartment.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant Name</Label>
              <Input
                id="tenant"
                {...register('tenant', { required: 'Tenant name is required' })}
                placeholder="Enter tenant name"
              />
              {errors.tenant && <p className="text-sm text-red-500">{errors.tenant.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue">Issue Summary</Label>
            <Input
              id="issue"
              {...register('issue', { required: 'Issue summary is required' })}
              placeholder="Brief description of the issue"
            />
            {errors.issue && <p className="text-sm text-red-500">{errors.issue.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue('category', value)} defaultValue="general">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="structural">Structural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => setValue('priority', value)} defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost (GH₵)</Label>
              <Input
                id="estimatedCost"
                type="number"
                {...register('estimatedCost', { required: 'Estimated cost is required', min: 0 })}
                placeholder="0.00"
              />
              {errors.estimatedCost && <p className="text-sm text-red-500">{errors.estimatedCost.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Provide detailed description of the issue..."
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceRequestForm;
