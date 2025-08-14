
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BillFormData } from './BillFormTypes';
import { getUtilityUnit, calculateAmount } from './BillFormUtils';

interface CalculationFieldsProps {
  register: UseFormRegister<BillFormData>;
  errors: FieldErrors<BillFormData>;
  watchedUtilityType: string;
  watchedUnits: string;
  watchedRate: string;
}

const CalculationFields = ({ 
  register, 
  errors, 
  watchedUtilityType, 
  watchedUnits, 
  watchedRate 
}: CalculationFieldsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="units">
          Units Consumed ({getUtilityUnit(watchedUtilityType)})
        </Label>
        <Input
          id="units"
          type="number"
          step="0.01"
          {...register('units', { required: 'Units consumed is required', min: 0 })}
          placeholder="0"
        />
        {errors.units && <p className="text-sm text-red-500">{errors.units.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ratePerUnit">Rate per Unit (GH₵)</Label>
        <Input
          id="ratePerUnit"
          type="number"
          step="0.01"
          {...register('ratePerUnit', { required: 'Rate per unit is required', min: 0 })}
          placeholder="0.00"
        />
        {errors.ratePerUnit && <p className="text-sm text-red-500">{errors.ratePerUnit.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label>Total Amount</Label>
        <div className="h-10 px-3 py-2 border border-input rounded-md bg-muted flex items-center">
          <span className="font-medium">GH₵ {calculateAmount(watchedUnits, watchedRate)}</span>
        </div>
      </div>
    </div>
  );
};

export default CalculationFields;
