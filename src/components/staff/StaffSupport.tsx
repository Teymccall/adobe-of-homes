import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
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
  FileText,
  Users,
  Download,
  Send,
  Star,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  MessageCircle,
  Headphones,
  LifeBuoy
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'properties' | 'tenants' | 'maintenance' | 'payments' | 'technical';
  helpful: number;
  notHelpful: number;
  lastUpdated: Date;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'property' | 'tenant_issue' | 'feature_request' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdDate: Date;
  lastUpdated: Date;
  assignedTo?: string;
  responses: {
    id: string;
    message: string;
    sender: 'staff' | 'support';
    timestamp: Date;
  }[];
}

const StaffSupport = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  const [ticketStatus, setTicketStatus] = useState('all');
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showTicketDetailsDialog, setShowTicketDetailsDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general' as const,
    priority: 'medium' as const
  });
  const { toast } = useToast();

  useEffect(() => {
    const mockFaqs: FAQItem[] = [
      {
        id: '1',
        question: 'How do I add a new property to the system?',
        answer: 'To add a new property, go to the Property Management tab and click "Add New Property". Fill in all required details including property information, location, amenities, and upload photos.',
        category: 'properties',
        helpful: 24,
        notHelpful: 2,
        lastUpdated: new Date('2024-01-15')
      },
      {
        id: '2',
        question: 'How can I schedule property viewings?',
        answer: 'Property viewings can be scheduled from the Rental Applications tab. Select an application and click "Schedule Viewing" to set up a meeting with the prospective tenant.',
        category: 'tenants',
        helpful: 18,
        notHelpful: 1,
        lastUpdated: new Date('2024-01-10')
      },
      {
        id: '3',
        question: 'What should I do if a tenant reports a maintenance issue?',
        answer: 'Go to the Maintenance Requests tab, create a new request, assign it to the appropriate maintenance team member, and track progress until completion. Always communicate with the tenant about status updates.',
        category: 'maintenance',
        helpful: 31,
        notHelpful: 0,
        lastUpdated: new Date('2024-01-12')
      },
      {
        id: '4',
        question: 'How do I generate monthly reports?',
        answer: 'Visit the Reports tab, select the type of report you need (occupancy, payments, maintenance), choose the date range, and click "Generate Report". You can export to PDF or Excel format.',
        category: 'general',
        helpful: 22,
        notHelpful: 3,
        lastUpdated: new Date('2024-01-08')
      },
      {
        id: '5',
        question: 'How are payment reminders sent to tenants?',
        answer: 'Payment reminders are automatically sent 3 days before the due date. You can also send manual reminders from the Payments tab by selecting a payment and clicking "Send Reminder".',
        category: 'payments',
        helpful: 15,
        notHelpful: 1,
        lastUpdated: new Date('2024-01-14')
      },
      {
        id: '6',
        question: 'System is running slow, what should I do?',
        answer: 'Try refreshing your browser first. If the issue persists, clear your browser cache and cookies. For continued problems, contact technical support with details about your browser and operating system.',
        category: 'technical',
        helpful: 12,
        notHelpful: 4,
        lastUpdated: new Date('2024-01-16')
      }
    ];

    const mockTickets: SupportTicket[] = [
      {
        id: '1',
        title: 'Unable to upload property photos',
        description: 'When I try to upload photos for a new property listing, the system shows an error message and the photos don\'t save.',
        category: 'technical',
        priority: 'high',
        status: 'in_progress',
        createdDate: new Date('2024-01-15T10:30:00'),
        lastUpdated: new Date('2024-01-16T14:20:00'),
        assignedTo: 'Technical Support Team',
        responses: [
          {
            id: '1',
            message: 'Thank you for reporting this issue. We are investigating the photo upload problem and will update you soon.',
            sender: 'support',
            timestamp: new Date('2024-01-15T11:00:00')
          },
          {
            id: '2',
            message: 'We have identified the issue and are working on a fix. Expected resolution within 24 hours.',
            sender: 'support',
            timestamp: new Date('2024-01-16T14:20:00')
          }
        ]
      },
      {
        id: '2',
        title: 'Request for mobile app access',
        description: 'It would be very helpful to have a mobile app to manage properties and view reports while on the go.',
        category: 'feature_request',
        priority: 'medium',
        status: 'open',
        createdDate: new Date('2024-01-12T09:15:00'),
        lastUpdated: new Date('2024-01-12T09:15:00'),
        responses: []
      },
      {
        id: '3',
        title: 'Calendar sync with Google Calendar',
        description: 'How can I sync the property viewing schedule with my Google Calendar?',
        category: 'technical',
        priority: 'low',
        status: 'resolved',
        createdDate: new Date('2024-01-10T16:45:00'),
        lastUpdated: new Date('2024-01-11T10:30:00'),
        assignedTo: 'Technical Support Team',
        responses: [
          {
            id: '1',
            message: 'You can export your calendar events by going to Calendar tab and clicking "Export Calendar". This will generate an ICS file that you can import into Google Calendar.',
            sender: 'support',
            timestamp: new Date('2024-01-11T10:30:00')
          }
        ]
      }
    ];

    setFaqs(mockFaqs);
    setTickets(mockTickets);
    setFilteredFaqs(mockFaqs);
    setFilteredTickets(mockTickets);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filteredF = faqs;
    if (searchTerm) {
      filteredF = filteredF.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (faqCategory !== 'all') {
      filteredF = filteredF.filter(faq => faq.category === faqCategory);
    }
    setFilteredFaqs(filteredF);

    let filteredT = tickets;
    if (searchTerm) {
      filteredT = filteredT.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (ticketStatus !== 'all') {
      filteredT = filteredT.filter(ticket => ticket.status === ticketStatus);
    }
    setFilteredTickets(filteredT);
  }, [faqs, tickets, searchTerm, faqCategory, ticketStatus]);

  const handleCreateTicket = async () => {
    try {
      const ticket: SupportTicket = {
        id: Date.now().toString(),
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: 'open',
        createdDate: new Date(),
        lastUpdated: new Date(),
        responses: []
      };

      setTickets([ticket, ...tickets]);
      setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
      setShowNewTicketDialog(false);
      
      toast({
        title: "Support Ticket Created",
        description: "Your support ticket has been submitted successfully.",
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    setFaqs(faqs.map(faq =>
      faq.id === faqId
        ? {
            ...faq,
            helpful: isHelpful ? faq.helpful + 1 : faq.helpful,
            notHelpful: !isHelpful ? faq.notHelpful + 1 : faq.notHelpful
          }
        : faq
    ));

    toast({
      title: "Feedback Recorded",
      description: "Thank you for your feedback!",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Closed</Badge>;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'properties':
        return <Building className="h-4 w-4" />;
      case 'tenants':
        return <Users className="h-4 w-4" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4" />;
      case 'payments':
        return <MessageSquare className="h-4 w-4" />;
      case 'technical':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatDateTime = (date: Date) => {
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading support center...</p>
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
            <HelpCircle size={24} />
            Support & Help
          </h2>
          <p className="text-muted-foreground mt-1">
            Get help, browse FAQs, and contact support team
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Phone size={16} />
            Emergency: +233 20 000 0000
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setShowNewTicketDialog(true)}>
            <Plus size={16} />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Call Support</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Speak directly with our support team
            </p>
            <Button variant="outline" size="sm">
              +233 20 123 4567
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Send us an email for non-urgent issues
            </p>
            <Button variant="outline" size="sm">
              support@propertyapp.com
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Chat with support representatives
            </p>
            <Button variant="outline" size="sm">
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <BookOpen size={16} />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <FileText size={16} />
            My Tickets
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Headphones size={16} />
            User Guides
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          {/* FAQ Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter size={20} />
                Search FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={faqCategory} onValueChange={setFaqCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="properties">Properties</SelectItem>
                    <SelectItem value="tenants">Tenants</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="payments">Payments</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-blue-100">
                      {getCategoryIcon(faq.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{faq.question}</h3>
                        <Badge variant="outline" className="capitalize">
                          {faq.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        {faq.answer}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Updated: {formatDate(faq.lastUpdated)}</span>
                          <span>{faq.helpful} helpful • {faq.notHelpful} not helpful</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Was this helpful?</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback(faq.id, true)}
                          >
                            <ThumbsUp size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback(faq.id, false)}
                          >
                            <ThumbsDown size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No FAQs found matching your search criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          {/* Ticket Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter size={20} />
                Filter Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Search your tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={ticketStatus} onValueChange={setTicketStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowTicketDetailsDialog(true);
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{ticket.title}</h3>
                        {ticket.priority === 'urgent' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        {ticket.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created: {formatDate(ticket.createdDate)}</span>
                        <span>Last updated: {formatDate(ticket.lastUpdated)}</span>
                        {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                      <Badge variant="outline" className="capitalize">
                        {ticket.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTickets.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No support tickets found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          {/* User Guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Property Management Guide</h3>
                    <p className="text-sm text-muted-foreground">Complete guide for managing properties</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-green-100">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tenant Management Guide</h3>
                    <p className="text-sm text-muted-foreground">Best practices for tenant relations</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-orange-100">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Maintenance Procedures</h3>
                    <p className="text-sm text-muted-foreground">Step-by-step maintenance workflows</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-purple-100">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Reporting & Analytics</h3>
                    <p className="text-sm text-muted-foreground">How to generate and read reports</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Ticket Dialog */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Describe your issue and we'll help you resolve it
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Ticket Title</Label>
              <Input
                placeholder="Brief description of your issue"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={newTicket.category}
                onValueChange={(value) => setNewTicket({ ...newTicket, category: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="property">Property Related</SelectItem>
                  <SelectItem value="tenant_issue">Tenant Issue</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={newTicket.priority}
                onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Provide detailed information about your issue..."
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTicket}
              disabled={!newTicket.title || !newTicket.description}
            >
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDetailsDialog} onOpenChange={setShowTicketDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.title}</DialogTitle>
            <DialogDescription>
              Ticket #{selectedTicket?.id} • Created {selectedTicket && formatDateTime(selectedTicket.createdDate)}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getPriorityBadge(selectedTicket.priority)}
                {getStatusBadge(selectedTicket.status)}
                <Badge variant="outline" className="capitalize">
                  {selectedTicket.category.replace('_', ' ')}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedTicket.description}</p>
              </div>

              {selectedTicket.assignedTo && (
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTicket.assignedTo}</p>
                </div>
              )}

              {selectedTicket.responses.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Responses</Label>
                  <div className="space-y-3 mt-2">
                    {selectedTicket.responses.map((response) => (
                      <div key={response.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {response.sender === 'support' ? 'Support Team' : 'You'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(response.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTicketDetailsDialog(false)}>
              Close
            </Button>
            <Button>
              <Send size={16} className="mr-2" />
              Add Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffSupport;