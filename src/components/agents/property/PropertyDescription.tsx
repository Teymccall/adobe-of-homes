
import React from 'react';
import { FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface PropertyDescriptionProps {
  form: UseFormReturn<any>;
}

const PropertyDescription = ({ form }: PropertyDescriptionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <textarea
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe the property..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Features</FormLabel>
            <FormControl>
              <Input 
                placeholder="Separate features with commas (e.g., Swimming Pool, Garage, Garden)" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Enter features separated by commas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PropertyDescription;
