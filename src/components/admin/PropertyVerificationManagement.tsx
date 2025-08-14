import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Home, 
  User, 
  Phone, 
  Mail,
  Calendar,
  FileText,
  ImageIcon,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PropertyVerification {
  id: string;
  propertyId: string;
  title: string;
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  submittedDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  images: string[];
  documents: string[];
  description: string;
  features: string[];
  mapLocation?: { lat: number; lng: number };
  verificationNotes?: string;
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
}



const PropertyVerificationManagement: React.FC = () => {
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<PropertyVerification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<PropertyVerification | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching properties for verification...');
        
        // Debug: Get all properties first
        const allProperties = await adminService.getAllPropertiesForDebug();
        console.log('All properties in database:', allProperties);
        
        const data = await adminService.getPropertiesForVerification();
        console.log('Raw data from getPropertiesForVerification:', data);
        
        // Transform the data to match PropertyVerification interface
        const transformedData = data.map(property => ({
          id: property.id,
          propertyId: property.id,
          title: property.title || property.name,
          address: property.location,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          price: property.price || 0,
          ownerName: property.ownerName || property.owner?.name || property.homeOwnerName || 'Unknown',
          ownerEmail: property.ownerEmail || property.owner?.email || property.homeOwnerEmail || 'Unknown',
          ownerPhone: property.ownerPhone || property.owner?.phone || property.homeOwnerPhone || 'Unknown',
          submittedDate: property.createdAt ? new Date(property.createdAt.toDate()) : new Date(),
          status: property.verificationStatus || 'pending',
          images: property.images || [],
          documents: property.documents || [],
          description: property.description || '',
          features: property.features || [],
          mapLocation: property.mapLocation,
          verificationNotes: property.verificationNotes,
          assignedTo: property.assignedTo,
          priority: property.priority || 'medium'
        }));
        
        console.log('Transformed data:', transformedData);
        setVerifications(transformedData);
      } catch (error) {
        console.error('Error fetching verifications:', error);
        toast({
          title: "Error",
          description: "Failed to load verifications. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifications();
  }, [toast]);

  // Filter verifications based on search and filters
  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = verification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         verification.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         verification.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'under_review': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under_review': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const handleStatusChange = (verificationId: string, newStatus: string, notes?: string) => {
    setVerifications(prev => prev.map(verification => 
      verification.id === verificationId ? { 
        ...verification, 
        status: newStatus as any,
        verificationNotes: notes || verification.verificationNotes
      } : verification
    ));
    
    toast({
      title: "Status Updated",
      description: `Property verification ${newStatus}`,
    });

    setIsViewDialogOpen(false);
    setSelectedVerification(null);
    setVerificationNotes('');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `GH₵ ${price.toLocaleString()}`;
  };

  const viewVerification = (verification: PropertyVerification) => {
    setSelectedVerification(verification);
    setVerificationNotes(verification.verificationNotes || '');
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Property Verification</h2>
          <p className="text-gray-600">Review and verify property listings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{verifications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{verifications.filter(v => v.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold">{verifications.filter(v => v.status === 'under_review').length}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{verifications.filter(v => v.status === 'approved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by property title, owner, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Verifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests ({filteredVerifications.length})</CardTitle>
          <CardDescription>
            Property listings awaiting verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVerifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{verification.title}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {verification.address}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Home className="h-3 w-3" />
                        {verification.bedrooms} bed, {verification.bathrooms} bath
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <User className="h-3 w-3" />
                        {verification.ownerName}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="h-3 w-3" />
                        {verification.ownerEmail}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone className="h-3 w-3" />
                        {verification.ownerPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {verification.propertyType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatPrice(verification.price)}</span>
                    <p className="text-xs text-gray-500">per month</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(verification.priority) as any} className="capitalize">
                      {verification.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(verification.status)}
                      <Badge variant={getStatusColor(verification.status) as any} className="capitalize">
                        {verification.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {formatDate(verification.submittedDate)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewVerification(verification)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Verification Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedVerification && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Verification Details
                </DialogTitle>
                <DialogDescription>
                  Review property information and make verification decision
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Information */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Property Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Title</Label>
                        <p className="text-sm text-gray-700">{selectedVerification.title}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Address</Label>
                        <p className="text-sm text-gray-700">{selectedVerification.address}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Type</Label>
                          <p className="text-sm text-gray-700">{selectedVerification.propertyType}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Price</Label>
                          <p className="text-sm text-gray-700">{formatPrice(selectedVerification.price)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Bedrooms</Label>
                          <p className="text-sm text-gray-700">{selectedVerification.bedrooms}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Bathrooms</Label>
                          <p className="text-sm text-gray-700">{selectedVerification.bathrooms}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Description</Label>
                        <p className="text-sm text-gray-700">{selectedVerification.description}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Features</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedVerification.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Owner Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Owner Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm text-gray-700">{selectedVerification.ownerName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm text-gray-700">{selectedVerification.ownerEmail}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p className="text-sm text-gray-700">{selectedVerification.ownerPhone}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Images and Documents */}
                <div className="space-y-4">
                  {/* Property Images */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Property Images ({selectedVerification.images.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedVerification.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {selectedVerification.images.map((image, index) => (
                            <div key={index} className="aspect-video">
                              <img 
                                src={image} 
                                alt={`Property ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No images uploaded</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Location Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Location Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Address</Label>
                        <p className="text-sm text-gray-700">{selectedVerification.address}</p>
                      </div>
                      {selectedVerification.mapLocation && (
                        <div>
                          <Label className="text-sm font-medium">Coordinates</Label>
                          <p className="text-sm text-gray-700">
                            {selectedVerification.mapLocation.lat?.toFixed(6)}, {selectedVerification.mapLocation.lng?.toFixed(6)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Documents */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedVerification.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{doc}</span>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Verification Notes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Verification Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Add verification notes..."
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        className="min-h-24"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleStatusChange(selectedVerification.id, 'rejected', verificationNotes)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => handleStatusChange(selectedVerification.id, 'approved', verificationNotes)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyVerificationManagement;