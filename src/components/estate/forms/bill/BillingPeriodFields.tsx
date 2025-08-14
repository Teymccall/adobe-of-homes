
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BillFormData } from './BillFormTypes';

interface BillingPeriodFieldsProps {
  register: UseFormRegister<BillFormData>;
  errors: FieldErrors<BillFormData>;
}

const BillingPeriodFields = ({ register, errors }: BillingPeriodFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billingPeriod">Billing Period</Label>
          <Input
            id="billingPeriod"
            {...register('billingPeriod', { required: 'Billing period is required' })}
            placeholder="e.g., June 2024"
          />
          {errors.billingPeriod && <p className="text-sm text-red-500">{errors.billingPeriod.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            {...register('dueDate', { required: 'Due date is required' })}
          />
          {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Any additional notes or charges..."
          rows={3}
        />
      </div>
    </>
  );
};

export default BillingPeriodFields;
