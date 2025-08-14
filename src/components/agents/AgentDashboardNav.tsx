
import React from 'react';
import { Home, ListCheck, Upload, User, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AgentDashboardNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AgentDashboardNav = ({ activeTab, setActiveTab }: AgentDashboardNavProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 md:grid-cols-5 gap-2">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Home size={16} />
            <span className="hidden md:inline">My Properties</span>
            <span className="md:hidden">Properties</span>
          </TabsTrigger>
          
          <TabsTrigger value="unverified" className="flex items-center gap-2">
            <ListCheck size={16} />
            <span className="hidden md:inline">Unverified Properties</span>
            <span className="md:hidden">Unverified</span>
          </TabsTrigger>
          
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload size={16} />
            <span className="hidden md:inline">Upload Property</span>
            <span className="md:hidden">Upload</span>
          </TabsTrigger>

          <TabsTrigger value="tenant-search" className="flex items-center gap-2">
            <Search size={16} />
            <span className="hidden md:inline">Tenant Search</span>
            <span className="md:hidden">Search</span>
          </TabsTrigger>
          
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden md:inline">Profile</span>
            <span className="md:hidden">Profile</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AgentDashboardNav;
