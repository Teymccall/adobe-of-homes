
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilters from '@/components/properties/PropertyFilters';
import { SearchFilters } from '@/data/types';
import { propertyService } from '@/services/propertyService';
import { authService } from '@/services/authService';

const Search = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: 'all',
    priceRange: 'all',
    bedrooms: 'all',
    stayDuration: 'all',
  });
  
  const [properties, setProperties] = useState<any[]>([]);
  const [homeOwners, setHomeOwners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch properties and home owners in parallel
        const [propertiesData, homeOwnersData] = await Promise.all([
          propertyService.getAllProperties(),
          authService.getVerifiedHomeOwners()
        ]);
        
        setProperties(propertiesData);
        setHomeOwners(homeOwnersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get home owner by ID
  const getHomeOwnerById = (homeOwnerId: string) => {
    return homeOwners.find(owner => owner.uid === homeOwnerId);
  };

  // Filter properties based on user filters
  const filteredProperties = properties.filter((property) => {
    // Location filter
    if (filters.location && !property.location?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Property type filter
    if (filters.propertyType && filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        if (property.price < min || property.price > max) {
          return false;
        }
      } else if (filters.priceRange === '5000+') {
        if (property.price < 5000) {
          return false;
        }
      }
    }
    
    // Bedrooms filter
    if (filters.bedrooms && filters.bedrooms !== 'all') {
      const minBedrooms = parseInt(filters.bedrooms);
      if (property.bedrooms < minBedrooms) {
        return false;
      }
    }
    
    // Stay duration filter
    if (filters.stayDuration && filters.stayDuration !== 'all') {
      // If the property doesn't have a stayDuration defined, exclude it
      if (!property.stayDuration) {
        return false;
      }
      
      if (property.stayDuration !== filters.stayDuration) {
        return false;
      }
    }
    
    return true;
  });

  if (isLoading) {
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Property</h1>
        <p className="text-muted-foreground mb-6">Browse properties for sale and rent in Ghana</p>
        
        {/* Filters at the top */}
        <div className="mb-8">
          <PropertyFilters 
            filters={filters} 
            setFilters={setFilters} 
          />
        </div>
        
        {/* Property listings */}
        <div className="w-full">
          {filteredProperties.length > 0 ? (
            <div>
              <p className="mb-4 text-muted-foreground">Showing {filteredProperties.length} properties</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  const homeOwner = getHomeOwnerById(property.homeOwnerId);
                  const verifierAgent = property.verifiedBy ? getHomeOwnerById(property.verifiedBy) : undefined;
                  
                  const imageUrl = property.images && property.images.length > 0 ? property.images[0] : '/placeholder.svg';
                  
                  return (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      location={property.location}
                      price={property.price}
                      imageUrl={imageUrl}
                      propertyType={property.propertyType}
                      bedrooms={property.bedrooms}
                      bathrooms={property.bathrooms}
                      isVerified={property.isVerified}
                      availability={property.availability}
                      rating={homeOwner?.averageRating}
                      agentId={homeOwner?.uid}
                      agentName={homeOwner?.name}
                      agentImage={homeOwner?.profileImage}
                      verifierAgentId={verifierAgent?.uid}
                      verifierAgentName={verifierAgent?.name}
                      verifierAgentPhone={verifierAgent?.phone}
                      stayDuration={property.stayDuration}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-medium mb-2">No properties found</h2>
              <p className="text-muted-foreground mb-4">Try adjusting your search filters</p>
              <button
                onClick={() => setFilters({
                  location: '',
                  propertyType: 'all',
                  priceRange: 'all',
                  bedrooms: 'all',
                  stayDuration: 'all',
                })}
                className="text-ghana-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
