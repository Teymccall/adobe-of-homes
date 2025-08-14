
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  LogOut, 
  Upload, 
  ListCheck, 
  User,
  Search
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import AgentDashboardNav from '@/components/agents/AgentDashboardNav';
import AgentProperties from '@/components/agents/AgentProperties';
import AgentVerifiedProperties from '@/components/agents/AgentVerifiedProperties';
import UploadProperty from '@/components/agents/UploadProperty';
import AgentProfile from '@/components/agents/AgentProfile';
import TenantSearch from '@/components/admin/TenantSearch';
import { useAuth } from '@/context/AuthContext';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading if user profile is not loaded yet
  if (!userProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              {userProfile.displayName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold">Welcome, {userProfile.displayName}</h1>
              <p className="text-sm text-muted-foreground">Home Owner Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button 
              variant="outline"  
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>

        <AgentDashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6">
          <div className={activeTab === 'properties' ? 'block' : 'hidden'}>
            <AgentProperties agentId={userProfile.uid} />
          </div>
          
          <div className={activeTab === 'unverified' ? 'block' : 'hidden'}>
            <AgentVerifiedProperties agentId={userProfile.uid} />
          </div>
          
          <div className={activeTab === 'upload' ? 'block' : 'hidden'}>
            <UploadProperty agentId={userProfile.uid} />
          </div>

          <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
            <AgentProfile agent={userProfile} />
          </div>

          <div className={activeTab === 'tenant-search' ? 'block' : 'hidden'}>
            <TenantSearch userType="home_owner" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgentDashboard;
