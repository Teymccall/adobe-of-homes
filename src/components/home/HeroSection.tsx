
import React from 'react';
import { Search, BadgeCheck, User, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const HeroSection = ({ searchQuery, setSearchQuery, handleSearch }: HeroSectionProps) => {
  return (
    <section className="bg-ghana-primary text-white py-16 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
          Find Your Perfect Home in Ghana
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Trusted and verified property listings, reliable home owners, and skilled artisans - all in one place.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
          <Input
            type="text"
            placeholder="Search by location (e.g., East Legon, Accra)"
            className="pl-10 py-6 bg-white text-black rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Button 
            type="submit"
            className="absolute right-1.5 top-1.5 bg-ghana-accent text-ghana-primary hover:bg-ghana-accent/90 py-4"
          >
            Search
          </Button>
        </form>
        
        <div className="flex justify-center gap-8 mt-12">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
              <BadgeCheck className="text-ghana-accent" size={24} />
            </div>
            <span>Verified Listings</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
              <User className="text-ghana-accent" size={24} />
            </div>
            <span>Trusted Home Owners</span>
            <span className="text-sm text-ghana-accent">(No Agent Fees)</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
              <List className="text-ghana-accent" size={24} />
            </div>
            <span>Skilled Artisans</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
