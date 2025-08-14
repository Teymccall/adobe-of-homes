
import React, { useState } from 'react';
import { FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { Upload, X, Image } from 'lucide-react';

interface PropertyImageUploadProps {
  form: UseFormReturn<any>;
}

const PropertyImageUpload = ({ form }: PropertyImageUploadProps) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsLoading(true);
    form.setValue('images', files);

    // Create preview URLs
    const previews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          previews.push(event.target.result as string);
          if (previews.length === files.length) {
            setPreviewImages(previews);
            setIsLoading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
    
    // Reset the file input if no images left
    if (newPreviews.length === 0) {
      form.setValue('images', undefined);
    }
  };

  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium flex items-center gap-2">
            <Image size={20} />
            Property Images
          </FormLabel>
          
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ghana-primary transition-colors">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-50 rounded-full">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <div>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                  </FormControl>
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer"
                  >
                    <Button type="button" variant="outline" className="mb-2" asChild>
                      <span>Choose Images</span>
                    </Button>
                    <p className="text-sm text-gray-500">
                      Upload high-quality images of your property
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports: JPG, PNG, WebP (Max 10MB each)
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghana-primary"></div>
                <span className="ml-2 text-sm text-gray-600">Processing images...</span>
              </div>
            )}

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Image Previews ({previewImages.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <FormDescription>
            Upload at least 3 high-quality images showing different rooms and areas of your property. Good photos help attract more potential tenants.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PropertyImageUpload;
