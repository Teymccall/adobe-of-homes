import { Property, HomeOwner, Artisan, Review, VerificationStatus } from './types';

// Generate mock reviews
const generateReviews = (count: number, entityId: string, isHomeOwner: boolean): Review[] => {
  const reviews: Review[] = [];
  
  for (let i = 0; i < count; i++) {
    const rating = Math.floor(Math.random() * 3) + 3; // Ratings between 3-5
    reviews.push({
      id: `review-${entityId}-${i}`,
      reviewer: `User ${Math.floor(Math.random() * 1000)}`,
      rating,
      comment: [
        "Great experience working with them!",
        "Very professional and responsive.",
        "Helped me find the perfect place.",
        "Good service but could be more prompt.",
        "Highly recommend their services!"
      ][Math.floor(Math.random() * 5)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      ...(isHomeOwner ? { homeOwnerId: entityId } : { artisanId: entityId })
    });
  }
  
  return reviews;
};

// Generate average rating
const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

// Mock Home Owners (previously Agents)
export const mockAgents: HomeOwner[] = [
  {
    id: 'agent1',
    name: 'Kofi Mensah',
    company: 'Ghana Realty',
    phone: '+233201234567',
    email: 'kofi@ghanarealty.com',
    bio: 'Real estate agent with 5+ years of experience in Accra property market.',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    isVerified: true,
    yearsOfExperience: 5,
    properties: ['prop1', 'prop2', 'prop3'],
    reviews: [],
    averageRating: 0,
    verifiedProperties: ['prop1', 'prop2']
  },
  {
    id: 'agent2',
    name: 'Ama Darko',
    company: 'HomeFinderGH',
    phone: '+233207654321',
    email: 'ama@homefindergh.com',
    bio: 'Specializing in luxury properties across Ghana.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    isVerified: true,
    yearsOfExperience: 7,
    properties: ['prop4', 'prop5'],
    reviews: [],
    averageRating: 0,
    verifiedProperties: ['prop4', 'prop5']
  },
  {
    id: 'agent3',
    name: 'Kwame Boateng',
    company: 'Accra Properties',
    phone: '+233244555666',
    email: 'kwame@accraproperties.com',
    bio: 'Helping families find their dream homes in Ghana for over 8 years.',
    profileImage: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf',
    isVerified: false,
    yearsOfExperience: 8,
    properties: ['prop6'],
    reviews: [],
    averageRating: 0,
    verifiedProperties: []
  },
  {
    id: 'agent4',
    name: 'Gifty Ansah',
    company: 'GreenView Estates',
    phone: '+233277889900',
    email: 'gifty@greenview.com',
    bio: 'Residential and commercial property expert in Kumasi region.',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    isVerified: true,
    yearsOfExperience: 4,
    properties: ['prop7', 'prop8'],
    reviews: [],
    averageRating: 0,
    verifiedProperties: ['prop7', 'prop8']
  },
];

// Add reviews to home owners
mockAgents.forEach(homeOwner => {
  homeOwner.reviews = generateReviews(Math.floor(Math.random() * 6) + 1, homeOwner.id, true);
  homeOwner.averageRating = calculateAverageRating(homeOwner.reviews);
});

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: 'prop1',
    title: '3 Bedroom Apartment in East Legon',
    description: 'Beautiful 3 bedroom apartment in East Legon with modern amenities including swimming pool, gym, and 24/7 security.',
    location: 'East Legon, Accra',
    price: 2500,
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    features: ['Swimming Pool', 'Security', 'Balcony', 'Air Conditioning', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
    ],
    isVerified: true,
    homeOwnerId: 'agent1',
    createdAt: new Date('2023-10-15'),
    status: 'available',
    availability: 'available',
    verificationStatus: 'verified',
    verificationDate: new Date('2023-10-17'),
    verifiedBy: 'agent1'
  },
  {
    id: 'prop2',
    title: 'Modern 2 Bedroom House in Cantonments',
    description: 'Newly built 2 bedroom house in the prestigious Cantonments area. Features a spacious garden and modern interior design.',
    location: 'Cantonments, Accra',
    price: 3200,
    propertyType: 'house',
    bedrooms: 2,
    bathrooms: 2.5,
    area: 150,
    features: ['Garden', 'Modern Kitchen', 'Security', 'Backup Generator', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8'
    ],
    isVerified: true,
    homeOwnerId: 'agent1',
    createdAt: new Date('2023-11-05'),
    status: 'available',
    availability: 'pending',
    verificationStatus: 'verified',
    verificationDate: new Date('2023-11-07'),
    verifiedBy: 'agent1'
  },
  {
    id: 'prop3',
    title: '1 Bedroom Studio in Osu',
    description: 'Cozy 1 bedroom studio apartment in the vibrant Osu neighborhood. Walking distance to restaurants and shops.',
    location: 'Osu, Accra',
    price: 850,
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 60,
    features: ['Furnished', 'Cable TV', 'Internet', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1',
      'https://images.unsplash.com/photo-1551361999-b9238c597b46',
      'https://images.unsplash.com/photo-1527853787696-f7be74f2e39a'
    ],
    isVerified: true,
    homeOwnerId: 'agent1',
    createdAt: new Date('2023-12-01'),
    status: 'available' ,
    availability: 'available',
    verificationStatus: 'verified',
    verificationDate: new Date('2023-12-02'),
    verifiedBy: 'agent1'
  },
  {
    id: 'prop4',
    title: 'Luxury 4 Bedroom Villa in Airport Residential',
    description: 'Exclusive 4 bedroom villa in Airport Residential with high-end finishes, swimming pool, and expansive garden.',
    location: 'Airport Residential, Accra',
    price: 5000,
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 4,
    area: 300,
    features: ['Swimming Pool', 'Garden', 'Security', 'Maid\'s Quarters', 'Backup Generator', 'Smart Home'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      'https://images.unsplash.com/photo-1600607687644-c7f34d576587'
    ],
    isVerified: true,
    homeOwnerId: 'agent2',
    createdAt: new Date('2023-09-20'),
    status: 'available',
    availability: 'unavailable',
    verificationStatus: 'verified',
    verificationDate: new Date('2023-09-22'),
    verifiedBy: 'agent2'
  },
  {
    id: 'prop5',
    title: '3 Bedroom Townhouse in Tema Community 20',
    description: 'Beautiful 3 bedroom townhouse in a gated community with shared amenities including swimming pool and children\'s play area.',
    location: 'Tema Community 20',
    price: 1800,
    propertyType: 'townhouse',
    bedrooms: 3,
    bathrooms: 2,
    area: 165,
    features: ['Gated Community', 'Swimming Pool', 'Children\'s Playground', 'Security', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126',
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a'
    ],
    isVerified: true,
    homeOwnerId: 'agent2',
    createdAt: new Date('2023-10-30'),
    status: 'available',
    availability: 'available',
    verificationStatus: 'verified',
    verificationDate: new Date('2023-11-01'),
    verifiedBy: 'agent2'
  },
  {
    id: 'prop6',
    title: 'Commercial Space in Adabraka',
    description: 'Prime commercial space located in the busy Adabraka business district. Perfect for office or retail use.',
    location: 'Adabraka, Accra',
    price: 1500,
    propertyType: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    area: 80,
    features: ['Central Location', 'High Foot Traffic', 'Backup Generator', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1497215842964-222b430dc094',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174'
    ],
    isVerified: false,
    homeOwnerId: 'agent3',
    createdAt: new Date('2023-11-15'),
    status: 'available',
    availability: 'pending',
    verificationStatus: 'pending',
    ownerId: 'owner1'
  },
  {
    id: 'prop7',
    title: '2 Bedroom Apartment in Kumasi',
    description: 'Comfortable 2 bedroom apartment in a peaceful neighborhood in Kumasi. Fully furnished with modern amenities.',
    location: 'Ahodwo, Kumasi',
    price: 1200,
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    features: ['Furnished', 'Backup Water', 'Security', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb',
      'https://images.unsplash.com/photo-1556912167-f556f1f39fdf'
    ],
    isVerified: true,
    homeOwnerId: 'agent4',
    createdAt: new Date('2023-12-10'),
    status: 'available',
    availability: 'available',
    verificationStatus: 'verified',
    verificationDate: new Date('2023-12-12'),
    verifiedBy: 'agent4'
  },
  {
    id: 'prop8',
    title: 'Land for Sale in Kasoa',
    description: 'Prime residential land for sale in fast-developing Kasoa area. Clear title and ready for development.',
    location: 'Kasoa',
    price: 45000,
    propertyType: 'land',
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    features: ['Residential Zoning', 'Clear Title', 'Accessible Location'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      'https://images.unsplash.com/photo-1635428335839-424d055a1c0e'
    ],
    isVerified: true,
    homeOwnerId: 'agent4',
    createdAt: new Date('2023-08-25'),
    status: 'available',
    availability: 'available',
    verificationStatus: 'verified',
    verificationDate: new Date('2023-08-27'),
    verifiedBy: 'agent4'
  },
];

