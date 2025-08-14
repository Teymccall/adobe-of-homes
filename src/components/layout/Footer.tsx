
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-ghana-primary mb-4">GhanaHomes</h3>
            <p className="text-gray-600 mb-4">
              Making Ghana's housing market more transparent and trustworthy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-ghana-primary">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ghana-primary">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ghana-primary">
                <Twitter size={20} />
              </a>
              <a href="mailto:contact@ghanahomes.com" className="text-gray-400 hover:text-ghana-primary">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-ghana-primary">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-ghana-primary">Find Properties</Link>
              </li>
              <li>
                <Link to="/submit-listing" className="text-gray-600 hover:text-ghana-primary">Submit Listing</Link>
              </li>
              <li>
                <Link to="/agents" className="text-gray-600 hover:text-ghana-primary">Agents</Link>
              </li>
              <li>
                <Link to="/artisans" className="text-gray-600 hover:text-ghana-primary">Artisans</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-bold mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-2">Accra, Ghana</p>
            <p className="text-gray-600 mb-2">Phone: +233 20 123 4567</p>
            <p className="text-gray-600">Email: contact@ghanahomes.com</p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} GhanaHomes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
