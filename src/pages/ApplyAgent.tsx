
import React, { useState } from 'react';
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
import { ChevronLeft, ChevronRight, Check, Eye } from 'lucide-react';
import PersonalInfoSection from '@/components/apply/PersonalInfoSection';
import LocationInfoSection from '@/components/apply/LocationInfoSection';
import IdentificationSection from '@/components/apply/IdentificationSection';
import AboutSection from '@/components/apply/AboutSection';
import ReviewSection from '@/components/apply/ReviewSection';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { cloudinaryService } from '@/services/cloudinaryService';

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
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = React.useState<File | null>(null);
  const [idImage, setIdImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [idImagePreview, setIdImagePreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const totalSteps = 5; // 4 form sections + 1 review

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
    mode: "onChange",
  });

  // Debug form state changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('Form field changed:', { name, type, value });
    });
    return () => subscription.unsubscribe();
  }, [form]);

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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
      const currentValues = form.getValues();
      let canProceed = true;
      let errorMessage = '';

      console.log('Validating step', currentStep, 'with values:', currentValues);

      switch (currentStep) {
        case 1: // Personal Information
          console.log('Step 1 validation:', {
            name: currentValues.name,
            email: currentValues.email,
            phone: currentValues.phone,
            image: image
          });
          if (!currentValues.name || !currentValues.email || !currentValues.phone || !image) {
            canProceed = false;
            errorMessage = 'Please fill in all personal information fields and upload a profile image.';
          }
          break;
        case 2: // Location
          console.log('Step 2 validation:', {
            location: currentValues.location,
            region: currentValues.region
          });
          if (!currentValues.location || !currentValues.region) {
            canProceed = false;
            errorMessage = 'Please fill in all location information.';
          }
          break;
        case 3: // Identification
          console.log('Step 3 validation:', {
            idType: currentValues.idType,
            idNumber: currentValues.idNumber,
            idImage: idImage
          });
          if (!currentValues.idType || !currentValues.idNumber || !idImage) {
            canProceed = false;
            errorMessage = 'Please fill in all identification fields and upload an ID document.';
          }
          break;
        case 4: // About
          console.log('Step 4 validation:', {
            about: currentValues.about,
            aboutLength: currentValues.about?.length
          });
          if (!currentValues.about || currentValues.about.length < 50) {
            canProceed = false;
            errorMessage = 'Please provide at least 50 characters about yourself.';
          }
          break;
      }

      console.log('Step validation result:', { canProceed, errorMessage });

      if (!canProceed) {
        toast({
          title: "Incomplete Information",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // For application forms, we don't require authentication
    // Users can submit applications without being logged in
    // Authentication will be required later when they want to access their dashboard

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

      console.log('Starting form submission...', { values, user: user?.uid || 'unauthenticated' });

      // Upload images to Cloudinary first
      console.log('Uploading profile image to Cloudinary...');
      const profileImageResult = await cloudinaryService.uploadFile(image, {
        folder: 'profiles',
        resourceType: 'image',
        quality: 'auto',
        format: 'auto'
      });

      console.log('Profile image uploaded to Cloudinary:', profileImageResult);

      console.log('Uploading ID image to Cloudinary...');
      const idImageResult = await cloudinaryService.uploadFile(idImage, {
        folder: 'documents',
        resourceType: 'image',
        quality: 'auto',
        format: 'auto'
      });

      console.log('ID image uploaded to Cloudinary:', idImageResult);

      // Submit application to Firebase with Cloudinary URLs
      const applicationId = await authService.submitHomeOwnerApplication({
        name: values.name,
        email: values.email,
        phone: values.phone,
        location: values.location,
        region: values.region,
        idType: values.idType,
        idNumber: values.idNumber,
        about: values.about,
        profileImageUrl: profileImageResult.secureUrl,
        idImageUrl: idImageResult.secureUrl,
        profileImagePublicId: profileImageResult.publicId,
        idImagePublicId: idImageResult.publicId
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
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ghana-primary to-ghana-primary/80 rounded-full mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Apply as Home Owner</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our trusted network of verified property owners. Get started by filling out the form below.
            </p>
            
            {/* Interactive Progress indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-3">
                {[
                  { step: 1, title: "Personal Info", icon: "👤" },
                  { step: 2, title: "Location", icon: "📍" },
                  { step: 3, title: "Verification", icon: "🛡️" },
                  { step: 4, title: "About", icon: "💬" },
                  { step: 5, title: "Review", icon: "👁️" }
                ].map((item, index) => (
                  <React.Fragment key={item.step}>
                    <div 
                      className={`flex items-center cursor-pointer transition-all duration-300 ${
                        currentStep >= item.step ? 'opacity-100' : 'opacity-50'
                      }`}
                      onClick={() => goToStep(item.step)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        currentStep > item.step 
                          ? 'bg-green-500 text-white' 
                          : currentStep === item.step 
                            ? 'bg-ghana-primary text-white shadow-lg scale-110' 
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {currentStep > item.step ? (
                          <Check size={14} />
                        ) : (
                          <span className="text-sm">{item.icon}</span>
                        )}
                      </div>
                      <span className={`ml-2 text-xs font-medium transition-colors duration-300 ${
                        currentStep >= item.step ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {item.title}
                      </span>
                    </div>
                    {index < 4 && (
                      <div className={`w-8 h-0.5 transition-all duration-300 ${
                        currentStep > item.step ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Application Information */}
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Ready to Apply!</h3>
                  <p className="text-blue-700">You can submit your application without signing in. We'll create your account after approval.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate('/home-owner-login')}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Already Have Account? Sign In
                </Button>
              </div>
              
              <p className="text-sm text-blue-600 mt-3">
                <strong>Note:</strong> After submitting, you'll receive an email when your application is approved. Then you can sign in with the credentials we'll provide.
              </p>
            </div>
          )}

          {/* Authenticated User Status */}
          {user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Authenticated as {user.email}</p>
                    <p className="text-xs text-green-600">You can now submit your application</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
              </div>
            </div>
          )}

                    <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4" 
              noValidate
            >
              {/* Step-by-step form container */}
              <div className="relative">
                {/* Step 1: Personal Information */}
                <div className={currentStep === 1 ? "block" : "hidden"}>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <PersonalInfoSection
                      control={form.control}
                      image={image}
                      imagePreview={imagePreview}
                      onImageChange={handleImageChange}
                      setImage={setImage}
                      setImagePreview={setImagePreview}
                    />
                  </div>
                </div>

                {/* Step 2: Location Information */}
                <div className={currentStep === 2 ? "block" : "hidden"}>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <LocationInfoSection control={form.control} />
                  </div>
                </div>

                {/* Step 3: Identification */}
                <div className={currentStep === 3 ? "block" : "hidden"}>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <IdentificationSection
                      control={form.control}
                      idImage={idImage}
                      idImagePreview={idImagePreview}
                      onIdImageChange={handleIdImageChange}
                    />
                  </div>
                </div>

                {/* Step 4: About */}
                <div className={currentStep === 4 ? "block" : "hidden"}>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <AboutSection control={form.control} />
                  </div>
                </div>

                {/* Step 5: Review */}
                <div className={currentStep === 5 ? "block" : "hidden"}>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <ReviewSection 
                      formData={form.getValues()}
                      imagePreview={imagePreview}
                      idImagePreview={idImagePreview}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3"
                >
                  <ChevronLeft size={18} />
                  Previous
                </Button>

                <div className="flex gap-3">
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-ghana-primary hover:bg-ghana-primary/90 px-6 py-3 flex items-center gap-2"
                    >
                      Next
                      <ChevronRight size={18} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 px-8 py-3 flex items-center gap-2 shadow-lg"
                      disabled={isSubmitting}
                      onClick={() => {
                        console.log('Submit button clicked');
                        console.log('Form state:', form.formState);
                        console.log('Form values:', form.getValues());
                        console.log('Form errors:', form.formState.errors);
                        console.log('Current step:', currentStep);
                        console.log('Image:', image);
                        console.log('ID Image:', idImage);
                        
                        // Trigger form validation
                        form.trigger();
                        console.log('Form validation triggered');
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Submit Application
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Step indicator */}
              <div className="text-center text-xs text-gray-500 pt-2">
                Step {currentStep} of {totalSteps}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyAgent;
