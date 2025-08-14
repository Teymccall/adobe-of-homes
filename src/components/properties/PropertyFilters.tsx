
import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchFilters } from '@/data/types';

interface PropertyFiltersProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}

const PropertyFilters = ({ filters, setFilters }: PropertyFiltersProps) => {
  const handleSearch = () => {
    // Could add additional search logic here if needed
    console.log('Searching with filters:', filters);
  };

  const handleFilter = (filterName: keyof SearchFilters, value: string) => {
    setFilters({ ...filters, [filterName]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="relative md:col-span-2">
          <Input
            placeholder="Search by location..."
            value={filters.location}
            onChange={(e) => handleFilter('location', e.target.value)}
            className="pl-9 w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        </div>
        
        <div className="md:col-span-2">
          <Select 
            value={filters.propertyType} 
            onValueChange={(value) => handleFilter('propertyType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Select 
            value={filters.priceRange} 
            onValueChange={(value) => handleFilter('priceRange', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-1000">GH₵0 - GH₵1,000</SelectItem>
                <SelectItem value="1000-2000">GH₵1,000 - GH₵2,000</SelectItem>
                <SelectItem value="2000-5000">GH₵2,000 - GH₵5,000</SelectItem>
                <SelectItem value="5000+">GH₵5,000+</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Select 
            value={filters.bedrooms} 
            onValueChange={(value) => handleFilter('bedrooms', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Any Bedrooms</SelectItem>
                <SelectItem value="1">1+ Bedroom</SelectItem>
                <SelectItem value="2">2+ Bedrooms</SelectItem>
                <SelectItem value="3">3+ Bedrooms</SelectItem>
                <SelectItem value="4">4+ Bedrooms</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Select 
            value={filters.stayDuration} 
            onValueChange={(value) => handleFilter('stayDuration', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Duration of Stay" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Any Duration</SelectItem>
                <SelectItem value="short">Short Stay</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
                <SelectItem value="3plus">3+ Years</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Button onClick={handleSearch} className="w-full bg-ghana-primary hover:bg-ghana-primary/90">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
