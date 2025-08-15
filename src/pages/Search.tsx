
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/properties/PropertyCard';
import MapSearchView from '@/components/maps/MapSearchView';
import PropertyFilters from '@/components/properties/PropertyFilters';
import { SearchFilters } from '@/data/types';
import { propertyService } from '@/services/propertyService';
import { authService } from '@/services/authService';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('propertyType') || 'all',
    priceRange: searchParams.get('priceRange') || 'all',
    bedrooms: searchParams.get('bedrooms') || 'all',
    stayDuration: searchParams.get('stayDuration') || 'all',
    showMap: searchParams.get('showMap') === 'true',
  });
  
  const [properties, setProperties] = useState<any[]>([]);
  const [homeOwners, setHomeOwners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch properties (public access)
        const propertiesData = await propertyService.getAllProperties();
        setProperties(propertiesData || []);
        
        // Try to fetch home owners if possible (for authenticated users)
        try {
          const homeOwnersData = await authService.getVerifiedHomeOwners();
          setHomeOwners(homeOwnersData || []);
        } catch (homeOwnerError) {
          console.warn('⚠️ Could not fetch home owners (may require authentication):', homeOwnerError);
          setHomeOwners([]); // Set empty array if we can't fetch home owners
        }
        
        if (!propertiesData || propertiesData.length === 0) {
          console.warn('⚠️ No properties found in database');
          setError('No properties available at the moment. Please check back later.');
        }
        
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setError(`Failed to load properties: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get home owner by ID
  const getHomeOwnerById = (homeOwnerId: string) => {
    return homeOwners.find(owner => owner.uid === homeOwnerId) || null;
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.propertyType !== 'all') params.set('propertyType', filters.propertyType);
    if (filters.priceRange !== 'all') params.set('priceRange', filters.priceRange);
    if (filters.bedrooms !== 'all') params.set('bedrooms', filters.bedrooms);
    if (filters.stayDuration !== 'all') params.set('stayDuration', filters.stayDuration);
    if (filters.showMap) params.set('showMap', 'true');
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

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
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading properties...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium text-red-800 mb-2">Error Loading Properties</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
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
        

        
        {/* Search bar */}
        <div className="mb-6">
          <div className="max-w-md relative">
            <input
              type="text"
              placeholder="Search by location (e.g., East Legon, Accra)"
              className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghana-primary focus:border-transparent"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            />
            <button
              onClick={() => setFilters(prev => ({ ...prev, location: filters.location }))}
              className="absolute right-1 top-1 bg-ghana-primary text-white px-4 py-2 rounded-md hover:bg-ghana-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters 
            filters={filters} 
            setFilters={setFilters} 
          />
        </div>
        
        {/* Map + Property listings */}
        <div className="w-full space-y-6">
          {/* Map toggle and view */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Property Locations</h3>
            <button
              onClick={() => setFilters(prev => ({ ...prev, showMap: !prev.showMap }))}
              className="flex items-center gap-2 px-4 py-2 bg-ghana-primary text-white rounded-lg hover:bg-ghana-primary/90 transition-colors"
            >
              {filters.showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>
          
          {filters.showMap && (
            <MapSearchView 
              properties={filteredProperties as any}
              onBoundsChange={() => { /* hook for future "search this area" */ }}
            />
          )}

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
              <p className="text-muted-foreground mb-4">
                {properties.length === 0 
                  ? "No properties are currently available in the database." 
                  : "Try adjusting your search filters"
                }
              </p>
              {properties.length === 0 ? (
                <div className="text-sm text-gray-500">
                  <p>This could mean:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>No properties have been added yet</li>
                    <li>There's an issue with the database connection</li>
                    <li>Properties exist but aren't being fetched correctly</li>
                  </ul>
                </div>
              ) : (
                <button
                  onClick={() => setFilters({
                    location: '',
                    propertyType: 'all',
                    priceRange: 'all',
                    bedrooms: 'all',
                    stayDuration: 'all',
                    showMap: false,
                  })}
                  className="text-ghana-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
