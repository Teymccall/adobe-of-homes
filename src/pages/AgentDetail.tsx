
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building, Phone, Mail, BadgeCheck, Star, Home } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StarRating from '@/components/reviews/StarRating';
import ReviewCard from '@/components/reviews/ReviewCard';
import PropertyCard from '@/components/properties/PropertyCard';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getAgentById, getPropertiesByAgentId } from '@/data/mockData';

const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const agent = id ? getAgentById(id) : undefined;
  const agentProperties = agent ? getPropertiesByAgentId(agent.id) : [];
  
  // Ghana Homes official contact information
  const ghanaHomesPhone = "+233 24 123 4567";
  const ghanaHomesEmail = "contact@ghanahomes.com";
  
  if (!agent) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Home Owner Not Found</h1>
          <p>The home owner you are looking for does not exist or has been removed.</p>
          <Link to="/home-owners" className="text-ghana-primary hover:underline mt-4 inline-block">
            Back to Home Owners
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/home-owners" className="text-ghana-primary hover:underline">
            &larr; Back to Home Owners
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Agent Header */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <img
                src={agent.profileImage}
                alt={agent.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">{agent.name}</h1>
                  {agent.isVerified && (
                    <BadgeCheck className="text-ghana-verified" size={24} />
                  )}
                </div>
                
                {agent.company && (
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Building size={16} />
                    <span>{agent.company}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={agent.averageRating} size={18} />
                  <span className="text-sm">
                    {agent.averageRating.toFixed(1)} ({agent.reviews.length} reviews)
                  </span>
                </div>
                
                <p className="text-muted-foreground">{agent.bio}</p>
              </div>
              
              <div className="flex flex-col space-y-2 md:w-auto w-full">
                <Link to={`/home-owners/${agent.id}/properties`} className="inline-block">
                  <Button className="w-full flex items-center gap-2">
                    <Home size={18} />
                    View Properties
                  </Button>
                </Link>
              
                <a 
                  href={`tel:${ghanaHomesPhone}`}
                  className="flex items-center gap-2 bg-ghana-primary text-white px-4 py-2 rounded-md hover:bg-ghana-primary/90 transition-colors"
                >
                  <Phone size={18} />
                  Call Ghana Homes
                </a>
                
                <a 
                  href={`mailto:${ghanaHomesEmail}?subject=Interest in Properties by ${agent.name}`}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-600/90 transition-colors"
                >
                  <Mail size={18} />
                  Email Ghana Homes
                </a>
                
                <WhatsAppButton 
                  phoneNumber={ghanaHomesPhone}
                  message={`Hello Ghana Homes, I found the profile of ${agent.name} and I'm interested in their properties.`}
                >
                  WhatsApp Ghana Homes
                </WhatsAppButton>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="border-t px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-ghana-primary" />
                <span>Ghana</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-ghana-primary" />
                <span>{ghanaHomesPhone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-ghana-primary" />
                <span>{ghanaHomesEmail}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Agent Properties */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Properties by {agent.name} ({agentProperties.length})
          </h2>
          
          {agentProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  imageUrl={property.images[0]}
                  propertyType={property.propertyType}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  isVerified={property.isVerified}
                  availability={property.availability}
                  agentId={agent.id}
                  agentName={agent.name}
                  agentImage={agent.profileImage}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p>No properties listed by this home owner yet.</p>
            </div>
          )}
        </div>
        
        {/* Agent Reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Reviews ({agent.reviews.length})
          </h2>
          
          {agent.reviews.length > 0 ? (
            <div className="space-y-4">
              {agent.reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  reviewer={review.reviewer}
                  date={review.date}
                  rating={review.rating}
                  comment={review.comment}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p>No reviews for this home owner yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AgentDetail;
