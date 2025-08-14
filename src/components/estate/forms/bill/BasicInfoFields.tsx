
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BillFormData } from './BillFormTypes';

interface BasicInfoFieldsProps {
  register: UseFormRegister<BillFormData>;
  errors: FieldErrors<BillFormData>;
}

const BasicInfoFields = ({ register, errors }: BasicInfoFieldsProps) => {
  return (
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
  );
};

export default BasicInfoFields;
