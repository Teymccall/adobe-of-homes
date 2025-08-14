import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
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
  Receipt,
  Banknote
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

interface Payment {
  id: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'paid' | 'pending' | 'overdue' | 'partial' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'mobile_money' | 'cash' | 'online' | 'check';
  reference: string;
  description: string;
  lateFees: number;
  totalAmount: number;
  receiptUrl?: string;
  notes?: string;
}

interface Invoice {
  id: string;
  tenantName: string;
  propertyTitle: string;
  amount: number;
  dueDate: Date;
  status: 'sent' | 'paid' | 'overdue' | 'cancelled';
  sentDate: Date;
  paidDate?: Date;
  invoiceNumber: string;
  items: {
    description: string;
    amount: number;
  }[];
}

const StaffPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: '1',
        tenantName: 'John Doe',
        tenantEmail: 'john.doe@email.com',
        tenantPhone: '+233 20 123 4567',
        propertyId: 'prop1',
        propertyTitle: 'Modern 2-Bedroom Apartment',
        propertyLocation: 'East Legon, Accra',
        amount: 2500,
        dueDate: new Date('2024-01-01'),
        paidDate: new Date('2024-01-02'),
        status: 'paid',
        paymentMethod: 'bank_transfer',
        reference: 'PAY-2024-001',
        description: 'Rent payment for January 2024',
        lateFees: 0,
        totalAmount: 2500,
        receiptUrl: 'receipt_001.pdf'
      },
      {
        id: '2',
        tenantName: 'Sarah Wilson',
        tenantEmail: 'sarah.wilson@email.com',
        tenantPhone: '+233 24 987 6543',
        propertyId: 'prop2',
        propertyTitle: 'Luxury 3-Bedroom House',
        propertyLocation: 'Trasacco Valley, Accra',
        amount: 4500,
        dueDate: new Date('2024-01-01'),
        status: 'overdue',
        paymentMethod: 'mobile_money',
        reference: 'PAY-2024-002',
        description: 'Rent payment for January 2024',
        lateFees: 225,
        totalAmount: 4725,
        notes: 'Contacted tenant about late payment'
      },
      {
        id: '3',
        tenantName: 'Michael Chen',
        tenantEmail: 'michael.chen@email.com',
        tenantPhone: '+233 26 555 1234',
        propertyId: 'prop3',
        propertyTitle: 'Studio Apartment',
        propertyLocation: 'Osu, Accra',
        amount: 1500,
        dueDate: new Date('2024-01-01'),
        status: 'pending',
        paymentMethod: 'online',
        reference: 'PAY-2024-003',
        description: 'Rent payment for January 2024',
        lateFees: 0,
        totalAmount: 1500
      }
    ];

    const mockInvoices: Invoice[] = [
      {
        id: '1',
        tenantName: 'John Doe',
        propertyTitle: 'Modern 2-Bedroom Apartment',
        amount: 2500,
        dueDate: new Date('2024-01-01'),
        status: 'paid',
        sentDate: new Date('2023-12-25'),
        paidDate: new Date('2024-01-02'),
        invoiceNumber: 'INV-2024-001',
        items: [
          { description: 'Rent - January 2024', amount: 2500 }
        ]
      },
      {
        id: '2',
        tenantName: 'Sarah Wilson',
        propertyTitle: 'Luxury 3-Bedroom House',
        amount: 4500,
        dueDate: new Date('2024-01-01'),
        status: 'overdue',
        sentDate: new Date('2023-12-25'),
        invoiceNumber: 'INV-2024-002',
        items: [
          { description: 'Rent - January 2024', amount: 4500 }
        ]
      }
    ];

    setPayments(mockPayments);
    setInvoices(mockInvoices);
    setFilteredPayments(mockPayments);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = payments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Apply property filter
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(payment => payment.propertyId === propertyFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, propertyFilter]);

  const handleSendReminder = async (paymentId: string) => {
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        toast({
          title: "Reminder Sent",
          description: `Payment reminder sent to ${payment.tenantName}`,
        });
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { 
              ...payment, 
              status: 'paid' as const,
              paidDate: new Date()
            }
          : payment
      ));

      toast({
        title: "Payment Marked as Paid",
        description: "Payment status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500">Partial</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Banknote className="h-4 w-4" />;
      case 'mobile_money':
        return <Phone className="h-4 w-4" />;
      case 'online':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'check':
        return <FileText className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
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
    const totalPayments = payments.length;
    const paidPayments = payments.filter(p => p.status === 'paid').length;
    const overduePayments = payments.filter(p => p.status === 'overdue').length;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const collectedAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.totalAmount, 0);

    return {
      totalPayments,
      paidPayments,
      overduePayments,
      totalAmount,
      collectedAmount,
      overdueAmount,
      collectionRate: totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payments...</p>
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
            <CreditCard size={24} />
            Payments & Invoicing
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage rent collection, payments, invoices, and financial tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rent Due</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPayments} payments
            </p>
            <Progress value={stats.collectionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.collectedAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.paidPayments} payments received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.overdueAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overduePayments} overdue payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.collectionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Successfully collected
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
                placeholder="Search payments..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {Array.from(new Set(payments.map(p => p.propertyId))).map(propertyId => {
                  const payment = payments.find(p => p.propertyId === propertyId);
                  return (
                    <SelectItem key={propertyId} value={propertyId}>
                      {payment?.propertyTitle}
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

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Payments ({filteredPayments.length} of {payments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{getInitials(payment.tenantName)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{payment.tenantName}</h3>
                      {payment.status === 'overdue' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {payment.propertyTitle} - {payment.propertyLocation}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <span>{formatPrice(payment.amount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Due: {formatDate(payment.dueDate)}</span>
                      </div>
                      {payment.paidDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle size={14} />
                          <span>Paid: {formatDate(payment.paidDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span>Ref: {payment.reference}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(payment.status)}
                  {getPaymentMethodIcon(payment.paymentMethod)}
                  
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
                        Download Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="mr-2" size={14} />
                        Send Invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {payment.status === 'pending' && (
                        <DropdownMenuItem 
                          onClick={() => handleMarkAsPaid(payment.id)}
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2" size={14} />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {payment.status === 'overdue' && (
                        <DropdownMenuItem 
                          onClick={() => handleSendReminder(payment.id)}
                          className="text-orange-600"
                        >
                          <Send className="mr-2" size={14} />
                          Send Reminder
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Edit className="mr-2" size={14} />
                        Edit Payment
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2" size={14} />
                        Delete Payment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No payments found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffPayments; 