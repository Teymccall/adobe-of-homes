
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, X } from 'lucide-react';
import VerifiedBadge from '@/components/badges/VerifiedBadge';
import { Property } from '@/data/types';

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  const renderAvailabilityBadge = () => {
    switch (property.availability) {
      case 'available':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
            <Check size={14} className="text-green-500" />
            Available
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock size={14} className="text-yellow-500" />
            Pending
          </Badge>
        );
      case 'unavailable':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
            <X size={14} className="text-red-500" />
            Unavailable
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <MapPin size={16} className="text-ghana-primary" />
          <span>{property.location}</span>
          <div className="flex items-center gap-2">
            {property.isVerified && <VerifiedBadge className="ml-2" />}
            {renderAvailabilityBadge()}
          </div>
        </div>
      </div>
      <div className="mt-4 lg:mt-0">
        <div className="text-2xl md:text-3xl font-bold text-ghana-primary">
          GH₵ {property.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
