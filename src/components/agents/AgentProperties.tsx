
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Home, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Property } from '@/data/types';
import { propertyService } from '@/services/propertyService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface AgentPropertiesProps {
  agentId: string;
}

const AgentProperties = ({ agentId }: AgentPropertiesProps) => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const allProperties = await propertyService.getAllProperties();
        // Get properties that are managed by this home owner OR verified by this home owner
        const agentProperties = allProperties.filter(
          property => property.homeOwnerId === agentId || 
          (property.verificationStatus === 'verified' && property.verifiedBy === agentId)
        );
        setProperties(agentProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [agentId, toast]);

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      await propertyService.deleteProperty(propertyToDelete.id);
      
      // Remove from local state
      setProperties(properties.filter(p => p.id !== propertyToDelete.id));
      
      toast({
        title: "Property Deleted",
        description: `${propertyToDelete.title} has been successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Home className="mx-auto text-muted-foreground" size={48} />
        <h3 className="text-xl font-medium mt-4">No Properties Yet</h3>
        <p className="text-muted-foreground mt-2">
          You haven't added any properties yet. Add your first property to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative aspect-video">
              <img 
                src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.svg'} 
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              {property.isVerified && (
                <div className="absolute top-2 right-2 verified-badge">
                  <BadgeCheck size={14} />
                  <span>Verified</span>
                </div>
              )}
              {property.verifiedBy === agentId && property.homeOwnerId !== agentId && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <BadgeCheck size={12} />
                  <span>Verified by You</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1">{property.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{property.location}</p>
              <p className="font-bold text-lg mb-4">GH₵ {property.price.toLocaleString()}</p>
              
              <div className="flex items-center justify-between">
                <Button asChild variant="outline" className="flex items-center gap-1">
                  <Link to={`/property/${property.id}`}>
                    <Eye size={16} />
                    View
                  </Link>
                </Button>
                {property.homeOwnerId === agentId && (
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProperty(property)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{propertyToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentProperties;
