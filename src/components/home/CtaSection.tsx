
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="py-16 px-4 bg-ghana-primary text-white text-center">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Are You a Property Owner or Agent?</h2>
        <p className="mb-8">List your property on our platform to reach thousands of potential buyers and renters.</p>
        <Button asChild className="bg-ghana-accent text-ghana-primary hover:bg-ghana-accent/90">
          <Link to="/submit-listing">Submit Your Listing</Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
