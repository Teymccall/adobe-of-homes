
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
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-12 gap-2 p-2 bg-transparent">
      <TabsTrigger 
        value="overview" 
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
      >
        <LayoutDashboard size={16} />
        <span className="hidden md:inline font-medium">Overview</span>
        <span className="md:hidden font-medium">Overview</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="property_management" 
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
      >
        <Building size={16} />
        <span className="hidden md:inline font-medium">Properties</span>
        <span className="md:hidden font-medium">Properties</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="rental_applications" 
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
      >
        <FileTextIcon size={16} />
        <span className="hidden md:inline font-medium">Applications</span>
        <span className="md:hidden font-medium">Applications</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="maintenance_requests" 
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
      >
        <Wrench size={16} />
        <span className="hidden md:inline font-medium">Maintenance</span>
        <span className="md:hidden font-medium">Maintenance</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="payments" 
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
      >
        <CreditCard size={16} />
        <span className="hidden md:inline font-medium">Payments</span>
        <span className="md:hidden font-medium">Payments</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="calendar" 
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
      >
        <Calendar size={16} />
        <span className="hidden md:inline font-medium">Calendar</span>
        <span className="md:hidden font-medium">Calendar</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="support" 
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
      >
        <HelpCircle size={16} />
        <span className="hidden md:inline font-medium">Support</span>
        <span className="md:hidden font-medium">Support</span>
      </TabsTrigger>
      
      {canAccess('property_verification') && (
        <TabsTrigger 
          value="property_verification" 
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
        >
          <Shield size={16} />
          <span className="hidden md:inline font-medium">Verification</span>
          <span className="md:hidden font-medium">Verify</span>
        </TabsTrigger>
      )}
      
      {canAccess('user_management') && (
        <TabsTrigger 
          value="home_owners" 
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
        >
          <Users size={16} />
          <span className="hidden md:inline font-medium">Home Owners</span>
          <span className="md:hidden font-medium">Owners</span>
        </TabsTrigger>
      )}
      
      <TabsTrigger 
        value="tenant_search" 
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
      >
        <Search size={16} />
        <span className="hidden md:inline font-medium">Tenant Search</span>
        <span className="md:hidden font-medium">Search</span>
      </TabsTrigger>
      
      {canAccess('reports') && (
        <TabsTrigger 
          value="reports" 
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
        >
          <FileText size={16} />
          <span className="font-medium">Reports</span>
        </TabsTrigger>
      )}
      
      {canAccess('user_management') && (
        <TabsTrigger 
          value="user_management" 
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
        >
          <UserCog size={16} />
          <span className="hidden md:inline font-medium">User Management</span>
          <span className="md:hidden font-medium">Users</span>
        </TabsTrigger>
      )}
    </TabsList>
  );
};

export default StaffTabNavigation;
