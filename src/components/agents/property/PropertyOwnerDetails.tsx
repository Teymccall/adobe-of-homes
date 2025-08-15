
import React from 'react';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';
import { User, Shield } from 'lucide-react';

interface PropertyOwnerDetailsProps {
  form: UseFormReturn<any>;
}

const PropertyOwnerDetails = ({ form }: PropertyOwnerDetailsProps) => {
  return (
    <div>
      <Separator className="my-6" />
      
      <div className="mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
          <User size={20} />
          Property Owner Details
        </h3>
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
          <Shield size={16} />
          <span>This information is confidential and will only be visible to super administrators.</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe Mensah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ownerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., +233201234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ownerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g., owner@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ownerIdType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ghana-card">Ghana Card</SelectItem>
                      <SelectItem value="voters-id">Voter's ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers-license">Driver's License</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ownerIdNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., GHA-123456789-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ownerAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., P.O. Box 123, Accra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnerDetails;
