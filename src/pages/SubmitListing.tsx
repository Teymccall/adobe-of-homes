
import React, { useState } from 'react';
import { BadgeCheck, Upload, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { VerificationStatus } from '@/data/types';
import { useMaps } from '@/context/MapsContext';
import MapboxPicker from '@/components/maps/MapboxPicker';

const SubmitListing = () => {
  const { toast } = useToast();
  const { mapboxAccessToken, setMapboxAccessToken } = useMaps();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgent, setIsAgent] = useState(false); // Would be determined by authentication in a real app
  const [isAdmin, setIsAdmin] = useState(false); // Would be determined by authentication in a real app
  const [showMapPicker, setShowMapPicker] = useState(false);
  
  // Check if user is logged in as agent or admin (mock implementation)
  const checkUserRole = () => {
    // In a real app, this would check the authenticated user's role
    const userRole = localStorage.getItem('userRole');
    setIsAgent(userRole === 'agent');
    setIsAdmin(userRole === 'admin');
    
    // Show map picker only for agents and admins
    setShowMapPicker(userRole === 'agent' || userRole === 'admin');
  };
  
  React.useEffect(() => {
    checkUserRole();
  }, []);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    status: 'rent',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    region: '',
    town: '',
    stayDuration: '',
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    agreeTerms: false,
    mapLocation: {
      lat: 5.6037,
      lng: -0.1870
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationSelected = (location: { lat: number; lng: number }) => {
    setFormData({
      ...formData,
      mapLocation: location
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation
    if (!formData.title || !formData.location || !formData.price || !formData.agentPhone || !formData.region) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, this would save to the database with pending verification status
    const listingData = {
      ...formData,
      verificationStatus: 'pending' as VerificationStatus,
      submittedDate: new Date().toISOString(),
    };
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Submitted listing with pending verification:', listingData);
      
      toast({
        title: "Listing Submitted",
        description: "Your listing has been submitted for verification. It will be published after review.",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        propertyType: '',
        status: 'rent',
        price: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        location: '',
        region: '',
        town: '',
        stayDuration: '',
        agentName: '',
        agentPhone: '',
        agentEmail: '',
        agreeTerms: false,
        mapLocation: {
          lat: 5.6037,
          lng: -0.1870
        }
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  // Ghana regions for the dropdown
  const ghanaRegions = [
    "Greater Accra",
    "Ashanti",
    "Western",
    "Eastern",
    "Central",
    "Northern",
    "Upper East",
    "Upper West",
    "Volta",
    "Bono",
    "Bono East",
    "Ahafo",
    "Savannah",
    "North East",
    "Oti",
    "Western North"
  ];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Submit a Property Listing</h1>
            <p className="text-muted-foreground">
              Complete the form below to submit your property for review. All listings will be verified before being published.
            </p>
            
            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 flex items-center gap-2 justify-center">
              <MapPin size={16} />
              <span>Your listing will be reviewed by verified agents in your selected region before it appears on the site.</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Details Section */}
            <div>
              <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
                Property Details <BadgeCheck className="text-ghana-verified" size={18} />
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., 3 Bedroom Apartment in East Legon"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Address/Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., 123 Oxford Street, East Legon"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Region *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => handleSelectChange('region', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {ghanaRegions.map(region => (
                            <SelectItem key={region} value={region.toLowerCase()}>{region}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="town">Town/Area</Label>
                    <Input
                      id="town"
                      name="town"
                      placeholder="e.g., East Legon, Tema"
                      value={formData.town}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your property in detail..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => handleSelectChange('propertyType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">For Rent/Sale *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="rent">For Rent</SelectItem>
                          <SelectItem value="sale">For Sale</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price (GH₵) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="e.g., 1500"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="area">Area (m²)</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      placeholder="e.g., 100"
                      value={formData.area}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      placeholder="e.g., 3"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stayDuration">Duration of Stay</Label>
                    <Select
                      value={formData.stayDuration}
                      onValueChange={(value) => handleSelectChange('stayDuration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="short">Short Stay</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="2years">2 Years</SelectItem>
                          <SelectItem value="3plus">3+ Years</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Map Location Picker - Only visible to agents and admins */}
                {(isAgent || isAdmin || (process.env.NODE_ENV === 'development')) && (
                  <div className="mt-6">
                    <Label>Map Location</Label>
                    
                    {!mapboxAccessToken ? (
                      <div className="mt-2 space-y-3">
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800">
                            To use the map location picker, please enter your Mapbox access token below.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            placeholder="Enter Mapbox Access Token"
                            value={mapboxAccessToken}
                            onChange={(e) => setMapboxAccessToken(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => setShowMapPicker(true)}
                            disabled={!mapboxAccessToken}
                          >
                            Use Map
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <MapboxPicker
                        accessToken={mapboxAccessToken}
                        initialLocation={formData.mapLocation}
                        onLocationSelected={handleLocationSelected}
                      />
                    )}
                  </div>
                )}
                
                <div>
                  <Label htmlFor="images">Property Images</Label>
                  <div className="mt-1 border-2 border-dashed border-muted rounded-md p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Button variant="outline" type="button">
                        Upload Images
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB each. You can upload up to 8 images.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Contact Information Section */}
            <div>
              <h2 className="text-xl font-medium mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="agentName">Your Name</Label>
                    <Input
                      id="agentName"
                      name="agentName"
                      placeholder="e.g., John Mensah"
                      value={formData.agentName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="agentPhone">Phone Number *</Label>
                    <Input
                      id="agentPhone"
                      name="agentPhone"
                      placeholder="e.g., +233201234567"
                      value={formData.agentPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="agentEmail">Email</Label>
                    <Input
                      id="agentEmail"
                      name="agentEmail"
                      type="email"
                      placeholder="e.g., john@example.com"
                      value={formData.agentEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 pt-4">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                className="mt-1"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                required
              />
              <Label htmlFor="agreeTerms" className="text-sm">
                I agree that my information will be verified by the GhanaHomes team and local agents 
                before my listing is published. I confirm that I am the owner or 
                authorized agent for this property.
              </Label>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-ghana-primary hover:bg-ghana-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Listing for Verification'}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-2">
                * All listings are subject to verification before being published
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitListing;
