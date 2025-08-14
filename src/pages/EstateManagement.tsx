
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Users, 
  CreditCard, 
  Zap, 
  Droplets, 
  FileText,
  Plus,
  Search,
  LogOut,
  User
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ApartmentOverview from '@/components/estate/ApartmentOverview';
import TenantManagement from '@/components/estate/TenantManagement';
import PaymentManagement from '@/components/estate/PaymentManagement';
import UtilityBills from '@/components/estate/UtilityBills';
import MaintenanceRequests from '@/components/estate/MaintenanceRequests';

const EstateManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const estateAuth = localStorage.getItem('estateAuth');
    if (!estateAuth) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the estate management system.",
        variant: "destructive"
      });
      navigate('/estate-login');
      return;
    }

    try {
      const authData = JSON.parse(estateAuth);
      if (!authData.isAuthenticated) {
        navigate('/estate-login');
        return;
      }
      setCurrentUser(authData.user);
    } catch (error) {
      navigate('/estate-login');
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('estateAuth');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/estate-login');
  };

  const handleAddNew = () => {
    const addActions = {
      overview: 'Add new apartment unit',
      tenants: 'Add new tenant',
      payments: 'Record new payment',
      utilities: 'Generate utility bills',
      maintenance: 'Create maintenance request'
    };

    toast({
      title: "Add New",
      description: addActions[activeTab as keyof typeof addActions] || 'Opening form...',
    });
  };

  if (!currentUser) {
    return null; // Don't render until auth check completes
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Building className="text-primary" size={28} />
              Estate Management Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentUser.estateProperty} - Manage apartments, tenants, payments, and utilities
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <User size={16} />
                <div className="text-sm">
                  <div className="font-medium">{currentUser.name}</div>
                  <div className="text-muted-foreground">{currentUser.email}</div>
                </div>
              </div>
            </Card>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search apartments, tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button className="flex items-center gap-2" onClick={handleAddNew}>
              <Plus size={16} />
              Add New
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building size={16} />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tenants" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden md:inline">Tenants</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard size={16} />
              <span className="hidden md:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="utilities" className="flex items-center gap-2">
              <Zap size={16} />
              <span className="hidden md:inline">Utilities</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden md:inline">Maintenance</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <ApartmentOverview searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="tenants">
            <TenantManagement searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentManagement searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="utilities">
            <UtilityBills searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="maintenance">
            <MaintenanceRequests searchTerm={searchTerm} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EstateManagement;
