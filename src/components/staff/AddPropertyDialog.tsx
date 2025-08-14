import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property, PropertyType, PropertyStatus } from '@/data/types';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AddPropertyDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (property: Property) => void;
}

const AddPropertyDialog = ({ open, onClose, onSubmit }: AddPropertyDialogProps) => {
  const { toast } = useToast();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: '',
      location: '',
      price: '',
      propertyType: '' as PropertyType,
      bedrooms: '',
      bathrooms: '',
      area: '',
      description: '',
      status: 'available' as PropertyStatus,
      ownerName: '',
      ownerPhone: '',
    },
  });

  // Image handling functions
  const handleImageUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files",
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: "Please upload images smaller than 5MB",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (imageFiles.length + validFiles.length > 8) {
      toast({
        title: "Too many images",
        description: "Maximum 8 images allowed",
        variant: "destructive"
      });
      return;
    }

    const newFiles = [...imageFiles, ...validFiles];
    setImageFiles(newFiles);

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  }, [imageFiles, toast]);

  const removeImage = useCallback((index: number) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }, [imagePreviews]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  }, [handleImageUpload]);

  const handleSubmit = (data: any) => {
    if (imageFiles.length < 1) {
      toast({
        title: "Images required",
        description: "Please upload at least 1 image for the property",
        variant: "destructive"
      });
      return;
    }

    const newProperty: Property = {
      id: Date.now().toString(),
      title: data.title,
      location: data.location,
      price: parseFloat(data.price),
      propertyType: data.propertyType,
      bedrooms: parseInt(data.bedrooms),
      bathrooms: parseInt(data.bathrooms),
      area: parseFloat(data.area),
      images: imagePreviews.length > 0 ? imagePreviews : ['/placeholder.svg'],
      description: data.description,
      features: [],
      status: data.status,
      verificationStatus: 'pending',
      ownerName: data.ownerName,
      ownerPhone: data.ownerPhone,
      createdAt: new Date(),
      isVerified: false,
      homeOwnerId: 'staff-added',
      availability: 'available',
    };

    onSubmit(newProperty);
    
    // Clean up
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    setImageFiles([]);
    setImagePreviews([]);
    form.reset();
    onClose();

    toast({
      title: "Property Added",
      description: "Property has been successfully added to the system",
    });
  };

  // Clean up on dialog close
  const handleClose = () => {
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    setImageFiles([]);
    setImagePreviews([]);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Modern 3-Bedroom Apartment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="East Legon, Accra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Enhanced Image Upload Section - Moved up for better visibility */}
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  📷 Property Images ({imageFiles.length}/8)
                </label>
                <p className="text-sm text-muted-foreground">Upload at least 1 image, maximum 8 images. Recommended: 4-6 high-quality images.</p>
              </div>

              {/* Drag & Drop Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="font-medium mb-1">Drop images here or click to upload</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Supports JPG, PNG, WebP (max 5MB each)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      handleImageUpload(e.target.files);
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Choose Images
                </Button>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <Card key={index} className="relative group">
                      <CardContent className="p-1">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                        <div className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-1 rounded-br">
                          {index + 1}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add more images placeholder */}
                  {imagePreviews.length < 8 && (
                    <Card
                      className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <CardContent className="p-1 h-20 flex items-center justify-center">
                        <div className="text-center">
                          <Plus className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">Add More</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (GH₵)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Owner Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+233201234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe the property..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Property
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;
