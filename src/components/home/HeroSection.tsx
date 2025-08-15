
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
    <section className="bg-gradient-to-br from-ghana-primary via-ghana-primary/95 to-ghana-primary/90 text-white py-20 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-ghana-accent/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse-slow"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
          Find Your Perfect Home in Ghana
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Trusted and verified property listings, reliable home owners, and skilled artisans - all in one place.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-lg mx-auto relative animate-scale-in" style={{animationDelay: '0.4s'}}>
          <Input
            type="text"
            placeholder="Search by location (e.g., East Legon, Accra)"
            className="pl-12 py-7 bg-white text-black rounded-xl shadow-2xl border-0 focus:ring-4 focus:ring-ghana-accent/30 transition-all duration-300 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          <Button 
            type="submit"
            className="absolute right-2 top-2 bg-ghana-accent text-ghana-primary hover:bg-ghana-accent/90 py-5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
          >
            Search
          </Button>
        </form>
        
        <div className="flex justify-center gap-12 mt-16 animate-slide-in-bottom" style={{animationDelay: '0.6s'}}>
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <BadgeCheck className="text-ghana-accent" size={28} />
            </div>
            <span className="font-medium">Verified Listings</span>
            <span className="text-sm text-ghana-accent/80">100% Trusted</span>
          </div>
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <User className="text-ghana-accent" size={28} />
            </div>
            <span className="font-medium">Trusted Home Owners</span>
            <span className="text-sm text-ghana-accent/80">(No Agent Fees)</span>
          </div>
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <List className="text-ghana-accent" size={28} />
            </div>
            <span className="font-medium">Skilled Artisans</span>
            <span className="text-sm text-ghana-accent/80">Expert Services</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
