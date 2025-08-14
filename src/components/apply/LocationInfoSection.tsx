
import React from 'react';
import { MapPin } from 'lucide-react';
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

const regions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "North East",
  "Savannah",
  "Bono",
  "Ahafo",
  "Bono East",
  "Oti",
  "Western North",
];

interface LocationInfoSectionProps {
  control: Control<any>;
}

const LocationInfoSection = ({ control }: LocationInfoSectionProps) => {
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MapPin size={20} />
        Location Information
      </h2>
      
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address/Location</FormLabel>
            <FormControl>
              <Input placeholder="East Legon, Accra" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="region"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Region</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationInfoSection;
