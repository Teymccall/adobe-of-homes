
import React from 'react';
import { Home, Ruler, Calendar } from 'lucide-react';
import MapSearchView from '@/components/maps/MapSearchView';
import { format } from 'date-fns';
import { Property } from '@/data/types';

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Property Type</span>
          <div className="flex items-center gap-2 mt-1">
            <Home size={18} />
            <span>{property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</span>
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Bedrooms</span>
          <span className="mt-1">{property.bedrooms}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Bathrooms</span>
          <span className="mt-1">{property.bathrooms}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Area</span>
          <div className="flex items-center gap-2 mt-1">
            <Ruler size={18} />
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
      
      <h3 className="font-medium mb-2">Description</h3>
      <p className="text-muted-foreground mb-6">{property.description}</p>
      
      <h3 className="font-medium mb-2">Features</h3>
      <ul className="grid grid-cols-2 gap-2">
        {property.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-ghana-primary rounded-full"></span>
            {feature}
          </li>
        ))}
      </ul>
      
      {property.mapLocation && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Location</h3>
          <div className="h-[220px]">
            <MapSearchView properties={[property as any]} />
          </div>
        </div>
      )}
      
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar size={16} />
        <span>Listed {format(property.createdAt, 'MMMM d, yyyy')}</span>
      </div>
    </div>
  );
};

export default PropertyDetails;
