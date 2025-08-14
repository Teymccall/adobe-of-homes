
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { Property, PropertyType, PropertyStatus } from '@/data/types';
import { useMaps } from '@/context/MapsContext';
import { propertyService } from '@/services/propertyService';
import { cloudinaryService } from '@/services/cloudinaryService';
import { useAuth } from '@/context/AuthContext';

// Import the refactored components
import PropertyContactForm from './property/PropertyContactForm';
import PropertyBasicInfo from './property/PropertyBasicInfo';
import PropertyDetails from './property/PropertyDetails';
import PropertyLocationPicker from './property/PropertyLocationPicker';
import PropertyDescription from './property/PropertyDescription';
import PropertyImageUpload from './property/PropertyImageUpload';

interface UploadPropertyProps {
  agentId: string;
}

const UploadProperty = ({ agentId }: UploadPropertyProps) => {
  const { toast } = useToast();
  const { mapboxAccessToken } = useMaps();
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: "",
      propertyType: "" as PropertyType,
      bedrooms: "",
      bathrooms: "",
      area: "",
      features: "",
      status: "" as PropertyStatus,
      stayDuration: "",
      images: undefined as unknown as FileList,
      mapLocation: { lat: 5.6037, lng: -0.1870 }, // Default to Accra, Ghana
    },
  });

  const handleLocationSelected = (location: { lat: number; lng: number }) => {
    form.setValue('mapLocation', location);
  };

  const onSubmit = async (data: any) => {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a property.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Process images if they exist
      let imageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        console.log('Processing', data.images.length, 'images...');
        
        try {
          // Convert FileList to array and upload to Cloudinary
          const imageFiles = Array.from(data.images);
          const uploadResults = await cloudinaryService.uploadPropertyImages(
            imageFiles,
            'temp-property-id', // Will be updated after property creation
            (fileIndex, progress) => {
              console.log(`Upload progress for image ${fileIndex + 1}:`, progress.progress);
            }
          );
          
          // Extract secure URLs from upload results
          imageUrls = uploadResults.map(result => result.secureUrl);
          console.log('Uploaded', imageUrls.length, 'images to Cloudinary');
        } catch (error) {
          console.error('Error uploading images to Cloudinary:', error);
          toast({
            title: "Image Upload Error",
            description: "Failed to upload images. Please try again.",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Convert form data to property format
      const propertyData = {
        title: data.title,
        description: data.description,
        location: data.location,
        price: parseFloat(data.price) || 0,
        propertyType: data.propertyType,
        bedrooms: parseInt(data.bedrooms) || 0,
        bathrooms: parseInt(data.bathrooms) || 0,
        area: parseFloat(data.area) || 0,
        features: data.features ? data.features.split(',').map((f: string) => f.trim()) : [],
        status: data.status,
        stayDuration: data.stayDuration,
        homeOwnerId: userProfile.uid,
        homeOwnerName: userProfile.displayName,
        homeOwnerEmail: userProfile.email,
        homeOwnerPhone: userProfile.phone,
        mapLocation: data.mapLocation,
        images: imageUrls, // Save processed image URLs
        availability: 'available',
        isVerified: false,
        verificationStatus: 'unverified',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Submitting property with data:', {
        ...propertyData,
        images: `${imageUrls.length} images`,
        imageUrls: imageUrls
      });

      // Create property in Firebase
      const propertyId = await propertyService.createProperty(propertyData);
      
      console.log('Property created with ID:', propertyId);
      
      // Update Cloudinary tags with actual property ID if images were uploaded
      if (imageUrls.length > 0) {
        try {
          // Note: In a production app, you might want to update the Cloudinary tags
          // with the actual property ID, but this requires server-side implementation
          console.log('Property images uploaded successfully with URLs:', imageUrls);
        } catch (error) {
          console.error('Error updating Cloudinary tags:', error);
        }
      }
      
      toast({
        title: "Property Submitted Successfully",
        description: "Your property has been submitted for verification. It will be reviewed by our team.",
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error submitting property:', error);
      toast({
        title: "Error",
        description: "Failed to submit property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Upload New Property</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PropertyContactForm form={form} />
          
          <PropertyBasicInfo form={form} />
          
          <PropertyDetails form={form} />
          
          {/* Mapbox Location Picker */}
          <PropertyLocationPicker 
            initialLocation={form.getValues('mapLocation')} 
            onLocationSelected={handleLocationSelected} 
          />
          
          <PropertyDescription form={form} />
          
          <PropertyImageUpload form={form} />
          
          <Button 
            type="submit" 
            className="w-full md:w-auto flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Upload size={16} />
            {isSubmitting ? "Submitting..." : "Submit Property"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UploadProperty;
