
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ListCheck, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockProperties } from '@/data/mockData';

interface AgentVerifiedPropertiesProps {
  agentId: string;
}

const AgentVerifiedProperties = ({ agentId }: AgentVerifiedPropertiesProps) => {
  // Get properties that are pending verification and managed by this home owner
  const unverifiedProperties = mockProperties.filter(
    property => property.verificationStatus === 'pending' && property.homeOwnerId === agentId
  );

  if (unverifiedProperties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <ListCheck className="mx-auto text-muted-foreground" size={48} />
        <h3 className="text-xl font-medium mt-4">No Unverified Properties</h3>
        <p className="text-muted-foreground mt-2">
          You don't have any properties pending verification.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Unverified Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {unverifiedProperties.map(property => (
          <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative aspect-video">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Clock size={12} />
                <span>Pending Verification</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1">{property.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{property.location}</p>
              <p className="font-bold text-lg mb-4">GH₵ {property.price.toLocaleString()}</p>
              
              <div className="flex items-center justify-end">
                <Button asChild variant="outline" className="flex items-center gap-1">
                  <Link to={`/property/${property.id}`}>
                    <Eye size={16} />
                    View
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentVerifiedProperties;
