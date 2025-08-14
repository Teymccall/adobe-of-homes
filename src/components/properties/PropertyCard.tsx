
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, BadgeCheck, Clock, Check, X, Star, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertyAvailability } from '@/data/types';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  isVerified: boolean;
  availability: PropertyAvailability;
  rating?: number;
  className?: string;
  agentId?: string;
  agentName?: string;
  agentImage?: string;
  verifierAgentId?: string;
  verifierAgentName?: string;
  verifierAgentPhone?: string;
  stayDuration?: string;
}

const PropertyCard = ({
  id,
  title,
  location,
  price,
  imageUrl,
  propertyType,
  bedrooms,
  bathrooms,
  isVerified,
  availability,
  rating,
  className,
  agentId,
  agentName,
  agentImage,
  verifierAgentId,
  verifierAgentName,
  verifierAgentPhone,
  stayDuration,
}: PropertyCardProps) => {
  const renderAvailabilityBadge = () => {
    switch (availability) {
      case 'available':
        return (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Check size={12} />
            <span>Available</span>
          </div>
        );
      case 'pending':
        return (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} />
            <span>Pending</span>
          </div>
        );
      case 'unavailable':
        return (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <X size={12} />
            <span>Unavailable</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Link to={`/property/${id}`} className={cn("property-card group", className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        {renderAvailabilityBadge()}
        {isVerified && (
          <div className="absolute top-2 right-2 verified-badge">
            <BadgeCheck size={14} />
            <span>Verified</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold">GH₵ {price.toLocaleString()}</span>
          {rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>
        
        <h3 className="font-medium text-base mb-1 line-clamp-1">{title}</h3>
        
        <div className="flex items-center gap-1 text-muted-foreground mb-2">
          <MapPin size={14} />
          <span className="text-xs truncate">{location}</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <Home size={14} />
            <span>{propertyType}</span>
          </div>
          <div>{bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}</div>
          <div>{bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}</div>
        </div>
        
        {stayDuration && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Clock size={14} />
            <span>{stayDuration === 'short' ? 'Short Stay' : 
                    stayDuration === '1year' ? '1 Year' : 
                    stayDuration === '2years' ? '2 Years' : 
                    stayDuration === '3plus' ? '3+ Years' : stayDuration}</span>
          </div>
        )}
        
        {/* Ghana Homes contact footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-ghana-primary" />
            <span className="text-xs font-medium text-ghana-primary">Ghana Homes</span>
          </div>
          <div className="text-xs text-muted-foreground">
            +233 24 123 4567
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
