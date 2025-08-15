
import React from 'react';
import { IdCard, Shield, Hash, Upload, X } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verification & Identification</h2>
          <p className="text-gray-600">Help us verify your identity securely</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="idType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <IdCard size={18} className="text-ghana-primary" />
                ID Type
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-ghana-primary focus:ring-ghana-primary/20">
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
              <FormLabel className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <Hash size={18} className="text-ghana-primary" />
                ID Number
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your ID number" 
                  className="h-12 text-base border-gray-300 focus:border-ghana-primary focus:ring-ghana-primary/20"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6">
        <FormLabel className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-4">
          <Upload size={18} className="text-ghana-primary" />
          ID Document Image
        </FormLabel>
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-40 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-ghana-primary transition-colors">
              {idImagePreview ? (
                <img src={idImagePreview} alt="ID Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <IdCard size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No ID image</p>
                </div>
              )}
            </div>
            {idImagePreview && (
              <button
                type="button"
                onClick={() => {
                  // Clear the ID image
                  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                  if (input) input.value = '';
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={onIdImageChange}
                className="h-12 text-base border-gray-300 focus:border-ghana-primary focus:ring-ghana-primary/20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Upload size={18} className="text-gray-400" />
              </div>
            </div>
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-amber-800">
                  <p className="font-medium">ID Upload Requirements:</p>
                  <ul className="mt-1 space-y-1 text-amber-700">
                    <li>• Clear, readable image of your ID document</li>
                    <li>• All text and numbers must be visible</li>
                    <li>• Maximum file size: 2MB</li>
                    <li>• Supported formats: JPG, PNG, WebP</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificationSection;
