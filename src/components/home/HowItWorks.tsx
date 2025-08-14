
import React from 'react';
import { Search, Home, List } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-ghana-primary text-white flex items-center justify-center mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-medium mb-2">Search Properties</h3>
            <p className="text-muted-foreground">Find verified properties by location, price, and features.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-ghana-primary text-white flex items-center justify-center mb-4">
              <Home size={28} />
            </div>
            <h3 className="text-xl font-medium mb-2">Contact Home Owners</h3>
            <p className="text-muted-foreground">Connect directly with verified home owners and property owners.</p>
            <span className="text-sm text-ghana-accent font-bold">(No Agent Fees)</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-ghana-primary text-white flex items-center justify-center mb-4">
              <List size={28} />
            </div>
            <h3 className="text-xl font-medium mb-2">Find Artisans</h3>
            <p className="text-muted-foreground">Access our directory of skilled and trusted home service professionals.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
