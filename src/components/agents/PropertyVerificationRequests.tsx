
import React, { useState } from 'react';
import { Shield, Check, X, MapPin, User, Home, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockProperties } from '@/data/mockData';
import { Property } from '@/data/types';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

interface PropertyVerificationRequestsProps {
  agentId: string;
  agentRegion?: string;
}

const PropertyVerificationRequests = ({ agentId, agentRegion }: PropertyVerificationRequestsProps) => {
  const { toast } = useToast();
  const [verificationRequests, setVerificationRequests] = useState(
    // Filter properties that are pending verification and match home owner's region
    mockProperties.filter(property => {
      return property.verificationStatus === 'pending' &&
             (!property.verifiedBy || property.verifiedBy === '') &&
             (agentRegion?.toLowerCase() === property.location.toLowerCase() || 
              property.location.toLowerCase().includes(agentRegion?.toLowerCase() || ''));
    })
  );

  const handleVerify = (property: Property) => {
    // In a real app, this would send a request to the API
    toast({
      title: "Property Verified",
      description: `You have verified "${property.title}". It will now be visible on the site.`,
    });

    // Remove from pending list
    setVerificationRequests(prev => 
      prev.filter(p => p.id !== property.id)
    );
  };

  const handleReject = (property: Property) => {
    // In a real app, this would send a request to the API
    toast({
      title: "Property Rejected",
      description: `You have rejected "${property.title}". The owner will be notified.`,
      variant: "destructive",
    });

    // Remove from pending list
    setVerificationRequests(prev => 
      prev.filter(p => p.id !== property.id)
    );
  };

  if (verificationRequests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Shield className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Verification Requests</h2>
        <p className="text-muted-foreground">
          You don't have any property verification requests in your region at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Property Verification Requests</h2>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          {verificationRequests.length} Pending
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {verificationRequests.map(property => (
          <Card key={property.id} className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="font-medium text-white">{property.title}</h3>
                <div className="flex items-center text-white/80 text-sm gap-1">
                  <MapPin size={14} />
                  <span>{property.location}</span>
                </div>
                
                {/* Owner info directly on the image */}
                {property.ownerName && property.ownerPhone && (
                  <div className="mt-2 flex items-center gap-2 bg-black/30 p-1.5 rounded text-white/90 text-xs">
                    <User size={12} />
                    <span>{property.ownerName}</span>
                    <span className="opacity-75">•</span>
                    <Phone size={12} />
                    <a href={`tel:${property.ownerPhone}`} className="hover:underline">
                      {property.ownerPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">GH₵ {property.price.toLocaleString()}</span>
                <div className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  <Shield size={12} />
                  <span>Needs Verification</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="block font-medium">{property.bedrooms}</span>
                  <span className="text-xs text-muted-foreground">Beds</span>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="block font-medium">{property.bathrooms}</span>
                  <span className="text-xs text-muted-foreground">Baths</span>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="block font-medium">{property.area}m²</span>
                  <span className="text-xs text-muted-foreground">Area</span>
                </div>
              </div>
              
              {property.ownerPhone && (
                <div className="mt-2">
                  <WhatsAppButton 
                    phoneNumber={property.ownerPhone}
                    message={`Hello, this is a home owner from Ghana Real Estate regarding your property: ${property.title}. I would like to schedule a verification visit.`}
                    className="text-xs w-full bg-green-500 hover:bg-green-600 text-white py-1 rounded-md flex items-center justify-center gap-1"
                  />
                </div>
              )}
              
              <div className="border-t pt-4 flex gap-3">
                <Button 
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleVerify(property)}
                >
                  <Check size={16} className="mr-2" />
                  Verify
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleReject(property)}
                >
                  <X size={16} className="mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyVerificationRequests;
