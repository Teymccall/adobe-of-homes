
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface TenantFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  tenant?: any;
}

const TenantForm = ({ open, onClose, onSubmit, tenant }: TenantFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: tenant || {
      name: '',
      email: '',
      phone: '',
      apartment: '',
      rentAmount: '',
      leaseStart: '',
      leaseEnd: '',
      deposit: '',
      emergencyContact: ''
    }
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      id: tenant?.id || `TEN${Date.now()}`,
      rentAmount: Number(data.rentAmount),
      deposit: Number(data.deposit),
      status: 'active'
    });
    toast({
      title: tenant ? "Tenant Updated" : "Tenant Added",
      description: `${data.name} has been ${tenant ? 'updated' : 'added'} successfully`,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{tenant ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-sm text-red-500">{String(errors.name.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="Enter email"
              />
              {errors.email && <p className="text-sm text-red-500">{String(errors.email.message)}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Phone is required' })}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-sm text-red-500">{String(errors.phone.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Apartment</Label>
              <Input
                id="apartment"
                {...register('apartment', { required: 'Apartment is required' })}
                placeholder="e.g., A101"
              />
              {errors.apartment && <p className="text-sm text-red-500">{String(errors.apartment.message)}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rentAmount">Monthly Rent (GH₵)</Label>
              <Input
                id="rentAmount"
                type="number"
                {...register('rentAmount', { required: 'Rent amount is required' })}
                placeholder="0.00"
              />
              {errors.rentAmount && <p className="text-sm text-red-500">{String(errors.rentAmount.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Security Deposit (GH₵)</Label>
              <Input
                id="deposit"
                type="number"
                {...register('deposit', { required: 'Deposit is required' })}
                placeholder="0.00"
              />
              {errors.deposit && <p className="text-sm text-red-500">{String(errors.deposit.message)}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaseStart">Lease Start Date</Label>
              <Input
                id="leaseStart"
                type="date"
                {...register('leaseStart', { required: 'Lease start date is required' })}
              />
              {errors.leaseStart && <p className="text-sm text-red-500">{String(errors.leaseStart.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="leaseEnd">Lease End Date</Label>
              <Input
                id="leaseEnd"
                type="date"
                {...register('leaseEnd', { required: 'Lease end date is required' })}
              />
              {errors.leaseEnd && <p className="text-sm text-red-500">{String(errors.leaseEnd.message)}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              {...register('emergencyContact', { required: 'Emergency contact is required' })}
              placeholder="Emergency contact name and phone"
            />
            {errors.emergencyContact && <p className="text-sm text-red-500">{String(errors.emergencyContact.message)}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{tenant ? 'Update' : 'Add'} Tenant</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TenantForm;
