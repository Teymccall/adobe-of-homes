
import React from 'react';
import { MapPin, Navigation, Globe } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          <MapPin size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Location Information</h2>
          <p className="text-gray-600">Where are you located?</p>
        </div>
      </div>
      
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <Navigation size={18} className="text-ghana-primary" />
              Address/Location
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="East Legon, Accra" 
                className="h-12 text-base border-gray-300 focus:border-ghana-primary focus:ring-ghana-primary/20"
                {...field} 
              />
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
            <FormLabel className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <Globe size={18} className="text-ghana-primary" />
              Region
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-12 text-base border-gray-300 focus:border-ghana-primary focus:ring-ghana-primary/20">
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
