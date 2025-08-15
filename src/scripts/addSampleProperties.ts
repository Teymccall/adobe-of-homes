import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Sample properties data
const sampleProperties = [
  {
    title: "Modern 3-Bedroom Apartment in East Legon",
    description: "Beautiful modern apartment with stunning city views, fully furnished with premium amenities.",
    location: "East Legon, Accra",
    region: "Greater Accra",
    town: "Accra",
    price: 2500,
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    features: ["Fully Furnished", "Air Conditioning", "Balcony", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop"
    ],
    isVerified: true,
    isFeatured: true,
    homeOwnerId: "sample_owner_1",
    status: "available",
    availability: "available",
    verificationStatus: "verified",
    verificationDate: serverTimestamp(),
    verifiedBy: "admin_user",
    ownerName: "John Doe",
    ownerPhone: "+233 20 123 4567",
    ownerEmail: "john.doe@example.com",
    stayDuration: "long_term"
  },
  {
    title: "Luxury 4-Bedroom House in Trasacco Valley",
    description: "Spacious family home with garden, swimming pool, and modern kitchen. Perfect for families.",
    location: "Trasacco Valley, Accra",
    region: "Greater Accra",
    town: "Accra",
    price: 4500,
    propertyType: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    features: ["Swimming Pool", "Garden", "Modern Kitchen", "Security", "Parking", "Servant Quarters"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    isVerified: true,
    isFeatured: true,
    homeOwnerId: "sample_owner_2",
    status: "available",
    availability: "available",
    verificationStatus: "verified",
    verificationDate: serverTimestamp(),
    verifiedBy: "admin_user",
    ownerName: "Sarah Johnson",
    ownerPhone: "+233 24 987 6543",
    ownerEmail: "sarah.johnson@example.com",
    stayDuration: "long_term"
  },
  {
    title: "Cozy 2-Bedroom Townhouse in Cantonments",
    description: "Charming townhouse with modern amenities, close to shopping centers and restaurants.",
    location: "Cantonments, Accra",
    region: "Greater Accra",
    town: "Accra",
    price: 1800,
    propertyType: "townhouse",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    features: ["Modern Kitchen", "Balcony", "Security", "Parking", "Close to Amenities"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop"
    ],
    isVerified: true,
    isFeatured: false,
    homeOwnerId: "sample_owner_3",
    status: "available",
    availability: "available",
    verificationStatus: "verified",
    verificationDate: serverTimestamp(),
    verifiedBy: "admin_user",
    ownerName: "Michael Chen",
    ownerPhone: "+233 26 555 1234",
    ownerEmail: "michael.chen@example.com",
    stayDuration: "short_term"
  },
  {
    title: "Studio Apartment in Osu",
    description: "Perfect starter apartment in the heart of Osu, close to nightlife and restaurants.",
    location: "Osu, Accra",
    region: "Greater Accra",
    town: "Accra",
    price: 1200,
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    features: ["Fully Furnished", "Air Conditioning", "Security", "Close to Nightlife"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop"
    ],
    isVerified: true,
    isFeatured: false,
    homeOwnerId: "sample_owner_4",
    status: "available",
    availability: "available",
    verificationStatus: "verified",
    verificationDate: serverTimestamp(),
    verifiedBy: "admin_user",
    ownerName: "Lisa Wang",
    ownerPhone: "+233 27 777 8888",
    ownerEmail: "lisa.wang@example.com",
    stayDuration: "short_term"
  }
];

async function addSampleProperties() {
  try {
    console.log('🚀 Starting to add sample properties...');
    
    const propertiesCollection = collection(db, 'properties');
    
    for (const property of sampleProperties) {
      const docRef = await addDoc(propertiesCollection, {
        ...property,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`✅ Added property: ${property.title} with ID: ${docRef.id}`);
    }
    
    console.log('🎉 Successfully added all sample properties!');
    console.log('📊 Total properties added:', sampleProperties.length);
    
  } catch (error) {
    console.error('❌ Error adding sample properties:', error);
  }
}

// Export for use in other files
export { addSampleProperties };

// If running directly
if (typeof window === 'undefined') {
  addSampleProperties();
}
