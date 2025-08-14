
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface PaymentRecordFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const PaymentRecordForm = ({ open, onClose, onSubmit }: PaymentRecordFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      tenant: '',
      apartment: '',
      amount: '',
      type: 'rent',
      method: 'bank_transfer',
      paidDate: new Date().toISOString().split('T')[0]
    }
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      amount: Number(data.amount),
      status: 'paid',
      id: `PAY${Date.now()}`,
      dueDate: data.paidDate
    });
    toast({
      title: "Payment Recorded",
      description: `Payment of GH₵ ${data.amount} has been recorded successfully`,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant Name</Label>
              <Input
                id="tenant"
                {...register('tenant', { required: 'Tenant name is required' })}
                placeholder="Enter tenant name"
              />
              {errors.tenant && <p className="text-sm text-red-500">{errors.tenant.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Apartment</Label>
              <Input
                id="apartment"
                {...register('apartment', { required: 'Apartment is required' })}
                placeholder="e.g., A101"
              />
              {errors.apartment && <p className="text-sm text-red-500">{errors.apartment.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (GH₵)</Label>
              <Input
                id="amount"
                type="number"
                {...register('amount', { required: 'Amount is required', min: 1 })}
                placeholder="0.00"
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Payment Type</Label>
              <Select onValueChange={(value) => setValue('type', value)} defaultValue="rent">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select onValueChange={(value) => setValue('method', value)} defaultValue="bank_transfer">
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidDate">Payment Date</Label>
              <Input
                id="paidDate"
                type="date"
                {...register('paidDate', { required: 'Payment date is required' })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Record Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentRecordForm;
