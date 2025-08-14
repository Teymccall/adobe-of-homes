
export interface BillFormData {
  tenant: string;
  apartment: string;
  utilityType: string;
  units: string;
  ratePerUnit: string;
  previousReading: string;
  currentReading: string;
  meterNumber: string;
  billingPeriod: string;
  dueDate: string;
  notes: string;
}

export interface GenerateBillFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}
