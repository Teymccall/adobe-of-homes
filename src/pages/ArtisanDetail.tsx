
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, BadgeCheck, Mail } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StarRating from '@/components/reviews/StarRating';
import ReviewCard from '@/components/reviews/ReviewCard';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { Separator } from '@/components/ui/separator';
import { getArtisanById } from '@/data/mockData';

const ArtisanDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const artisan = id ? getArtisanById(id) : undefined;
  
  // Ghana Homes official contact information
  const ghanaHomesPhone = "+233 20 123 4567";
  const ghanaHomesEmail = "contact@ghanahomes.com";
  
  if (!artisan) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Artisan Not Found</h1>
          <p>The artisan you are looking for does not exist or has been removed.</p>
          <Link to="/artisans" className="text-ghana-primary hover:underline mt-4 inline-block">
            Back to Artisans
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/artisans" className="text-ghana-primary hover:underline">
            &larr; Back to Artisans
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Artisan Header */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <img
                src={artisan.profileImage}
                alt={artisan.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">{artisan.name}</h1>
                  {artisan.isVerified && (
                    <BadgeCheck className="text-ghana-verified" size={24} />
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <MapPin size={16} />
                  <span>{artisan.location}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={artisan.averageRating} size={18} />
                  <span className="text-sm">
                    {artisan.averageRating.toFixed(1)} ({artisan.reviews.length} reviews)
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {artisan.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-ghana-background text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <p className="text-muted-foreground">{artisan.bio}</p>
              </div>
              
              <div className="flex flex-col space-y-2 md:w-auto w-full">
                <a 
                  href={`tel:${ghanaHomesPhone}`}
                  className="flex items-center gap-2 bg-ghana-primary text-white px-4 py-2 rounded-md hover:bg-ghana-primary/90 transition-colors"
                >
                  <Phone size={18} />
                  Call Ghana Homes
                </a>
                
                <a 
                  href={`mailto:${ghanaHomesEmail}?subject=Interest in Artisan: ${artisan.name}&body=Hello Ghana Homes, I found the profile of ${artisan.name} and I'm interested in their services.`}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-600/90 transition-colors"
                >
                  <Mail size={18} />
                  Email Ghana Homes
                </a>
                
                <WhatsAppButton 
                  phoneNumber={ghanaHomesPhone}
                  message={`Hello Ghana Homes, I found the profile of ${artisan.name} and I'm interested in their services.`}
                >
                  WhatsApp Ghana Homes
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
          <p className="font-medium mb-1">Ghana Homes Office</p>
          <p>Phone: {ghanaHomesPhone}</p>
          <p>Email: {ghanaHomesEmail}</p>
        </div>
        
        {/* Artisan Reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Reviews ({artisan.reviews.length})
          </h2>
          
          {artisan.reviews.length > 0 ? (
            <div className="space-y-4">
              {artisan.reviews.map((review) => (
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
              <p>No reviews for this artisan yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ArtisanDetail;
