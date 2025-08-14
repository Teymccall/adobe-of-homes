
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PropertyCard from '@/components/properties/PropertyCard';
import { Property } from '@/data/types';

interface FeaturedPropertiesProps {
  properties: Property[];
  isLoading?: boolean;
}

const PropertyCardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-6 w-1/3" />
  </div>
);

const FeaturedProperties = ({ properties, isLoading = false }: FeaturedPropertiesProps) => {
  return (
    <section className="py-16 px-4 bg-ghana-background">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Properties</h2>
          <Button variant="outline" asChild>
            <Link to="/search" className="flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Show skeleton loading cards
            Array.from({ length: 4 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))
          ) : properties.length > 0 ? (
            // Show actual properties
            properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                imageUrl={property.images[0]}
                propertyType={property.propertyType}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                isVerified={property.isVerified}
                availability={property.availability}
              />
            ))
          ) : (
            // Show empty state
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No featured properties available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
