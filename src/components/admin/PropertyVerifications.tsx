
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Shield, Check, X, Search, Trash2, Images } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { adminService } from '@/services/adminService';
import { Property, VerificationStatus } from '@/data/types';

const PropertyVerifications = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<VerificationStatus | 'all'>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getPropertiesForVerification();
        setProperties(data);
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
  }, [toast]);

  // Get all properties that need verification
  const filteredProperties = properties.filter(property => {
    // First apply status filter
    const statusMatch = filterStatus === 'all' || property.verificationStatus === filterStatus;
    
    // Then apply search filter if needed
    const searchMatch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const handleVerify = (property: Property) => {
    // In a real app, this would update the database
    toast({
      title: "Property Verified",
      description: `${property.title} has been verified and is now visible on the site.`
    });
    setIsDialogOpen(false);
  };

  const handleReject = (property: Property) => {
    // In a real app, this would update the database
    toast({
      title: "Property Rejected",
      description: `${property.title} has been rejected.`,
      variant: "destructive"
    });
    setIsDialogOpen(false);
  };

  const handleAssign = (property: Property, agentId: string) => {
    // In a real app, this would assign the property to an agent for verification
    toast({
      title: "Property Assigned",
      description: `${property.title} has been assigned to an agent for verification.`
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (property: Property) => {
    // In a real app, this would delete the property from the database
    toast({
      title: "Property Deleted",
      description: `${property.title} has been permanently deleted.`,
      variant: "destructive"
    });
    setPropertyToDelete(null);
  };

  const openPropertyDialog = (property: Property) => {
    setSelectedProperty(property);
    setIsDialogOpen(true);
  };

  const openImageGallery = (property: Property, imageIndex: number = 0) => {
    setSelectedProperty(property);
    setSelectedImageIndex(imageIndex);
    setIsGalleryOpen(true);
  };

  const nextImage = () => {
    if (selectedProperty && selectedProperty.images) {
      setSelectedImageIndex((prev) => 
        prev < selectedProperty.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty && selectedProperty.images) {
      setSelectedImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedProperty.images.length - 1
      );
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">Unverified</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by title or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value as VerificationStatus | 'all')}
        >
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? "Try adjusting your search criteria" 
              : "There are no properties matching the selected filter"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden lg:table-cell">Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
                            <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading properties...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredProperties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No properties found for verification.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded overflow-hidden bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => openImageGallery(property, 0)}
                      >
                        {property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Shield size={20} />
                          </div>
                        )}
                      </div>
                      <span className="line-clamp-2">{property.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    GH₵ {property.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {property.ownerName || "Unknown Owner"}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(property.verificationStatus)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openPropertyDialog(property)}
                      >
                        View Details
                      </Button>
                      {property.images && property.images.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openImageGallery(property, 0)}
                          className="flex items-center gap-1"
                        >
                          <Images size={14} />
                          Gallery
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setPropertyToDelete(property)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Property</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this property? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(property)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Property
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                                    </TableRow>
                  ))
                  )}
                </TableBody>
          </Table>
        </div>
      )}
      
      {/* Property Details Dialog */}
      {selectedProperty && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Property Verification</DialogTitle>
              <DialogDescription>
                Review the property details before making a decision.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-[4/3] overflow-hidden rounded-md mb-4 relative group">
                  {selectedProperty.images && selectedProperty.images.length > 0 ? (
                    <>
                      <img 
                        src={selectedProperty.images[0]} 
                        alt={selectedProperty.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => {
                          setIsDialogOpen(false);
                          openImageGallery(selectedProperty, 0);
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2">
                          <Images size={24} className="text-gray-600" />
                        </div>
                      </div>
                      {selectedProperty.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          +{selectedProperty.images.length - 1} more
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <Shield size={48} />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-medium">{selectedProperty.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin size={14} />
                  <span>{selectedProperty.location}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="bg-gray-100 p-2 rounded">
                    <div className="text-lg font-medium">{selectedProperty.bedrooms}</div>
                    <div className="text-xs text-muted-foreground">Bedrooms</div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <div className="text-lg font-medium">{selectedProperty.bathrooms}</div>
                    <div className="text-xs text-muted-foreground">Bathrooms</div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <div className="text-lg font-medium">{selectedProperty.area}</div>
                    <div className="text-xs text-muted-foreground">m²</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="text-2xl font-bold">GH₵ {selectedProperty.price.toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Property Type</div>
                  <div className="font-medium capitalize">{selectedProperty.propertyType}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Owner Information</div>
                  <div className="font-medium">{selectedProperty.ownerName || "Unknown Owner"}</div>
                  <div className="text-sm">{selectedProperty.ownerPhone || "No phone provided"}</div>
                  <div className="text-sm">{selectedProperty.ownerEmail || "No email provided"}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div className="text-sm">{selectedProperty.description}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Verification Status</div>
                  {getStatusBadge(selectedProperty.verificationStatus)}
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    openImageGallery(selectedProperty, 0);
                  }}
                  className="flex items-center gap-2"
                >
                  <Images size={16} />
                  View All Images
                </Button>
              )}
              
              {selectedProperty.verificationStatus === 'pending' && (
                <>
                  <Button 
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleReject(selectedProperty)}
                  >
                    <X size={16} className="mr-2" />
                    Reject
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleVerify(selectedProperty)}
                  >
                    <Check size={16} className="mr-2" />
                    Verify
                  </Button>
                </>
              )}
              {selectedProperty.verificationStatus !== 'pending' && (
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 size={16} className="mr-2" />
                    Delete Property
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Property</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedProperty.title}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => {
                        handleDelete(selectedProperty);
                        setIsDialogOpen(false);
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Property
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Gallery Modal */}
      {selectedProperty && (
        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Images size={20} />
                Property Images - {selectedProperty.title}
              </DialogTitle>
              <DialogDescription>
                {selectedProperty.images && selectedProperty.images.length > 0 
                  ? `Image ${selectedImageIndex + 1} of ${selectedProperty.images.length}`
                  : "No images available"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 flex flex-col">
              {selectedProperty.images && selectedProperty.images.length > 0 ? (
                <>
                  {/* Main Image Display */}
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={selectedProperty.images[selectedImageIndex]} 
                      alt={`${selectedProperty.title} - Image ${selectedImageIndex + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  {/* Navigation Controls */}
                  {selectedProperty.images.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={prevImage}
                        disabled={selectedProperty.images.length <= 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {selectedImageIndex + 1} / {selectedProperty.images.length}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={nextImage}
                        disabled={selectedProperty.images.length <= 1}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                  
                  {/* Thumbnail Strip */}
                  {selectedProperty.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
                      {selectedProperty.images.map((image, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 w-20 h-20 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                            index === selectedImageIndex 
                              ? 'border-blue-500 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img 
                            src={image} 
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Images size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-muted-foreground">No images available for this property</p>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsGalleryOpen(false)}>
                Close Gallery
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PropertyVerifications;
