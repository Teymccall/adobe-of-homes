
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, BadgeCheck } from 'lucide-react';
import { HomeOwner } from '@/data/types';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import VerifiedBadge from '@/components/badges/VerifiedBadge';
import StarRating from '@/components/reviews/StarRating';

interface AgentContactProps {
  agent: HomeOwner;
  propertyTitle: string;
  propertyPrice: number;
}

const AgentContact = ({ agent, propertyTitle, propertyPrice }: AgentContactProps) => {
  // Ghana Homes contact information
  const ghanaHomes = {
    name: "Ghana Homes",
    phone: "+233 24 123 4567",
    email: "contact@ghanahomes.com",
    profileImage: "/placeholder.svg",
    company: "Ghana Homes Limited",
    isVerified: true,
    averageRating: 4.9,
    reviewCount: 245
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-20">
      <h2 className="text-xl font-bold mb-4">Contact Ghana Homes</h2>
      
      <div className="flex items-center gap-4 mb-4">
        <img
          src={ghanaHomes.profileImage}
          alt={ghanaHomes.name}
          className="w-16 h-16 object-cover rounded-full"
        />
        <div>
          <div className="font-medium flex items-center gap-2">
            {ghanaHomes.name}
            <BadgeCheck size={16} className="text-ghana-verified" />
          </div>
          <p className="text-sm text-muted-foreground">{ghanaHomes.company}</p>
          <VerifiedBadge size="sm" className="mt-1" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <StarRating rating={ghanaHomes.averageRating} size={16} />
        <span className="text-sm">
          {ghanaHomes.averageRating.toFixed(1)} ({ghanaHomes.reviewCount} reviews)
        </span>
      </div>
      
      <div className="space-y-4">
        <a 
          href={`tel:${ghanaHomes.phone}`}
          className="flex items-center gap-2 bg-ghana-primary text-white px-4 py-2 rounded-md hover:bg-ghana-primary/90 transition-colors justify-center w-full"
        >
          <Phone size={18} />
          Call Ghana Homes
        </a>
        
        <a 
          href={`mailto:${ghanaHomes.email}?subject=Property Inquiry: ${propertyTitle}&body=Hello Ghana Homes, I am interested in the property: ${propertyTitle} (GH₵${propertyPrice}). Please provide more information about this property.`}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-600/90 transition-colors justify-center w-full"
        >
          <Mail size={18} />
          Email Ghana Homes
        </a>
        
        <WhatsAppButton 
          phoneNumber={ghanaHomes.phone}
          message={`Hello Ghana Homes, I am interested in the property: ${propertyTitle} (GH₵${propertyPrice}). Please provide more information.`}
          className="w-full"
        >
          WhatsApp Ghana Homes
        </WhatsAppButton>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
        <p className="font-medium mb-1">{ghanaHomes.name}</p>
        <p>Phone: {ghanaHomes.phone}</p>
        <p>Email: {ghanaHomes.email}</p>
        <p>Company: {ghanaHomes.company}</p>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>✓ Trusted property marketplace</p>
          <p>✓ Licensed real estate professionals</p>
        </div>
      </div>
    </div>
  );
};

export default AgentContact;
