
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BillFormData, GenerateBillFormProps } from './bill/BillFormTypes';
import { getUtilityUnit, getDefaultRate, calculateAmount } from './bill/BillFormUtils';
import BasicInfoFields from './bill/BasicInfoFields';
import UtilityTypeSelect from './bill/UtilityTypeSelect';
import MeterReadingFields from './bill/MeterReadingFields';
import CalculationFields from './bill/CalculationFields';
import BillingPeriodFields from './bill/BillingPeriodFields';

const GenerateBillForm = ({ open, onClose, onSubmit }: GenerateBillFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BillFormData>({
    defaultValues: {
      tenant: '',
      apartment: '',
      utilityType: 'electricity',
      units: '',
      ratePerUnit: '',
      previousReading: '',
      currentReading: '',
      meterNumber: '',
      billingPeriod: '',
      dueDate: '',
      notes: ''
    }
  });

  const watchedUtilityType = watch('utilityType');
  const watchedUnits = watch('units');
  const watchedRate = watch('ratePerUnit');

  const handleUtilityTypeChange = (value: string) => {
    setValue('utilityType', value);
    setValue('ratePerUnit', getDefaultRate(value));
  };

  const handleFormSubmit = (data: BillFormData) => {
    const calculatedAmount = parseFloat(calculateAmount(data.units, data.ratePerUnit));
    
    const billData = {
      id: `UTIL${Date.now()}`,
      ...data,
      amount: calculatedAmount,
      units: parseFloat(data.units),
      ratePerUnit: parseFloat(data.ratePerUnit),
      status: 'pending',
      month: data.billingPeriod,
      meterReading: `${data.currentReading} ${getUtilityUnit(data.utilityType)}`
    };

    onSubmit(billData);
    
    toast({
      title: "Bill Generated Successfully",
      description: `${data.utilityType.charAt(0).toUpperCase() + data.utilityType.slice(1)} bill of GH₵ ${calculatedAmount} generated for ${data.tenant}`,
    });
    
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Generate Utility Bill
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <BasicInfoFields register={register} errors={errors} />
          
          <UtilityTypeSelect onValueChange={handleUtilityTypeChange} />
          
          <MeterReadingFields register={register} errors={errors} />
          
          <CalculationFields
            register={register}
            errors={errors}
            watchedUtilityType={watchedUtilityType}
            watchedUnits={watchedUnits}
            watchedRate={watchedRate}
          />
          
          <BillingPeriodFields register={register} errors={errors} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Generate Bill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateBillForm;