// Mock Artisans
export const mockArtisans: Artisan[] = [
  {
    id: 'artisan1',
    name: 'Emmanuel Adjei',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    skills: ['Plumbing', 'Pipe Fitting'],
    location: 'Accra',
    phone: '+233501234567',
    bio: 'Professional plumber with 10+ years experience in residential and commercial plumbing.',
    isVerified: true,
    reviews: [],
    averageRating: 0
  },
  {
    id: 'artisan2',
    name: 'Abena Mintah',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    skills: ['Electrical Installations', 'Wiring'],
    location: 'Tema',
    phone: '+233207889900',
    bio: 'Certified electrician specializing in home electrical systems and troubleshooting.',
    isVerified: true,
    reviews: [],
    averageRating: 0
  },
  {
    id: 'artisan3',
    name: 'Kwesi Appiah',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    skills: ['Carpentry', 'Furniture Making', 'Cabinet Installation'],
    location: 'Kumasi',
    phone: '+233244112233',
    bio: 'Master carpenter with a passion for quality woodworking and furniture design.',
    isVerified: true,
    reviews: [],
    averageRating: 0
  },
  {
    id: 'artisan4',
    name: 'Daniel Owusu',
    profileImage: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
    skills: ['Painting', 'Wall Finishing', 'Decoration'],
    location: 'Accra',
    phone: '+233277334455',
    bio: 'Professional painter offering interior and exterior painting services.',
    isVerified: false,
    reviews: [],
    averageRating: 0
  },
  {
    id: 'artisan5',
    name: 'Faustina Mensah',
    profileImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
    skills: ['Tiling', 'Bathroom Installation'],
    location: 'Accra',
    phone: '+233245566778',
    bio: 'Specializing in bathroom and kitchen tiling with attention to detail.',
    isVerified: true,
    reviews: [],
    averageRating: 0
  },
  {
    id: 'artisan6',
    name: 'Joseph Amoah',
    profileImage: 'https://images.unsplash.com/photo-1504593811423-6dd665756598',
    skills: ['Air Conditioning', 'Refrigeration Repair'],
    location: 'Tema',
    phone: '+233209988776',
    bio: 'HVAC technician with expertise in installation and repair of all AC units.',
    isVerified: true,
    reviews: [],
    averageRating: 0
  },
];

