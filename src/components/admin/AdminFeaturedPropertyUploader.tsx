import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { propertyService } from '@/services/propertyService';
import { cloudinaryService } from '@/services/cloudinaryService';
import { PropertyStatus, PropertyType } from '@/data/types';

// Reuse existing modular form sections from agents flow
import PropertyContactForm from '@/components/agents/property/PropertyContactForm';
import PropertyBasicInfo from '@/components/agents/property/PropertyBasicInfo';
import PropertyDetails from '@/components/agents/property/PropertyDetails';
import PropertyLocationPicker from '@/components/agents/property/PropertyLocationPicker';
import PropertyDescription from '@/components/agents/property/PropertyDescription';
import PropertyImageUpload from '@/components/agents/property/PropertyImageUpload';
import PropertyOwnerDetails from '@/components/agents/property/PropertyOwnerDetails';

const AdminFeaturedPropertyUploader: React.FC = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      price: '',
      propertyType: '' as PropertyType,
      bedrooms: '',
      bathrooms: '',
      area: '',
      features: '',
      status: 'vacant' as PropertyStatus,
      stayDuration: '',
      images: undefined as unknown as FileList,
      mapLocation: { lat: 5.6037, lng: -0.1870 },
      // Owner details - ensure all are strings, not undefined
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      ownerIdType: '',
      ownerIdNumber: '',
      ownerAddress: '',
      // Additional fields that might be used by other components
      region: '',
      town: '',
      verificationStatus: 'verified' as const,
      isVerified: true,
      isFeatured: true,
      availability: 'available' as const,
    },
    mode: 'onChange' // Add this to help with form validation
  });

  const handleLocationSelected = (location: { lat: number; lng: number }) => {
    form.setValue('mapLocation', location);
  };

  const onSubmit = async (data: any) => {
    if (!userProfile) {
      toast({ title: 'Error', description: 'You must be logged in as admin.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        const files = Array.from(data.images);
        const results = await cloudinaryService.uploadPropertyImages(files, 'admin-featured');
        imageUrls = results.map(r => r.secureUrl);
      }

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
        ownerName: data.ownerName || userProfile.displayName || 'Admin User',
        ownerEmail: data.ownerEmail || userProfile.email || '',
        ownerPhone: data.ownerPhone || userProfile.phone || '',
        mapLocation: data.mapLocation,
        images: imageUrls,
        availability: 'available' as const,
        // Admin uploads should be featured and verified immediately
        isFeatured: true,
        isVerified: true,
        verificationStatus: 'verified' as const,
        verifiedBy: userProfile.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const id = await propertyService.createProperty(propertyData as any);

      toast({ title: 'Featured Property Added', description: `Property created with ID: ${id}` });
      form.reset();
    } catch (error) {
      console.error('Featured property creation error:', error);
      
      // Show more specific error message
      let errorMessage = 'Failed to create featured property.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PropertyContactForm form={form} />
          <PropertyBasicInfo form={form} />
          <PropertyDetails form={form} />
          <PropertyLocationPicker 
            initialLocation={form.getValues('mapLocation')}
            onLocationSelected={handleLocationSelected}
          />
          <PropertyDescription form={form} />
          <PropertyImageUpload form={form} />
          <PropertyOwnerDetails form={form} />
          <Button type="submit" className="w-full md:w-auto flex items-center gap-2" disabled={isSubmitting}>
            <Upload size={16} />
            {isSubmitting ? 'Adding...' : 'Add Featured Property'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminFeaturedPropertyUploader;



