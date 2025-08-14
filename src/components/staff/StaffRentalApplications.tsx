import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar,
  User,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  CalendarDays,
  FileCheck,
  FileX,
  Users,
  Plus
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
import { useToast } from '@/hooks/use-toast';

interface RentalApplication {
  id: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: number;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'moved_in' | 'cancelled';
  monthlyIncome: number;
  employmentStatus: string;
  references: string[];
  documents: {
    proofOfIncome: string;
    idDocument: string;
    references: string[];
    additionalDocs: string[];
  };
  viewingScheduled: boolean;
  viewingDate?: Date;
  notes: string;
  reviewedBy?: string;
  reviewDate?: Date;
  reviewNotes?: string;
}

const StaffRentalApplications = () => {
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<RentalApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [showViewingDialog, setShowViewingDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<RentalApplication | null>(null);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockApplications: RentalApplication[] = [
      {
        id: '1',
        tenantName: 'John Doe',
        tenantEmail: 'john.doe@email.com',
        tenantPhone: '+233 20 123 4567',
        propertyId: 'prop1',
        propertyTitle: 'Modern 2-Bedroom Apartment',
        propertyLocation: 'East Legon, Accra',
        propertyPrice: 2500,
        applicationDate: new Date('2024-01-15'),
        status: 'pending',
        monthlyIncome: 8000,
        employmentStatus: 'Full-time',
        references: ['Jane Smith - Previous Landlord', 'Mike Johnson - Employer'],
        documents: {
          proofOfIncome: 'income_proof_john_doe.pdf',
          idDocument: 'ghana_passport_john_doe.pdf',
          references: ['reference_letter_1.pdf', 'reference_letter_2.pdf'],
          additionalDocs: ['bank_statement.pdf']
        },
        viewingScheduled: false,
        notes: 'Interested in long-term lease. Has good credit history.',
        reviewedBy: undefined,
        reviewDate: undefined,
        reviewNotes: undefined
      },
      {
        id: '2',
        tenantName: 'Sarah Wilson',
        tenantEmail: 'sarah.wilson@email.com',
        tenantPhone: '+233 24 987 6543',
        propertyId: 'prop2',
        propertyTitle: 'Luxury 3-Bedroom House',
        propertyLocation: 'Trasacco Valley, Accra',
        propertyPrice: 4500,
        applicationDate: new Date('2024-01-10'),
        status: 'approved',
        monthlyIncome: 12000,
        employmentStatus: 'Full-time',
        references: ['David Brown - Previous Landlord', 'Lisa Green - Employer'],
        documents: {
          proofOfIncome: 'income_proof_sarah_wilson.pdf',
          idDocument: 'ghana_id_sarah_wilson.pdf',
          references: ['reference_letter_3.pdf', 'reference_letter_4.pdf'],
          additionalDocs: ['credit_report.pdf']
        },
        viewingScheduled: true,
        viewingDate: new Date('2024-01-20'),
        notes: 'Excellent candidate. High income, good references.',
        reviewedBy: 'Staff Member',
        reviewDate: new Date('2024-01-12'),
        reviewNotes: 'Approved after thorough background check.'
      },
      {
        id: '3',
        tenantName: 'Michael Chen',
        tenantEmail: 'michael.chen@email.com',
        tenantPhone: '+233 26 555 1234',
        propertyId: 'prop3',
        propertyTitle: 'Studio Apartment',
        propertyLocation: 'Osu, Accra',
        propertyPrice: 1500,
        applicationDate: new Date('2024-01-08'),
        status: 'rejected',
        monthlyIncome: 3000,
        employmentStatus: 'Part-time',
        references: ['Alex Johnson - Previous Landlord'],
        documents: {
          proofOfIncome: 'income_proof_michael_chen.pdf',
          idDocument: 'ghana_id_michael_chen.pdf',
          references: ['reference_letter_5.pdf'],
          additionalDocs: []
        },
        viewingScheduled: false,
        notes: 'Income too low for property requirements.',
        reviewedBy: 'Staff Member',
        reviewDate: new Date('2024-01-09'),
        reviewNotes: 'Rejected due to insufficient income.'
      }
    ];

    setApplications(mockApplications);
    setFilteredApplications(mockApplications);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(application =>
        application.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.propertyLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(application => application.status === statusFilter);
    }

    // Apply property filter
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(application => application.propertyId === propertyFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, propertyFilter]);

  const handleStatusChange = async (applicationId: string, newStatus: RentalApplication['status'], notes?: string) => {
    try {
      setApplications(applications.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: newStatus, 
              reviewedBy: 'Staff Member',
              reviewDate: new Date(),
              reviewNotes: notes || ''
            }
          : app
      ));

      toast({
        title: "Status Updated",
        description: `Application has been ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleViewing = async (applicationId: string, viewingDate: Date) => {
    try {
      setApplications(applications.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              viewingScheduled: true,
              viewingDate: viewingDate
            }
          : app
      ));

      toast({
        title: "Viewing Scheduled",
        description: `Property viewing has been scheduled for ${viewingDate.toLocaleDateString()}.`,
      });
    } catch (error) {
      console.error('Error scheduling viewing:', error);
      toast({
        title: "Error",
        description: "Failed to schedule viewing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'moved_in':
        return <Badge className="bg-blue-500">Moved In</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(price);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
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
            <FileText size={24} />
            Rental Applications
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage rental applications, approve/reject tenants, and schedule viewings
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          New Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              All applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Viewings</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.viewingScheduled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Property viewings
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search applications..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="moved_in">Moved In</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {Array.from(new Set(applications.map(app => app.propertyId))).map(propertyId => {
                  const app = applications.find(a => a.propertyId === propertyId);
                  return (
                    <SelectItem key={propertyId} value={propertyId}>
                      {app?.propertyTitle}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPropertyFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Applications ({filteredApplications.length} of {applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{getInitials(application.tenantName)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{application.tenantName}</h3>
                      {application.viewingScheduled && <CalendarDays className="h-4 w-4 text-blue-600" />}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      Applying for: <span className="font-medium">{application.propertyTitle}</span>
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        <span>{application.tenantEmail}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={14} />
                        <span>{application.tenantPhone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{application.propertyLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <span>{formatPrice(application.propertyPrice)}/month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Applied {formatDate(application.applicationDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(application.status)}
                  
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
                        <Download className="mr-2" size={14} />
                        Download Documents
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload className="mr-2" size={14} />
                        Upload Documents
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {application.status === 'pending' && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(application.id, 'approved')}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2" size={14} />
                            Approve Application
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            className="text-red-600"
                          >
                            <XCircle className="mr-2" size={14} />
                            Reject Application
                          </DropdownMenuItem>
                        </>
                      )}
                      {!application.viewingScheduled && (
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowViewingDialog(true);
                          }}
                          className="text-blue-600"
                        >
                          <CalendarDays className="mr-2" size={14} />
                          Schedule Viewing
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Edit className="mr-2" size={14} />
                        Edit Application
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2" size={14} />
                        Delete Application
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredApplications.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No applications found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Viewing Dialog */}
      <Dialog open={showViewingDialog} onOpenChange={setShowViewingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Property Viewing</DialogTitle>
            <DialogDescription>
              Schedule a viewing for {selectedApplication?.tenantName} at {selectedApplication?.propertyTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="viewing-date">Viewing Date & Time</Label>
              <Input
                id="viewing-date"
                type="datetime-local"
                onChange={(e) => {
                  if (selectedApplication) {
                    const date = new Date(e.target.value);
                    handleScheduleViewing(selectedApplication.id, date);
                    setShowViewingDialog(false);
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewing-notes">Notes</Label>
              <Textarea
                id="viewing-notes"
                placeholder="Add any special instructions or notes for the viewing..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowViewingDialog(false)}>
              Schedule Viewing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffRentalApplications; 