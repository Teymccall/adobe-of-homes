import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  FileText,
  Send,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Camera,
  Settings,
  UserCheck,
  CalendarDays,
  Clock as ClockIcon,
  Star,
  MessageSquare
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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceRequest {
  id: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  unitNumber: string;
  issueType: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest_control' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  reportedDate: Date;
  assignedDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  beforePhotos?: string[];
  afterPhotos?: string[];
  notes?: string;
  tenantRating?: number;
  tenantFeedback?: string;
}

interface MaintenanceTeam {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string[];
  status: 'available' | 'busy' | 'offline';
  rating: number;
  completedJobs: number;
}

const StaffMaintenanceRequests = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MaintenanceRequest[]>([]);
  const [maintenanceTeam, setMaintenanceTeam] = useState<MaintenanceTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [issueTypeFilter, setIssueTypeFilter] = useState('all');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [actualCost, setActualCost] = useState('');
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests: MaintenanceRequest[] = [
      {
        id: '1',
        tenantName: 'John Doe',
        tenantEmail: 'john.doe@email.com',
        tenantPhone: '+233 20 123 4567',
        propertyId: 'prop1',
        propertyTitle: 'Modern 2-Bedroom Apartment',
        propertyLocation: 'East Legon, Accra',
        unitNumber: 'A-101',
        issueType: 'plumbing',
        priority: 'high',
        status: 'assigned',
        description: 'Kitchen sink is clogged and water is backing up. Need immediate attention.',
        reportedDate: new Date('2024-01-15'),
        assignedDate: new Date('2024-01-15'),
        assignedTo: 'Mike Johnson',
        estimatedCost: 150,
        beforePhotos: ['before1.jpg', 'before2.jpg'],
        notes: 'Plumber assigned, will arrive within 2 hours'
      },
      {
        id: '2',
        tenantName: 'Sarah Wilson',
        tenantEmail: 'sarah.wilson@email.com',
        tenantPhone: '+233 24 987 6543',
        propertyId: 'prop2',
        propertyTitle: 'Luxury 3-Bedroom House',
        propertyLocation: 'Trasacco Valley, Accra',
        unitNumber: 'B-205',
        issueType: 'electrical',
        priority: 'urgent',
        status: 'in_progress',
        description: 'Power outage in the entire unit. Circuit breaker keeps tripping.',
        reportedDate: new Date('2024-01-14'),
        assignedDate: new Date('2024-01-14'),
        assignedTo: 'David Chen',
        estimatedCost: 300,
        actualCost: 280,
        beforePhotos: ['electrical1.jpg'],
        notes: 'Electrician on site, found faulty wiring in kitchen'
      }
    ];

    const mockTeam: MaintenanceTeam[] = [
      {
        id: '1',
        name: 'Mike Johnson',
        email: 'mike.johnson@maintenance.com',
        phone: '+233 20 111 2222',
        specialty: ['plumbing', 'appliance'],
        status: 'available',
        rating: 4.8,
        completedJobs: 156
      },
      {
        id: '2',
        name: 'David Chen',
        email: 'david.chen@maintenance.com',
        phone: '+233 24 333 4444',
        specialty: ['electrical', 'hvac'],
        status: 'busy',
        rating: 4.9,
        completedJobs: 203
      }
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
    setMaintenanceTeam(mockTeam);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => request.priority === priorityFilter);
    }

    if (issueTypeFilter !== 'all') {
      filtered = filtered.filter(request => request.issueType === issueTypeFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, priorityFilter, issueTypeFilter]);

  const handleAssignRequest = async (requestId: string, teamMemberId: string) => {
    try {
      const teamMember = maintenanceTeam.find(member => member.id === teamMemberId);
      setRequests(requests.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'assigned' as const,
              assignedTo: teamMember?.name,
              assignedDate: new Date()
            }
          : request
      ));

      toast({
        title: "Request Assigned",
        description: `Maintenance request assigned to ${teamMember?.name}`,
      });
      setShowAssignDialog(false);
    } catch (error) {
      console.error('Error assigning request:', error);
      toast({
        title: "Error",
        description: "Failed to assign request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      setRequests(requests.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus as any,
              completedDate: newStatus === 'completed' ? new Date() : request.completedDate,
              notes: updateNotes || request.notes,
              estimatedCost: estimatedCost ? parseFloat(estimatedCost) : request.estimatedCost,
              actualCost: actualCost ? parseFloat(actualCost) : request.actualCost
            }
          : request
      ));

      toast({
        title: "Status Updated",
        description: `Request status updated to ${newStatus}`,
      });
      setShowUpdateDialog(false);
      setUpdateNotes('');
      setEstimatedCost('');
      setActualCost('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-500">Assigned</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'urgent':
        return <Badge className="bg-red-500">Urgent</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case 'plumbing':
        return <Wrench className="h-4 w-4" />;
      case 'electrical':
        return <Settings className="h-4 w-4" />;
      case 'hvac':
        return <TrendingUp className="h-4 w-4" />;
      case 'appliance':
        return <Building className="h-4 w-4" />;
      case 'structural':
        return <Building className="h-4 w-4" />;
      case 'pest_control':
        return <AlertTriangle className="h-4 w-4" />;
      case 'cleaning':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
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

  const calculateStats = () => {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const inProgressRequests = requests.filter(r => r.status === 'in_progress').length;
    const completedRequests = requests.filter(r => r.status === 'completed').length;
    const urgentRequests = requests.filter(r => r.priority === 'urgent').length;
    const totalCost = requests.reduce((sum, r) => sum + (r.actualCost || 0), 0);

    return {
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      urgentRequests,
      totalCost
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading maintenance requests...</p>
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
            <Wrench size={24} />
            Maintenance Requests
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage and track maintenance issues from tenants
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.urgentRequests} urgent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressRequests}</div>
            <p className="text-xs text-muted-foreground">
              Currently being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalCost)}</div>
            <p className="text-xs text-muted-foreground">
              Maintenance expenses
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
                placeholder="Search requests..."
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
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={issueTypeFilter} onValueChange={setIssueTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="appliance">Appliance</SelectItem>
                <SelectItem value="structural">Structural</SelectItem>
                <SelectItem value="pest_control">Pest Control</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setIssueTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Maintenance Requests ({filteredRequests.length} of {requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{getInitials(request.tenantName)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{request.tenantName}</h3>
                      {request.priority === 'urgent' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {request.propertyTitle} - Unit {request.unitNumber}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getIssueTypeIcon(request.issueType)}
                        <span className="capitalize">{request.issueType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Reported: {formatDate(request.reportedDate)}</span>
                      </div>
                      {request.assignedTo && (
                        <div className="flex items-center gap-1">
                          <UserCheck size={14} />
                          <span>Assigned: {request.assignedTo}</span>
                        </div>
                      )}
                      {request.estimatedCost && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          <span>Est: {formatPrice(request.estimatedCost)}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm mt-2 text-muted-foreground">
                      {request.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getPriorityBadge(request.priority)}
                  {getStatusBadge(request.status)}

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
                        <MessageSquare className="mr-2" size={14} />
                        Contact Tenant
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {request.status === 'pending' && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowAssignDialog(true);
                          }}
                          className="text-blue-600"
                        >
                          <UserCheck className="mr-2" size={14} />
                          Assign to Team
                        </DropdownMenuItem>
                      )}
                      {request.status === 'assigned' && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowUpdateDialog(true);
                          }}
                          className="text-yellow-600"
                        >
                          <Settings className="mr-2" size={14} />
                          Update Progress
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Edit className="mr-2" size={14} />
                        Edit Request
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2" size={14} />
                        Delete Request
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No maintenance requests found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assign Request Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Maintenance Request</DialogTitle>
            <DialogDescription>
              Assign this request to a maintenance team member
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Team Member</Label>
              <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team member" />
                </SelectTrigger>
                <SelectContent>
                  {maintenanceTeam
                    .filter(member => member.status === 'available')
                    .map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <span>{member.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {member.specialty.join(', ')}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedRequest && handleAssignRequest(selectedRequest.id, selectedTeamMember)}
              disabled={!selectedTeamMember}
            >
              Assign Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Update the status and add notes for this maintenance request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select onValueChange={(value) => {
                if (selectedRequest) {
                  handleUpdateStatus(selectedRequest.id, value);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estimated Cost (GHS)</Label>
              <Input
                type="number"
                placeholder="Enter estimated cost"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
              />
            </div>
            <div>
              <Label>Actual Cost (GHS)</Label>
              <Input
                type="number"
                placeholder="Enter actual cost"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Add notes about the progress..."
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUpdateDialog(false)}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffMaintenanceRequests; 