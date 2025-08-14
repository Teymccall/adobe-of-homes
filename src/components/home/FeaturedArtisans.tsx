
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, BadgeCheck, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/services/authService';

interface FeaturedArtisansProps {
  artisans: UserProfile[];
  isLoading?: boolean;
}

const FeaturedArtisans = ({ artisans, isLoading = false }: FeaturedArtisansProps) => {
  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-ghana-background">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Artisans</h2>
            <Button variant="outline" asChild>
              <Link to="/artisans" className="flex items-center gap-2">
                View All <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-ghana-background">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Artisans</h2>
          <Button variant="outline" asChild>
            <Link to="/artisans" className="flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {artisans.map((artisan) => (
            <Link to={`/artisans/${artisan.uid}`} key={artisan.uid} className="bg-white rounded-lg shadow hover:shadow-md transition-all p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {artisan.displayName?.charAt(0) || 'A'}
                </div>
                <div>
                  <h3 className="font-medium">{artisan.displayName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {artisan.skills?.slice(0, 2).join(", ") || 'Skilled Artisan'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-ghana-primary" />
                    <span className="text-xs">{artisan.location || 'Location not specified'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Shield size={14} className="text-green-600" />
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">4.5/5</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {artisans.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No featured artisans available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedArtisans;
