
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const PropertyNotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p>The property you are looking for does not exist or has been removed.</p>
        <Link to="/search" className="text-ghana-primary hover:underline mt-4 inline-block">
          Back to Search
        </Link>
      </div>
    </Layout>
  );
};

export default PropertyNotFound;
