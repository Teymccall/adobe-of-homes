
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedArtisans from '@/components/home/FeaturedArtisans';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { authService } from '@/services/authService';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: featuredProperties, isLoading: propertiesLoading } = useFeaturedProperties(4);
  
  // Fetch featured artisans using React Query
  const { data: featuredArtisans = [], isLoading: artisansLoading } = useQuery({
    queryKey: ['featuredArtisans'],
    queryFn: async () => {
      const allArtisans = await authService.getAllArtisans();
      // Return only verified artisans, limited to 3
      return allArtisans.filter(artisan => artisan.isVerified).slice(0, 3);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      window.location.href = `/search?location=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <Layout>
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      <FeaturedProperties 
        properties={featuredProperties || []} 
        isLoading={propertiesLoading}
      />
      <HowItWorks />
      <FeaturedArtisans artisans={featuredArtisans} isLoading={artisansLoading} />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;
