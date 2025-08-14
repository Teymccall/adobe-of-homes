import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Clock,
  MapPin,
  User,
  Building,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  CalendarDays,
  Clock as ClockIcon,
  Star,
  FileText,
  Wrench,
  Home,
  Users,
  DollarSign,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
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

interface CalendarEvent {
  id: string;
  title: string;
  type: 'lease_renewal' | 'property_inspection' | 'viewing' | 'maintenance' | 'payment_due' | 'meeting' | 'other';
  startDate: Date;
  endDate: Date;
  description: string;
  location: string;
  attendees: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  propertyId?: string;
  propertyTitle?: string;
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  notes?: string;
  reminderSent: boolean;
}

const StaffCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [showEventDetailsDialog, setShowEventDetailsDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Lease Renewal - John Doe',
        type: 'lease_renewal',
        startDate: new Date('2024-01-20T10:00:00'),
        endDate: new Date('2024-01-20T11:00:00'),
        description: 'Annual lease renewal meeting for Unit A-101',
        location: 'Office - Conference Room A',
        attendees: ['John Doe', 'Sarah Wilson', 'Mike Johnson'],
        status: 'scheduled',
        priority: 'high',
        propertyId: 'prop1',
        propertyTitle: 'Modern 2-Bedroom Apartment',
        tenantName: 'John Doe',
        tenantEmail: 'john.doe@email.com',
        tenantPhone: '+233 20 123 4567',
        notes: 'Tenant wants to discuss rent increase and lease terms',
        reminderSent: true
      },
      {
        id: '2',
        title: 'Property Inspection - East Legon',
        type: 'property_inspection',
        startDate: new Date('2024-01-21T14:00:00'),
        endDate: new Date('2024-01-21T16:00:00'),
        description: 'Quarterly property inspection for East Legon complex',
        location: 'East Legon, Accra',
        attendees: ['David Chen', 'Sarah Osei'],
        status: 'scheduled',
        priority: 'medium',
        propertyId: 'prop1',
        propertyTitle: 'Modern 2-Bedroom Apartment',
        notes: 'Check all units for maintenance issues and safety compliance',
        reminderSent: false
      },
      {
        id: '3',
        title: 'Property Viewing - Studio Apartment',
        type: 'viewing',
        startDate: new Date('2024-01-22T15:30:00'),
        endDate: new Date('2024-01-22T16:30:00'),
        description: 'Property viewing for potential tenant',
        location: 'Osu, Accra',
        attendees: ['Michael Chen', 'Emily Brown'],
        status: 'scheduled',
        priority: 'medium',
        propertyId: 'prop3',
        propertyTitle: 'Studio Apartment',
        notes: 'Prospective tenant interested in 6-month lease',
        reminderSent: true
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.attendees.some(attendee => attendee.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, typeFilter, statusFilter]);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'lease_renewal':
        return <FileText className="h-4 w-4" />;
      case 'property_inspection':
        return <Eye className="h-4 w-4" />;
      case 'viewing':
        return <Home className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      case 'payment_due':
        return <DollarSign className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'lease_renewal':
        return 'bg-blue-500';
      case 'property_inspection':
        return 'bg-green-500';
      case 'viewing':
        return 'bg-purple-500';
      case 'maintenance':
        return 'bg-orange-500';
      case 'payment_due':
        return 'bg-red-500';
      case 'meeting':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'rescheduled':
        return <Badge className="bg-orange-500">Rescheduled</Badge>;
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)} at ${formatTime(date)}`;
  };

  const calculateStats = () => {
    const totalEvents = events.length;
    const todayEvents = events.filter(e => 
      e.startDate.toDateString() === new Date().toDateString()
    ).length;
    const upcomingEvents = events.filter(e => 
      e.startDate > new Date() && e.status === 'scheduled'
    ).length;
    const completedEvents = events.filter(e => e.status === 'completed').length;

    return {
      totalEvents,
      todayEvents,
      upcomingEvents,
      completedEvents
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
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
            <Calendar size={24} />
            Calendar & Schedule
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage upcoming events, viewings, inspections, and meetings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export Calendar
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setShowAddEventDialog(true)}>
            <Plus size={16} />
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              All scheduled events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events scheduled today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Future scheduled events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedEvents}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
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
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lease_renewal">Lease Renewal</SelectItem>
                <SelectItem value="property_inspection">Property Inspection</SelectItem>
                <SelectItem value="viewing">Property Viewing</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="payment_due">Payment Due</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Upcoming Events ({filteredEvents.length} of {events.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                    {getEventTypeIcon(event.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{event.title}</h3>
                      {event.priority === 'urgent' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatDateTime(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{event.attendees.length} attendees</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getPriorityBadge(event.priority)}
                  {getStatusBadge(event.status)}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventDetailsDialog(true);
                        }}
                      >
                        <Eye className="mr-2" size={14} />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2" size={14} />
                        Send Reminder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2" size={14} />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2" size={14} />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No events found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new calendar event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Event Title</Label>
              <Input placeholder="Enter event title" />
            </div>
            <div>
              <Label>Event Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lease_renewal">Lease Renewal</SelectItem>
                  <SelectItem value="property_inspection">Property Inspection</SelectItem>
                  <SelectItem value="viewing">Property Viewing</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="payment_due">Payment Due</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date & Time</Label>
                <Input type="datetime-local" />
              </div>
              <div>
                <Label>End Date & Time</Label>
                <Input type="datetime-local" />
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input placeholder="Enter event location" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Enter event description" />
            </div>
            <div>
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddEventDialog(false)}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showEventDetailsDialog} onOpenChange={setShowEventDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Event details and information
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getEventTypeIcon(selectedEvent.type)}
                <span className="capitalize">{selectedEvent.type.replace('_', ' ')}</span>
                {getPriorityBadge(selectedEvent.priority)}
                {getStatusBadge(selectedEvent.status)}
              </div>
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Start Time</Label>
                  <p className="text-sm text-muted-foreground">{formatDateTime(selectedEvent.startDate)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Time</Label>
                  <p className="text-sm text-muted-foreground">{formatDateTime(selectedEvent.endDate)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Attendees</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEvent.attendees.map((attendee, index) => (
                    <Badge key={index} variant="outline">
                      {attendee}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedEvent.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedEvent.notes}</p>
                </div>
              )}

              {selectedEvent.tenantName && (
                <div>
                  <Label className="text-sm font-medium">Tenant Information</Label>
                  <div className="text-sm text-muted-foreground">
                    <p>Name: {selectedEvent.tenantName}</p>
                    <p>Email: {selectedEvent.tenantEmail}</p>
                    <p>Phone: {selectedEvent.tenantPhone}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDetailsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => setShowEventDetailsDialog(false)}>
              Edit Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffCalendar; 