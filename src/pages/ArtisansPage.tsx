
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Search, Filter, Hammer, Shield } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StarRating from '@/components/reviews/StarRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { authService, UserProfile } from '@/services/authService';

const ArtisansPage = () => {
  const [artisans, setArtisans] = useState<UserProfile[]>([]);
  const [filteredArtisans, setFilteredArtisans] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setIsLoading(true);
        const allArtisans = await authService.getAllArtisans();
        setArtisans(allArtisans);
        setFilteredArtisans(allArtisans);
      } catch (error) {
        console.error('Error fetching artisans:', error);
        toast({
          title: "Error",
          description: "Failed to load artisans. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtisans();
  }, [toast]);

  useEffect(() => {
    let filtered = artisans;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(artisan =>
        artisan.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        artisan.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(artisan => artisan.location === selectedLocation);
    }

    // Filter by skill
    if (selectedSkill !== 'all') {
      filtered = filtered.filter(artisan => 
        artisan.skills?.some(skill => skill.toLowerCase() === selectedSkill.toLowerCase())
      );
    }

    setFilteredArtisans(filtered);
  }, [artisans, searchTerm, selectedLocation, selectedSkill]);

  // Safely extract locations and skills with null checks
  const locations = ['all', ...Array.from(new Set(artisans?.map(artisan => artisan.location).filter(Boolean) || []))];
  const skills = ['all', ...Array.from(new Set(artisans?.flatMap(artisan => artisan.skills || []) || []))];

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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Professional Artisans
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find skilled artisans and service providers for your property needs. 
            All our artisans are verified and ready to help.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search artisans by name, skills, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {skills.map(skill => (
                <option key={skill} value={skill}>
                  {skill === 'all' ? 'All Skills' : skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredArtisans.length} of {artisans.length} artisans
          </p>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map((artisan) => (
            <Card key={artisan.uid} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {artisan.displayName?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{artisan.displayName}</CardTitle>
                      <p className="text-sm text-gray-600">{artisan.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{artisan.location || 'Location not specified'}</span>
                  </div>
                  
                  {artisan.skills && artisan.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {artisan.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {artisan.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{artisan.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <StarRating rating={4.5} size={16} />
                      <span className="text-sm">(Verified)</span>
                    </div>
                    
                    <span className="text-sm text-orange-600 font-medium">
                      {artisan.yearsOfExperience || 0} years exp.
                    </span>
                  </div>
                  
                  <div className="pt-3">
                    <Button asChild className="w-full">
                      <Link to={`/artisans/${artisan.uid}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArtisans.length === 0 && (
          <div className="text-center py-12">
            <Hammer className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No artisans found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or location filter.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ArtisansPage;
