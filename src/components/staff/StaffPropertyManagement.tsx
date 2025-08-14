import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Home, 
  Apartment, 
  Hotel,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: 'apartment' | 'house' | 'studio' | 'commercial';
  status: 'vacant' | 'occupied' | 'under_maintenance' | 'reserved';
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  videos: string[];
  floorPlans: string[];
  createdAt: any;
  isVerified: boolean;
  ownerId: string;
  ownerName: string;
}

const StaffPropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  // New property form state
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [] as string[],
    ownerName: '',
    ownerId: ''
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getPropertiesForVerification();
        // Transform the data to include all properties, not just unverified ones
        const allProperties = data.map((prop: any) => ({
          id: prop.id,
          title: prop.title || prop.name || 'Untitled Property',
          description: prop.description || '',
          propertyType: prop.propertyType || 'apartment',
          status: prop.status || 'vacant',
          location: prop.location || '',
          price: prop.price || prop.rentalPrice || 0,
          bedrooms: prop.bedrooms || 0,
          bathrooms: prop.bathrooms || 0,
          area: prop.area || prop.squareFootage || 0,
          amenities: prop.amenities || [],
          images: prop.images || [],
          videos: prop.videos || [],
          floorPlans: prop.floorPlans || [],
          createdAt: prop.createdAt,
          isVerified: prop.isVerified || false,
          ownerId: prop.ownerId || prop.userId || '',
          ownerName: prop.ownerName || prop.owner || 'Unknown'
        }));
        setProperties(allProperties);
        setFilteredProperties(allProperties);
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

  useEffect(() => {
    let filtered = properties;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.propertyType === typeFilter);
    }

    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(property => property.location === locationFilter);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter, typeFilter, locationFilter]);

  const handleAddProperty = async () => {
    try {
      // Here you would typically call an API to add the property
      const propertyData = {
        ...newProperty,
        price: parseFloat(newProperty.price),
        bedrooms: parseInt(newProperty.bedrooms),
        bathrooms: parseInt(newProperty.bathrooms),
        area: parseFloat(newProperty.area),
        status: 'vacant',
        isVerified: false,
        createdAt: new Date(),
        images: [],
        videos: [],
        floorPlans: []
      };

      // For now, we'll add it to the local state
      const newPropertyWithId = {
        ...propertyData,
        id: Date.now().toString(),
        createdAt: new Date()
      };

      setProperties([...properties, newPropertyWithId]);
      setShowAddDialog(false);
      setNewProperty({
        title: '',
        description: '',
        propertyType: 'apartment',
        location: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        amenities: [],
        ownerName: '',
        ownerId: ''
      });

      toast({
        title: "Property Added",
        description: "New property has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        // Here you would typically call an API to delete the property
        setProperties(properties.filter(property => property.id !== propertyId));

        toast({
          title: "Property Deleted",
          description: "Property has been deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting property:', error);
        toast({
          title: "Error",
          description: "Failed to delete property. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'vacant':
        return <Badge className="bg-green-500">Vacant</Badge>;
      case 'occupied':
        return <Badge variant="secondary">Occupied</Badge>;
      case 'under_maintenance':
        return <Badge variant="destructive">Under Maintenance</Badge>;
      case 'reserved':
        return <Badge className="bg-blue-500">Reserved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'apartment':
        return <Badge variant="default">Apartment</Badge>;
      case 'house':
        return <Badge variant="secondary">House</Badge>;
      case 'studio':
        return <Badge className="bg-purple-500">Studio</Badge>;
      case 'commercial':
        return <Badge className="bg-orange-500">Commercial</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'Unknown';
    const timestamp = date.toDate ? date.toDate() : new Date(date);
    return timestamp.toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building size={24} />
            Property Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage all properties, listings, and property-related operations
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add New Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new property to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  value={newProperty.title}
                  onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                  placeholder="Enter property title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select value={newProperty.propertyType} onValueChange={(value) => setNewProperty({...newProperty, propertyType: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newProperty.location}
                  onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Rental Price (GHS)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProperty.price}
                  onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                  placeholder="Enter rental price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={newProperty.bedrooms}
                  onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                  placeholder="Number of bedrooms"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={newProperty.bathrooms}
                  onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                  placeholder="Number of bathrooms"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area (sq ft)</Label>
                <Input
                  id="area"
                  type="number"
                  value={newProperty.area}
                  onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                  placeholder="Property area"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner Name</Label>
                <Input
                  id="owner"
                  value={newProperty.ownerName}
                  onChange={(e) => setNewProperty({...newProperty, ownerName: e.target.value})}
                  placeholder="Property owner name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProperty.description}
                onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                placeholder="Enter property description"
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProperty}>
                Add Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">
              All properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacant Properties</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.filter(property => property.status === 'vacant').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for rent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Properties</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.filter(property => property.status === 'occupied').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently rented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.filter(property => property.status === 'under_maintenance').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Maintenance required
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {Array.from(new Set(properties.map(p => p.location))).map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
                setLocationFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Properties ({filteredProperties.length} of {properties.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={property.images[0] || ''} />
                    <AvatarFallback>
                      <Building className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{property.title}</h3>
                      {property.isVerified && <CheckCircle className="h-4 w-4 text-blue-600" />}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{property.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <span>{formatPrice(property.price)}/month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Home size={14} />
                        <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Added {formatDate(property.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getTypeBadge(property.propertyType)}
                  {getStatusBadge(property.status)}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2" size={14} />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2" size={14} />
                        Edit Property
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload className="mr-2" size={14} />
                        Upload Media
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ImageIcon className="mr-2" size={14} />
                        Manage Images
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Video className="mr-2" size={14} />
                        Manage Videos
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2" size={14} />
                        Floor Plans
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2" size={14} />
                        Delete Property
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredProperties.length === 0 && (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No properties found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffPropertyManagement; 