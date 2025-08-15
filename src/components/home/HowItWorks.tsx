
import React from 'react';
import { Search, Home, List } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-ghana-primary/5 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-ghana-accent/5 rounded-full"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in-up">How It Works</h2>
        <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Get started in just three simple steps to find your perfect property
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ghana-primary to-ghana-primary/80 text-white flex items-center justify-center text-2xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="w-20 h-20 rounded-full bg-ghana-primary/20 absolute inset-0 animate-pulse-slow"></div>
            </div>
            <div className="w-16 h-16 rounded-full bg-ghana-primary text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Search Properties</h3>
            <p className="text-muted-foreground max-w-xs">Find verified properties by location, price, and features with our advanced search.</p>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ghana-primary to-ghana-primary/80 text-white flex items-center justify-center text-2xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="w-20 h-20 rounded-full bg-ghana-primary/20 absolute inset-0 animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
            </div>
            <div className="w-16 h-16 rounded-full bg-ghana-primary text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Home size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Contact Home Owners</h3>
            <p className="text-muted-foreground max-w-xs">Connect directly with verified home owners and property owners.</p>
            <span className="text-sm text-ghana-accent font-bold mt-2 bg-ghana-accent/10 px-3 py-1 rounded-full">(No Agent Fees)</span>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ghana-primary to-ghana-primary/80 text-white flex items-center justify-center text-2xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="w-20 h-20 rounded-full bg-ghana-primary/20 absolute inset-0 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            </div>
            <div className="w-16 h-16 rounded-full bg-ghana-primary text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <List size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Find Artisans</h3>
            <p className="text-muted-foreground max-w-xs">Access our directory of skilled and trusted home service professionals.</p>
          </div>
        </div>
        
        {/* Connection lines */}
        <div className="hidden md:block mt-8">
          <div className="flex justify-center items-center">
            <div className="w-16 h-0.5 bg-ghana-primary/30"></div>
            <div className="w-4 h-4 bg-ghana-primary rounded-full mx-4"></div>
            <div className="w-16 h-0.5 bg-ghana-primary/30"></div>
            <div className="w-4 h-4 bg-ghana-primary rounded-full mx-4"></div>
            <div className="w-16 h-0.5 bg-ghana-primary/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
