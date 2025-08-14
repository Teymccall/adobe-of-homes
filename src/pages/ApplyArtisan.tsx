
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Upload, UserPlus, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArtisanApplicationStatus } from '@/data/types';
import { authService } from '@/services/authService';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  location: z.string().min(2, { message: "Location is required" }),
  skills: z.string().min(3, { message: "Please enter at least one skill" }),
  about: z.string().min(20, { message: "Please provide a brief description about yourself" }),
});

// Default profile photo placeholder
const DEFAULT_PROFILE_PHOTO = '/placeholder.svg';
const DEFAULT_ID_PHOTO = '/placeholder.svg';

const ApplyArtisan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_PHOTO);
  const [idPhoto, setIdPhoto] = useState(DEFAULT_ID_PHOTO);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      skills: '',
      about: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!profileFile) {
      toast({
        title: "Profile photo is required",
        variant: "destructive",
      });
      return;
    }

    if (!idFile) {
      toast({
        title: "ID document is required",
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
        reader.readAsDataURL(profileFile);
      });

      const idImageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(idFile);
      });

      // Submit application to Firebase
      const applicationId = await authService.submitArtisanApplication({
        name: values.name,
        email: values.email,
        phone: values.phone,
        location: values.location,
        skills: values.skills.split(',').map(skill => skill.trim()),
        about: values.about,
        profileImageUrl: profileImageBase64,
        idImageUrl: idImageBase64,
      });

      console.log('Artisan application submitted successfully with ID:', applicationId);

      toast({
        title: "Application Submitted Successfully!",
        description: "Your application has been submitted for review. We'll notify you once it's approved.",
      });

      // Redirect back to artisans page
      setTimeout(() => navigate('/artisans'), 2000);
    } catch (error) {
      console.error('Error submitting artisan application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload with preview and file storage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<string>>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/artisans')}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Artisans
        </Button>

        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <UserPlus size={24} className="text-ghana-primary mr-2" />
            <h1 className="text-2xl font-bold">Apply to Join as an Artisan</h1>
          </div>

          <p className="text-muted-foreground mb-6">
            Fill out the form below to apply as an artisan. Your application will be reviewed by our administrators.
            Only approved applications will appear on the website.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Accra, Ghana" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="Plumbing, Electrical, Carpentry (separate with commas)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your skills separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Yourself</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your experience, qualifications, and why you want to join our platform..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormLabel htmlFor="profile-photo">Profile Photo</FormLabel>
                  <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
                    <img
                      src={profilePhoto}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover mb-2 rounded-md"
                    />
                    <div className="flex flex-col items-center">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('profile-photo')?.click()}
                        type="button"
                        className="flex items-center gap-2"
                      >
                        <Upload size={16} />
                        Upload Photo
                      </Button>
                      <input
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setProfilePhoto, setProfileFile)}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel htmlFor="id-photo">ID Photo</FormLabel>
                  <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
                    <img
                      src={idPhoto}
                      alt="ID Preview"
                      className="w-32 h-32 object-cover mb-2 rounded-md"
                    />
                    <div className="flex flex-col items-center">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('id-photo')?.click()}
                        type="button"
                        className="flex items-center gap-2"
                      >
                        <Upload size={16} />
                        Upload ID
                      </Button>
                      <input
                        id="id-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setIdPhoto, setIdFile)}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        National ID, Passport, Driver's License
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-ghana-primary hover:bg-ghana-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyArtisan;
