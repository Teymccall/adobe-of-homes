import { cloudinaryService } from './cloudinaryService';
import { propertyService } from './propertyService';

export interface ScrapedProperty {
  title: string;
  price: number;
  currency: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  description?: string;
  images: string[];
  source: string;
  sourceUrl: string;
  scrapedAt: Date;
  isVerified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
}

export interface ScrapingJob {
  id: string;
  source: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  propertiesFound: number;
  propertiesImported: number;
  errors: string[];
}

class ScrapingService {
  private scrapingJobs: Map<string, ScrapingJob> = new Map();

  async scrapeProperties(source: string): Promise<ScrapedProperty[]> {
    const jobId = `job_${Date.now()}`;
    const job: ScrapingJob = {
      id: jobId,
      source,
      status: 'running',
      startedAt: new Date(),
      propertiesFound: 0,
      propertiesImported: 0,
      errors: []
    };

    this.scrapingJobs.set(jobId, job);

    try {
      console.log(`Starting scraping job for ${source}...`);
      
      // Simulate scraping different sources
      const scrapedData = await this.scrapeFromSource(source);
      
      // Process images through Cloudinary
      const processedData = await this.processImagesToCloudinary(scrapedData);
      
      job.status = 'completed';
      job.completedAt = new Date();
      job.propertiesFound = processedData.length;
      
      console.log(`Scraping completed: ${processedData.length} properties found`);
      
      return processedData;
    } catch (error) {
      job.status = 'failed';
      job.completedAt = new Date();
      job.errors.push(error instanceof Error ? error.message : 'Unknown error');
      
      console.error(`Scraping failed for ${source}:`, error);
      throw error;
    }
  }

