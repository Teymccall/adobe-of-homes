
import React from 'react';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface PropertyDetailsProps {
  form: UseFormReturn<any>;
}

const PropertyDetails = ({ form }: PropertyDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <FormField
        control={form.control}
        name="bedrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bedrooms</FormLabel>
            <FormControl>
              <Input type="number" placeholder="3" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="bathrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bathrooms</FormLabel>
            <FormControl>
              <Input type="number" placeholder="2" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area (sq ft)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="1500" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="stayDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration of Stay</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="short">Short Stay</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
                <SelectItem value="3plus">3+ Years</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyDetails;
