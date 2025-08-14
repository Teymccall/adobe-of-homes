
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  // Filter out empty or invalid images
  const validImages = images?.filter(img => img && img.trim() !== '') || [];
  
  // If no valid images, show placeholder
  if (validImages.length === 0) {
    return (
      <div className="mb-8">
        <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🏠</div>
            <p>No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Carousel className="w-full">
        <CarouselContent>
          {validImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-[16/9] overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default PropertyGallery;
