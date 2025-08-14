
import React from 'react';
import { IdCard } from 'lucide-react';
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface IdentificationSectionProps {
  control: Control<any>;
  idImage: File | null;
  idImagePreview: string | null;
  onIdImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdentificationSection = ({ control, idImage, idImagePreview, onIdImageChange }: IdentificationSectionProps) => {
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <IdCard size={20} />
        Identification
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="idType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="nationalId">National ID</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driversLicense">Driver's License</SelectItem>
                  <SelectItem value="votersId">Voter's ID</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input placeholder="ID Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">ID Document Image</label>
        <div className="flex items-end gap-4">
          <div className="w-32 h-20 bg-gray-100 flex items-center justify-center overflow-hidden border">
            {idImagePreview ? (
              <img src={idImagePreview} alt="ID Preview" className="w-full h-full object-cover" />
            ) : (
              <IdCard size={24} className="text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              onChange={onIdImageChange}
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Upload a clear image of your ID document. Max size: 2MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificationSection;