  private async scrapeFromSource(source: string): Promise<ScrapedProperty[]> {
    // For now, we'll use mock data but structure it for real scraping
    // In production, you would implement actual web scraping here
    
    console.log(`Starting to scrape from ${source}...`);
    
    // Simulate scraping delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockProperties: ScrapedProperty[] = [
      {
        title: "Modern 3 Bedroom Apartment in East Legon",
        price: 2500,
        currency: "GHS",
        location: "East Legon, Accra",
        coordinates: { lat: 5.6037, lng: -0.1870 },
        bedrooms: 3,
        bathrooms: 2,
        area: "120 sqm",
        description: "Beautiful modern apartment with all amenities. Close to shopping centers and schools.",
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
          "https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800"
        ],
        source: source,
        sourceUrl: `https://${source}.com/property/1`,
        scrapedAt: new Date(),
        isVerified: false,
        verificationStatus: 'unverified'
      },
      {
        title: "Luxury 2 Bedroom Condo in Airport Residential",
        price: 1800,
        currency: "GHS",
        location: "Airport Residential, Accra",
        coordinates: { lat: 5.6037, lng: -0.1870 },
        bedrooms: 2,
        bathrooms: 1,
        area: "85 sqm",
        description: "Spacious condo with modern finishes and great location.",
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800"
        ],
        source: source,
        sourceUrl: `https://${source}.com/property/2`,
        scrapedAt: new Date(),
        isVerified: false,
        verificationStatus: 'unverified'
      },
      {
        title: "Family Home in Cantonments",
        price: 3500,
        currency: "GHS",
        location: "Cantonments, Accra",
        coordinates: { lat: 5.6037, lng: -0.1870 },
        bedrooms: 4,
        bathrooms: 3,
        area: "200 sqm",
        description: "Large family home with garden and parking space.",
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
          "https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800",
          "https://images.unsplash.com/photo-1560448204-6b3b3b3b3b3b?w=800"
        ],
        source: source,
        sourceUrl: `https://${source}.com/property/3`,
        scrapedAt: new Date(),
        isVerified: false,
        verificationStatus: 'unverified'
      },
      {
        title: "Studio Apartment in Osu",
        price: 1200,
        currency: "GHS",
        location: "Osu, Accra",
        coordinates: { lat: 5.6037, lng: -0.1870 },
        bedrooms: 1,
        bathrooms: 1,
        area: "45 sqm",
        description: "Cozy studio apartment in the heart of Osu. Perfect for young professionals.",
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800"
        ],
        source: source,
        sourceUrl: `https://${source}.com/property/4`,
        scrapedAt: new Date(),
        isVerified: false,
        verificationStatus: 'unverified'
      },
      {
        title: "Penthouse in Ridge",
        price: 5000,
        currency: "GHS",
        location: "Ridge, Accra",
        coordinates: { lat: 5.6037, lng: -0.1870 },
        bedrooms: 3,
        bathrooms: 2,
        area: "180 sqm",
        description: "Luxury penthouse with city views and premium amenities.",
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
          "https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800"
        ],
        source: source,
        sourceUrl: `https://${source}.com/property/5`,
        scrapedAt: new Date(),
        isVerified: false,
        verificationStatus: 'unverified'
      }
    ];

    console.log(`Scraped ${mockProperties.length} properties from ${source}`);
    return mockProperties;
  }

  private async processImagesToCloudinary(properties: ScrapedProperty[]): Promise<ScrapedProperty[]> {
    const processedProperties = [];

    for (const property of properties) {
      try {
        const cloudinaryUrls = [];
        
        for (const imageUrl of property.images) {
          try {
            // Upload image to Cloudinary
            const cloudinaryUrl = await this.uploadImageToCloudinary(imageUrl);
            cloudinaryUrls.push(cloudinaryUrl);
          } catch (error) {
            console.error(`Failed to upload image to Cloudinary: ${imageUrl}`, error);
            // Keep original URL if Cloudinary upload fails
            cloudinaryUrls.push(imageUrl);
          }
        }
        
        processedProperties.push({
          ...property,
          images: cloudinaryUrls
        });
      } catch (error) {
        console.error(`Failed to process property: ${property.title}`, error);
        // Add property without processed images
        processedProperties.push(property);
      }
    }

    return processedProperties;
  }

  private async uploadImageToCloudinary(imageUrl: string): Promise<string> {
    try {
      // Download image from URL
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      
      // Convert to base64
      const base64 = await this.blobToBase64(imageBlob);
      
      // Upload to Cloudinary using existing service
      const formData = new FormData();
      formData.append('file', base64);
      formData.append('upload_preset', 'adobe_of_homes_upload');
      formData.append('folder', 'properties');
      
      const uploadResponse = await fetch(
        'https://api.cloudinary.com/v1_1/dfrrgzgzu/upload',
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (!uploadResponse.ok) {
        throw new Error(`Cloudinary upload failed: ${uploadResponse.statusText}`);
      }
      
      const result = await uploadResponse.json();
      return result.secure_url;
    } catch (error) {
      console.error('Failed to upload image to Cloudinary:', error);
      throw error;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async importPropertiesToDatabase(properties: ScrapedProperty[]): Promise<string[]> {
    const importedIds = [];
    
    for (const property of properties) {
      try {
        // Convert scraped property to database format
        const propertyData = {
          title: property.title,
          price: property.price,
          currency: property.currency,
          location: property.location,
          coordinates: property.coordinates,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          description: property.description,
          images: property.images,
          availability: 'available',
          isVerified: false,
          verificationStatus: 'unverified',
          source: property.source,
          sourceUrl: property.sourceUrl,
          scrapedAt: property.scrapedAt,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const propertyId = await propertyService.createProperty(propertyData);
        importedIds.push(propertyId);
        
        console.log(`Imported property: ${property.title} with ID: ${propertyId}`);
      } catch (error) {
        console.error(`Failed to import property: ${property.title}`, error);
      }
    }
    
    return importedIds;
  }

  getScrapingJobs(): ScrapingJob[] {
    return Array.from(this.scrapingJobs.values());
  }

  getScrapingJob(jobId: string): ScrapingJob | undefined {
    return this.scrapingJobs.get(jobId);
  }
}

export const scrapingService = new ScrapingService(); 