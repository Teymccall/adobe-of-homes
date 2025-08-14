
import React from 'react';
import { 
  Shield, FileText, Users, LayoutDashboard, UserCog, Search, Building, FileText as FileTextIcon, Wrench, Calendar, CreditCard, HelpCircle
} from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StaffTabNavigationProps {
  canAccess: (priority: string) => boolean;
}

const StaffTabNavigation = ({ canAccess }: StaffTabNavigationProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-12 mb-8">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <LayoutDashboard size={16} />
        Overview
      </TabsTrigger>
      
      <TabsTrigger value="property_management" className="flex items-center gap-2">
        <Building size={16} />
        <span className="hidden md:inline">Properties</span>
        <span className="md:hidden">Properties</span>
      </TabsTrigger>
      
      <TabsTrigger value="rental_applications" className="flex items-center gap-2">
        <FileTextIcon size={16} />
        <span className="hidden md:inline">Applications</span>
        <span className="md:hidden">Applications</span>
      </TabsTrigger>
      
      <TabsTrigger value="maintenance_requests" className="flex items-center gap-2">
        <Wrench size={16} />
        <span className="hidden md:inline">Maintenance</span>
        <span className="md:hidden">Maintenance</span>
      </TabsTrigger>
      
      <TabsTrigger value="payments" className="flex items-center gap-2">
        <CreditCard size={16} />
        <span className="hidden md:inline">Payments</span>
        <span className="md:hidden">Payments</span>
      </TabsTrigger>
      
      <TabsTrigger value="calendar" className="flex items-center gap-2">
        <Calendar size={16} />
        <span className="hidden md:inline">Calendar</span>
        <span className="md:hidden">Calendar</span>
      </TabsTrigger>
      
      <TabsTrigger value="support" className="flex items-center gap-2">
        <HelpCircle size={16} />
        <span className="hidden md:inline">Support</span>
        <span className="md:hidden">Support</span>
      </TabsTrigger>
      
      {canAccess('property_verification') && (
        <TabsTrigger value="property_verification" className="flex items-center gap-2">
          <Shield size={16} />
          <span className="hidden md:inline">Verification</span>
          <span className="md:hidden">Verify</span>
        </TabsTrigger>
      )}
      
      {canAccess('user_management') && (
        <TabsTrigger value="home_owners" className="flex items-center gap-2">
          <Users size={16} />
          <span className="hidden md:inline">Home Owners</span>
          <span className="md:hidden">Owners</span>
        </TabsTrigger>
      )}
      
      <TabsTrigger value="tenant_search" className="flex items-center gap-2">
        <Search size={16} />
        <span className="hidden md:inline">Tenant Search</span>
        <span className="md:hidden">Search</span>
      </TabsTrigger>
      
      {canAccess('reports') && (
        <TabsTrigger value="reports" className="flex items-center gap-2">
          <FileText size={16} />
          Reports
        </TabsTrigger>
      )}
      
      {canAccess('user_management') && (
        <TabsTrigger value="user_management" className="flex items-center gap-2">
          <UserCog size={16} />
          <span className="hidden md:inline">User Management</span>
          <span className="md:hidden">Users</span>
        </TabsTrigger>
      )}
    </TabsList>
  );
};

export default StaffTabNavigation;
