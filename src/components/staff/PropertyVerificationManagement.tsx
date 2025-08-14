import React, { useState } from 'react';
import { Shield, Check, X, MapPin, User, Phone, Eye, UserPlus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockProperties } from '@/data/mockData';
import { Property, HomeOwner } from '@/data/types';
import AddHomeOwnerDialog from './AddHomeOwnerDialog';
import AddPropertyDialog from './AddPropertyDialog';

const PropertyVerificationManagement = () => {
  const { toast } = useToast();
  const [pendingProperties, setPendingProperties] = useState(
    mockProperties.filter(property => property.verificationStatus === 'pending')
  );
  const [isAddHomeOwnerDialogOpen, setIsAddHomeOwnerDialogOpen] = useState(false);
  const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(false);

  const handleApprove = (property: Property) => {
    toast({
      title: "Property Approved",
      description: `"${property.title}" has been approved and is now live on the platform.`,
    });

    setPendingProperties(prev => prev.filter(p => p.id !== property.id));
  };

  const handleReject = (property: Property) => {
    toast({
      title: "Property Rejected",
      description: `"${property.title}" has been rejected. The owner will be notified.`,
      variant: "destructive",
    });

    setPendingProperties(prev => prev.filter(p => p.id !== property.id));
  };

  const handleAddHomeOwner = (homeOwnerData: HomeOwner) => {
    // Save to localStorage for persistence
    const existingHomeOwners = JSON.parse(localStorage.getItem('homeOwners') || '[]');
    const updatedHomeOwners = [...existingHomeOwners, homeOwnerData];
    localStorage.setItem('homeOwners', JSON.stringify(updatedHomeOwners));
  };

  const handleAddProperty = (propertyData: Property) => {
    // Add the new property to pending list
    setPendingProperties(prev => [...prev, propertyData]);
    toast({
      title: "Property Added",
      description: "New property has been added and is pending verification.",
    });
  };

  if (pendingProperties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddPropertyDialogOpen(true)} variant="outline" className="gap-2">
              <Plus size={16} />
              Add Property
            </Button>
            <Button onClick={() => setIsAddHomeOwnerDialogOpen(true)} className="gap-2">
              <UserPlus size={16} />
              Add Home Owner
            </Button>
          </div>
        </div>
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Pending Verifications</h2>
          <p className="text-muted-foreground">
            All properties have been verified. New submissions will appear here.
          </p>
        </div>
        <AddHomeOwnerDialog
          open={isAddHomeOwnerDialogOpen}
          onClose={() => setIsAddHomeOwnerDialogOpen(false)}
          onSubmit={handleAddHomeOwner}
        />
        <AddPropertyDialog
          open={isAddPropertyDialogOpen}
          onClose={() => setIsAddPropertyDialogOpen(false)}
          onSubmit={handleAddProperty}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Shield size={24} />
            Property Verification
          </h2>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {pendingProperties.length} Pending
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddPropertyDialogOpen(true)} variant="outline" className="gap-2">
            <Plus size={16} />
            Add Property
          </Button>
          <Button onClick={() => setIsAddHomeOwnerDialogOpen(true)} className="gap-2">
            <UserPlus size={16} />
            Add Home Owner
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingProperties.map(property => (
          <Card key={property.id} className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-yellow-500 text-white">
                  Pending
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <div className="flex items-center text-muted-foreground text-sm gap-1">
                <MapPin size={14} />
                <span>{property.location}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-ghana-primary">
                  GH₵ {property.price.toLocaleString()}
                </span>
                <div className="text-sm text-muted-foreground">
                  {property.bedrooms} bed • {property.bathrooms} bath
                </div>
              </div>

              {property.ownerName && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                  <User size={14} />
                  <span className="font-medium">{property.ownerName}</span>
                  {property.ownerPhone && (
                    <>
                      <span className="opacity-50">•</span>
                      <Phone size={14} />
                      <span>{property.ownerPhone}</span>
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Property Details",
                      description: "Property details view would open here.",
                    });
                  }}
                >
                  <Eye size={16} className="mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(property)}
                >
                  <Check size={16} className="mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReject(property)}
                >
                  <X size={16} className="mr-1" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddHomeOwnerDialog
        open={isAddHomeOwnerDialogOpen}
        onClose={() => setIsAddHomeOwnerDialogOpen(false)}
        onSubmit={handleAddHomeOwner}
      />
      <AddPropertyDialog
        open={isAddPropertyDialogOpen}
        onClose={() => setIsAddPropertyDialogOpen(false)}
        onSubmit={handleAddProperty}
      />
    </div>
  );
};

export default PropertyVerificationManagement;
