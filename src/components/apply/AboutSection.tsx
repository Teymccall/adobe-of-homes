
import React from 'react';
import { Control } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface AboutSectionProps {
  control: Control<any>;
}

const AboutSection = ({ control }: AboutSectionProps) => {
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-xl font-semibold">About You</h2>
      
      <FormField
        control={control}
        name="about"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tell us about yourself and your experience</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Share your real estate experience, property management background, and why you want to be a home owner on our platform..."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AboutSection;
