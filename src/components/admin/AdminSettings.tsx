
import React, { useState } from 'react';
import { Settings, Save, CheckCircle, Globe, Mail, Phone, Shield, Users, Building2, FileText, Bell, Database, Palette, Zap, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const settingsSchema = z.object({
  // General Settings
  siteName: z.string().min(2, { message: "Site name must be at least 2 characters" }),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }),
  supportPhone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  aboutText: z.string().min(10, { message: "About text must be at least 10 characters" }),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  
  // Feature Toggles
  enableRegistration: z.boolean(),
  enablePropertySubmissions: z.boolean(),
  requireVerificationForProperties: z.boolean(),
  enableReviews: z.boolean(),
  enableArtisanApplications: z.boolean(),
  enableEstateManagement: z.boolean(),
  
  // System Settings
  maintenanceMode: z.boolean(),
  enableAnalytics: z.boolean(),
  enableBackups: z.boolean(),
  
  // Notification Settings
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  adminAlerts: z.boolean(),
  
  // Security Settings
  requireEmailVerification: z.boolean(),
  enableRateLimiting: z.boolean(),
  sessionTimeout: z.number().min(15).max(480),
});

const AdminSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      // General Settings
      siteName: "Ghana Real Estate Portal",
      contactEmail: "info@ghanarealestate.com",
      supportPhone: "+233 20 123 4567",
      aboutText: "Ghana's premier real estate marketplace connecting property buyers, sellers, and renters with verified agents.",
      websiteUrl: "https://ghanarealestate.com",
      
      // Feature Toggles
      enableRegistration: true,
      enablePropertySubmissions: true,
      requireVerificationForProperties: true,
      enableReviews: true,
      enableArtisanApplications: true,
      enableEstateManagement: true,
      
      // System Settings
      maintenanceMode: false,
      enableAnalytics: true,
      enableBackups: true,
      
      // Notification Settings
      emailNotifications: true,
      smsNotifications: false,
      adminAlerts: true,
      
      // Security Settings
      requireEmailVerification: true,
      enableRateLimiting: true,
      sessionTimeout: 120,
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Settings saved:", values);
      setIsSaving(false);
      
      toast({
        title: "Settings Saved",
        description: "Your system settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Settings Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings Overview
          </CardTitle>
          <CardDescription>
            Manage your platform configuration and system preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">System Status</p>
                <p className="text-xs text-green-600">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Last Backup</p>
                <p className="text-xs text-blue-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Active Features</p>
                <p className="text-xs text-purple-600">12 of 15 enabled</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic website configuration and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ghana Real Estate Portal" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your website displayed in the header.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your main website URL.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="info@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Primary contact email for website inquiries.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supportPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+233 XX XXX XXXX" {...field} />
                      </FormControl>
                      <FormDescription>
                        Phone number for customer support.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="aboutText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Text</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter information about your website..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Short description of your website for the About section.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Feature Management
              </CardTitle>
              <CardDescription>
                Enable or disable platform features and functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="enableRegistration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Agent Registration
                        </FormLabel>
                        <FormDescription>
                          Allow agents to register on the platform.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enablePropertySubmissions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Property Submissions
                        </FormLabel>
                        <FormDescription>
                          Allow agents to submit new properties.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableArtisanApplications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Artisan Applications
                        </FormLabel>
                        <FormDescription>
                          Allow artisans to apply for platform access.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableEstateManagement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Estate Management
                        </FormLabel>
                        <FormDescription>
                          Enable estate management features.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requireVerificationForProperties"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Property Verification
                        </FormLabel>
                        <FormDescription>
                          All properties must be verified by admin.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableReviews"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          User Reviews
                        </FormLabel>
                        <FormDescription>
                          Allow users to leave reviews for agents.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Advanced system settings and maintenance options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="enableAnalytics"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Analytics
                        </FormLabel>
                        <FormDescription>
                          Enable system analytics and tracking.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableBackups"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Auto Backups
                        </FormLabel>
                        <FormDescription>
                          Enable automatic system backups.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-amber-200 bg-amber-50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Maintenance Mode
                      </FormLabel>
                      <FormDescription className="text-amber-800">
                        Put the website into maintenance mode. Only admins can access the site.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requireEmailVerification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Verification
                        </FormLabel>
                        <FormDescription>
                          Require email verification for new accounts.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableRateLimiting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Rate Limiting
                        </FormLabel>
                        <FormDescription>
                          Enable API rate limiting for security.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="sessionTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="120" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      How long before users are automatically logged out (15-480 minutes).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Notifications
                        </FormLabel>
                        <FormDescription>
                          Send notifications via email.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="smsNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          SMS Notifications
                        </FormLabel>
                        <FormDescription>
                          Send notifications via SMS.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adminAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Admin Alerts
                        </FormLabel>
                        <FormDescription>
                          Send critical alerts to administrators.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save All Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminSettings;
