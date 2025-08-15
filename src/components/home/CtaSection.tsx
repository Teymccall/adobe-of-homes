
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-ghana-primary via-ghana-primary/95 to-ghana-primary/90 text-white text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">Are You a Property Owner or Agent?</h2>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          List your property on our platform to reach thousands of potential buyers and renters. 
          Join our trusted network of verified property professionals.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Button asChild className="bg-ghana-accent text-ghana-primary hover:bg-ghana-accent/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Link to="/submit-listing">Submit Your Listing</Link>
          </Button>
          <Button variant="outline" asChild className="border-white text-white hover:bg-white hover:text-ghana-primary px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
            <Link to="/apply-agent">Become an Agent</Link>
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="text-center">
            <div className="text-3xl font-bold text-ghana-accent mb-2">1000+</div>
            <div className="text-white/80">Active Listings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-ghana-accent mb-2">500+</div>
            <div className="text-white/80">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-ghana-accent mb-2">24/7</div>
            <div className="text-white/80">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
