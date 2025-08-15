
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
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
    <section className="py-20 px-4 bg-gradient-to-b from-ghana-background to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">Featured Properties</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Discover our handpicked selection of premium properties across Ghana
          </p>
        </div>
        
        <div className="flex justify-center mb-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Button variant="outline" asChild className="group hover:bg-ghana-primary hover:text-white transition-all duration-300">
            <Link to="/search" className="flex items-center gap-2">
              View All Properties <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Show skeleton loading cards
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-fade-in-up" style={{animationDelay: `${0.1 * index}s`}}>
                <PropertyCardSkeleton />
              </div>
            ))
          ) : properties.length > 0 ? (
            // Show actual properties
            properties.map((property, index) => (
              <div key={property.id} className="animate-fade-in-up hover:scale-105 transition-transform duration-300" style={{animationDelay: `${0.1 * index}s`}}>
                <PropertyCard
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
              </div>
            ))
          ) : (
            // Show empty state
            <div className="col-span-full text-center py-16 animate-fade-in-up">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Featured Properties</h3>
              <p className="text-gray-500 mb-4">Check back soon for new listings</p>
              <Button variant="outline" asChild>
                <Link to="/submit-listing">Submit Your Property</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
