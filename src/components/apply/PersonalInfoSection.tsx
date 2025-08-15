
import React from 'react';
import { User, Mail, Phone, Camera, Upload } from 'lucide-react';
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
  setImage?: (file: File | null) => void;
  setImagePreview?: (preview: string | null) => void;
}

const PersonalInfoSection = ({ control, image, imagePreview, onImageChange }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <User size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-600">Tell us about yourself</p>
        </div>
      </div>
      
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <User size={18} className="text-ghana-primary" />
              Full Name
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="John Doe" 
                className="h-12 text-base border-gray-300 focus:border-ghana-primary focus:ring-ghana-primary/20"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <Mail size={18} className="text-ghana-primary" />
                Email Address
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <Phone size={18} className="text-ghana-primary" />
                Phone Number
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="+233 XX XXX XXXX" 
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
          <Camera size={18} className="text-ghana-primary" />
          Profile Image
        </FormLabel>
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-ghana-primary transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No image</p>
                </div>
              )}
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImage(null);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="h-12 text-base border-gray-300 focus:border-ghana-primary focus:ring-ghana-primary/20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Upload size={18} className="text-gray-400" />
              </div>
            </div>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Upload Requirements:</p>
                  <ul className="mt-1 space-y-1 text-blue-700">
                    <li>• Professional headshot or business photo</li>
                    <li>• Clear, high-quality image</li>
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

export default PersonalInfoSection;
