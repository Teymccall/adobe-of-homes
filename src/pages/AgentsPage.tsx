
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Building } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StarRating from '@/components/reviews/StarRating';
import { mockAgents } from '@/data/mockData';

const AgentsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Property Agents</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAgents.map((agent) => (
            <Link
              to={`/agents/${agent.id}`}
              key={agent.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-all overflow-hidden"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={agent.profileImage}
                  alt={agent.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-lg">{agent.name}</h3>
                  {agent.isVerified && (
                    <BadgeCheck className="text-ghana-verified" size={18} />
                  )}
                </div>
                
                {agent.company && (
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                    <Building size={14} />
                    <span>{agent.company}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin size={14} />
                  <span>Ghana</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <StarRating rating={agent.averageRating} size={16} />
                    <span className="text-sm">({agent.reviews.length})</span>
                  </div>
                  
                  <span className="text-sm text-ghana-primary font-medium">
                    {agent.properties.length} {agent.properties.length === 1 ? 'Property' : 'Properties'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AgentsPage;
