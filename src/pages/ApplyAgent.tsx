
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import PersonalInfoSection from '@/components/apply/PersonalInfoSection';
import LocationInfoSection from '@/components/apply/LocationInfoSection';
import IdentificationSection from '@/components/apply/IdentificationSection';
import AboutSection from '@/components/apply/AboutSection';
import { authService } from '@/services/authService';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  region: z.string().min(1, { message: "Region is required" }),
  idType: z.string().min(1, { message: "ID type is required" }),
  idNumber: z.string().min(4, { message: "ID number must be at least 4 characters" }),
  about: z.string().min(50, { message: "Please provide at least 50 characters about yourself" }),
});

const ApplyAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [image, setImage] = React.useState<File | null>(null);
  const [idImage, setIdImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [idImagePreview, setIdImagePreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      region: "",
      idType: "",
      idNumber: "",
      about: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(file);
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setIdImage(file);
      setIdImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!image) {
      toast({
        title: "Profile image is required",
        variant: "destructive",
      });
      return;
    }

    if (!idImage) {
      toast({
        title: "ID document image is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert images to base64 for storage
      const profileImageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(image);
      });

      const idImageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(idImage);
      });

      // Submit application to Firebase
      const applicationId = await authService.submitHomeOwnerApplication({
        name: values.name,
        email: values.email,
        phone: values.phone,
        location: values.location,
        region: values.region,
        idType: values.idType,
        idNumber: values.idNumber,
        about: values.about,
        profileImageUrl: profileImageBase64,
        idImageUrl: idImageBase64,
      });

      console.log('Application submitted successfully with ID:', applicationId);

      toast({
        title: "Application Submitted Successfully!",
        description: "We will review your application and get back to you soon. You can track your application status in your dashboard.",
      });
      
      // Navigate back to homepage after submission
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-center">Apply as Home Owner</h1>
            <p className="text-center text-muted-foreground mt-2">
              Fill out the form below to apply to be a verified home owner on our platform
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoSection
                control={form.control}
                image={image}
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
              />

              <LocationInfoSection control={form.control} />

              <IdentificationSection
                control={form.control}
                idImage={idImage}
                idImagePreview={idImagePreview}
                onIdImageChange={handleIdImageChange}
              />

              <AboutSection control={form.control} />

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-ghana-primary hover:bg-ghana-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyAgent;
