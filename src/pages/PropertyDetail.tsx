
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PropertyHeader from '@/components/properties/PropertyHeader';
import PropertyGallery from '@/components/properties/PropertyGallery';
import PropertyVerification from '@/components/properties/PropertyVerification';
import PropertyDetails from '@/components/properties/PropertyDetails';
import AgentContact from '@/components/properties/AgentContact';
import PropertyNotFound from '@/components/properties/PropertyNotFound';
import { propertyService } from '@/services/propertyService';
import { authService } from '@/services/authService';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [agent, setAgent] = useState<any>(null);
  const [verifyingAgent, setVerifyingAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const propertyData = await propertyService.getProperty(id);
        setProperty(propertyData);

        if (propertyData) {
          // Fetch home owner data
          const homeOwners = await authService.getVerifiedHomeOwners();
          const homeOwner = homeOwners.find(owner => owner.uid === propertyData.homeOwnerId);
          setAgent(homeOwner);

          // Fetch verifying agent if property is verified
          if (propertyData.verifiedBy) {
            const verifier = homeOwners.find(owner => owner.uid === propertyData.verifiedBy);
            setVerifyingAgent(verifier);
          }
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return <PropertyNotFound />;
  }

  // For admin-created properties, we might not have an agent, so create a fallback
  const displayAgent = agent || {
    uid: property.homeOwnerId,
    displayName: property.ownerName || 'Admin User',
    email: property.ownerEmail || '',
    phone: property.ownerPhone || '',
    isVerified: true,
    profileImage: '',
    bio: 'Property created by platform administrator',
    yearsOfExperience: 0,
    properties: [],
    reviews: [],
    averageRating: 0,
    verifiedProperties: []
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/search" className="text-ghana-primary hover:underline">
            &larr; Back to Search
          </Link>
        </div>

        {/* Property Header */}
        <PropertyHeader property={property} />

        {/* Property Images */}
        <PropertyGallery images={property.images} title={property.title} />

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Verification Info */}
            {verifyingAgent && (
              <PropertyVerification 
                verifyingAgent={verifyingAgent} 
                verificationDate={property.verificationDate} 
              />
            )}
            
            {/* Property Info */}
            <PropertyDetails property={property} />
          </div>

          {/* Agent Info & Contact */}
          <div>
            <AgentContact 
              agent={displayAgent} 
              propertyTitle={property.title} 
              propertyPrice={property.price} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
