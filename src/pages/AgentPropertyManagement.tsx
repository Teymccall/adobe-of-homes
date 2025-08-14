
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X, BadgeCheck, Home, Plus, User, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAgentById, getPropertiesByAgentId, mockProperties } from '@/data/mockData';
import { Property, VerificationStatus } from '@/data/types';

const AgentPropertyManagement = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const agent = id ? getAgentById(id) : undefined;
  
  // Get properties that are managed by this agent
  const managedProperties = agent ? getPropertiesByAgentId(agent.id) : [];
  
  // Get properties pending verification (this is mock data that would come from backend)
  const pendingVerificationProperties = mockProperties.filter(p => 
    p.verificationStatus === 'pending' && p.verifiedBy === undefined
  );
  
  // Get properties verified by this agent
  const verifiedProperties = mockProperties.filter(p => 
    p.verificationStatus === 'verified' && p.verifiedBy === id
  );
  
  const [activeTab, setActiveTab] = useState('managed');
  
  const handleVerifyProperty = (propertyId: string) => {
    // In a real app, this would be an API call to update the property
    toast({
      title: "Property Verified",
      description: "The property has been verified and assigned to you.",
    });
  };
  
  const handleRejectProperty = (propertyId: string) => {
    // In a real app, this would be an API call to update the property
    toast({
      title: "Property Rejected",
      description: "The property verification has been rejected.",
    });
  };
  
  const handleSetAvailability = (propertyId: string, availability: 'available' | 'pending' | 'unavailable') => {
    // In a real app, this would be an API call to update the property
    toast({
      title: "Availability Updated",
      description: `The property has been marked as ${availability}.`,
    });
  };
  
  if (!agent) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
          <p>The agent you are looking for does not exist or has been removed.</p>
          <Link to="/agents" className="text-ghana-primary hover:underline mt-4 inline-block">
            Back to Agents
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={`/agents/${id}`} className="text-ghana-primary hover:underline">
            &larr; Back to Profile
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <img
            src={agent.profileImage}
            alt={agent.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
          />
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              {agent.name}
              {agent.isVerified && <BadgeCheck className="text-ghana-verified" size={24} />}
            </h1>
            <p className="text-muted-foreground">Property Management Dashboard</p>
          </div>
          
          <div className="md:ml-auto">
            <Button asChild>
              <Link to="/submit-listing" className="flex items-center gap-2">
                <Plus size={16} />
                Add New Property
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="managed" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="managed">
              My Properties ({managedProperties.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Verification ({pendingVerificationProperties.length})
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified Properties ({verifiedProperties.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="managed" className="space-y-6">
            {managedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {managedProperties.map((property) => (
                  <PropertyManagementCard
                    key={property.id}
                    property={property}
                    onSetAvailability={handleSetAvailability}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Home className="mx-auto text-muted-foreground" size={48} />
                <h3 className="text-xl font-medium mt-4">No Properties Yet</h3>
                <p className="text-muted-foreground mt-2">
                  You haven't added any properties yet. Add your first property to get started.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/submit-listing" className="flex items-center gap-2">
                    <Plus size={16} />
                    Add New Property
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-6">
            {pendingVerificationProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingVerificationProperties.map((property) => (
                  <VerificationCard
                    key={property.id}
                    property={property}
                    onVerify={handleVerifyProperty}
                    onReject={handleRejectProperty}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Clock className="mx-auto text-muted-foreground" size={48} />
                <h3 className="text-xl font-medium mt-4">No Pending Verifications</h3>
                <p className="text-muted-foreground mt-2">
                  There are no properties waiting for verification at the moment.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verified" className="space-y-6">
            {verifiedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verifiedProperties.map((property) => (
                  <PropertyManagementCard
                    key={property.id}
                    property={property}
                    onSetAvailability={handleSetAvailability}
                    isVerifiedByMe
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <BadgeCheck className="mx-auto text-muted-foreground" size={48} />
                <h3 className="text-xl font-medium mt-4">No Verified Properties</h3>
                <p className="text-muted-foreground mt-2">
                  You haven't verified any properties yet. Check the pending verification tab.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface PropertyManagementCardProps {
  property: Property;
  onSetAvailability: (propertyId: string, availability: 'available' | 'pending' | 'unavailable') => void;
  isVerifiedByMe?: boolean;
}

const PropertyManagementCard = ({ property, onSetAvailability, isVerifiedByMe }: PropertyManagementCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.isVerified && (
          <div className="absolute top-2 right-2 verified-badge">
            <BadgeCheck size={14} />
            <span>Verified</span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
          <h3 className="text-white font-medium truncate">{property.title}</h3>
          <p className="text-white/90 text-sm truncate">{property.location}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold">GH₵ {property.price.toLocaleString()}</span>
          
          <Link to={`/property/${property.id}`} className="text-sm text-ghana-primary hover:underline">
            View Details
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {property.availability === 'available' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
              <Check size={12} />
              Available
            </span>
          )}
          {property.availability === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
              <Clock size={12} />
              Pending
            </span>
          )}
          {property.availability === 'unavailable' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">
              <X size={12} />
              Unavailable
            </span>
          )}
          {isVerifiedByMe && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
              <BadgeCheck size={12} />
              Verified by You
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-2 mt-4">
          <div className="text-sm font-medium mb-1">Update Availability:</div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={property.availability === 'available' ? 'bg-green-50 border-green-200' : ''}
              onClick={() => onSetAvailability(property.id, 'available')}
            >
              <Check size={14} className="mr-1 text-green-600" />
              Available
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={property.availability === 'pending' ? 'bg-yellow-50 border-yellow-200' : ''}
              onClick={() => onSetAvailability(property.id, 'pending')}
            >
              <Clock size={14} className="mr-1 text-yellow-600" />
              Pending
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={property.availability === 'unavailable' ? 'bg-red-50 border-red-200' : ''}
              onClick={() => onSetAvailability(property.id, 'unavailable')}
            >
              <X size={14} className="mr-1 text-red-600" />
              Unavailable
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface VerificationCardProps {
  property: Property;
  onVerify: (propertyId: string) => void;
  onReject: (propertyId: string) => void;
}

const VerificationCard = ({ property, onVerify, onReject }: VerificationCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <Clock size={12} />
          <span>Pending Verification</span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
          <h3 className="text-white font-medium truncate">{property.title}</h3>
          <p className="text-white/90 text-sm truncate">{property.location}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold">GH₵ {property.price.toLocaleString()}</span>
          
          <Link to={`/property/${property.id}`} className="text-sm text-ghana-primary hover:underline">
            View Details
          </Link>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <User size={14} />
          <span>Owner Submitted</span>
        </div>
        
        <div className="flex flex-col gap-3 mt-4">
          <div className="text-sm font-medium mb-1">Verification Action:</div>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onVerify(property.id)}
            >
              <Check size={16} className="mr-2" />
              Verify & Assign
            </Button>
            <Button 
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => onReject(property.id)}
            >
              <X size={16} className="mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPropertyManagement;