// Add reviews to artisans
mockArtisans.forEach(artisan => {
  artisan.reviews = generateReviews(Math.floor(Math.random() * 8) + 2, artisan.id, false);
  artisan.averageRating = calculateAverageRating(artisan.reviews);
});

// Utility function to get properties by home owner ID
export const getPropertiesByAgentId = (homeOwnerId: string): Property[] => {
  return mockProperties.filter(property => property.homeOwnerId === homeOwnerId);
};

// Utility function to get home owner by ID
export const getAgentById = (homeOwnerId: string): HomeOwner | undefined => {
  return mockAgents.find(homeOwner => homeOwner.id === homeOwnerId);
};

// Utility function to get artisan by ID
export const getArtisanById = (artisanId: string): Artisan | undefined => {
  return mockArtisans.find(artisan => artisan.id === artisanId);
};

// Utility function to get property by ID
export const getPropertyById = (propertyId: string): Property | undefined => {
  return mockProperties.find(property => property.id === propertyId);
};

// Add function to update property availability based on status
export const updatePropertyAvailability = (propertyId: string, newAvailability: 'available' | 'pending' | 'unavailable') => {
  const propertyIndex = mockProperties.findIndex(p => p.id === propertyId);
  if (propertyIndex !== -1) {
    mockProperties[propertyIndex].availability = newAvailability;
    
    // If property is unavailable, update its status accordingly
    if (newAvailability === 'unavailable') {
      if (mockProperties[propertyIndex].propertyType === 'apartment' || 
          mockProperties[propertyIndex].propertyType === 'house' || 
          mockProperties[propertyIndex].propertyType === 'townhouse') {
        mockProperties[propertyIndex].status = 'rented';
      } else {
        mockProperties[propertyIndex].status = 'sold';
      }
    }
    
    return true;
  }
  return false;
};
