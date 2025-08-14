
import React from 'react';
import { User } from 'lucide-react';
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface PersonalInfoSectionProps {
  control: Control<any>;
  image: File | null;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection = ({ control, image, imagePreview, onImageChange }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <User size={20} />
        Personal Information
      </h2>
      
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+233 XX XXX XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Profile Image</label>
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Upload a professional profile photo. Max size: 2MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
