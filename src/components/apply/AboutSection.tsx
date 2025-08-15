
import React from 'react';
import { User, MessageSquare, Lightbulb } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
          <MessageSquare size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About You</h2>
          <p className="text-gray-600">Tell us your story and experience</p>
        </div>
      </div>
      
      <FormField
        control={control}
        name="about"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <User size={18} className="text-ghana-primary" />
              Tell us about yourself and your experience
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Share your real estate experience, property management background, and why you want to be a home owner on our platform..."
                className="min-h-[180px] text-base border-gray-300 focus:border-ghana-primary focus:ring-ghana-primary/20 resize-none"
                {...field}
              />
            </FormControl>
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Lightbulb size={14} className="text-green-600" />
                </div>
                <div className="text-sm text-green-800">
                  <p className="font-medium">Tips for a great application:</p>
                  <ul className="mt-1 space-y-1 text-green-700">
                    <li>• Describe your real estate experience</li>
                    <li>• Mention any property management background</li>
                    <li>• Explain why you want to join our platform</li>
                    <li>• Share your goals and vision</li>
                  </ul>
                </div>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AboutSection;
