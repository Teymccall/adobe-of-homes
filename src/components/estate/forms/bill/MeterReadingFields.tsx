
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BillFormData } from './BillFormTypes';

interface MeterReadingFieldsProps {
  register: UseFormRegister<BillFormData>;
  errors: FieldErrors<BillFormData>;
}

const MeterReadingFields = ({ register, errors }: MeterReadingFieldsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="previousReading">Previous Reading</Label>
        <Input
          id="previousReading"
          type="number"
          {...register('previousReading', { required: 'Previous reading is required' })}
          placeholder="0"
        />
        {errors.previousReading && <p className="text-sm text-red-500">{errors.previousReading.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="currentReading">Current Reading</Label>
        <Input
          id="currentReading"
          type="number"
          {...register('currentReading', { required: 'Current reading is required' })}
          placeholder="0"
        />
        {errors.currentReading && <p className="text-sm text-red-500">{errors.currentReading.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="meterNumber">Meter Number</Label>
        <Input
          id="meterNumber"
          {...register('meterNumber')}
          placeholder="e.g., MT12345"
        />
      </div>
    </div>
  );
};

export default MeterReadingFields;
