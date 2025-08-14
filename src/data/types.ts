
export type PropertyType = 'apartment' | 'house' | 'townhouse' | 'land' | 'commercial';
export type PropertyStatus = 'available' | 'rented' | 'sold';
export type PropertyAvailability = 'available' | 'pending' | 'unavailable';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type HomeOwnerApplicationStatus = 'pending' | 'approved' | 'rejected';
export type ArtisanApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  region?: string;
  town?: string;
  price: number;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  images: string[];
  isVerified: boolean;
  homeOwnerId: string;
  createdAt: Date;
  status: PropertyStatus;
  availability: PropertyAvailability;
  ownerId?: string;
  verificationStatus: VerificationStatus;
  verificationDate?: Date;
  verifiedBy?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerIdType?: string;
  ownerIdNumber?: string;
  ownerAddress?: string;
  stayDuration?: string;
}

export interface HomeOwner {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  bio: string;
  profileImage: string;
  isVerified: boolean;
  yearsOfExperience: number;
  properties: string[];
  reviews: Review[];
  averageRating: number;
  verifiedProperties: string[];
  applicationStatus?: HomeOwnerApplicationStatus;
  applicationDate?: Date;
  region?: string;
  location?: string;
  idType?: string;
  idNumber?: string;
  idImageUrl?: string;
}

export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: Date;
  homeOwnerId?: string;
  artisanId?: string;
}

export interface Artisan {
  id: string;
  name: string;
  profileImage: string;
  skills: string[];
  location: string;
  phone: string;
  bio: string;
  isVerified: boolean;
  reviews: Review[];
  averageRating: number;
}

export interface SearchFilters {
  location: string;
  propertyType: string;
  priceRange: string;
  bedrooms: string;
  stayDuration: string;
}

export interface PropertyOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: string[];
}

export interface HomeOwnerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  region: string;
  idType: string;
  idNumber: string;
  about: string;
  profileImageUrl: string;
  idImageUrl: string;
  status: HomeOwnerApplicationStatus;
  submittedDate: string;
}

export interface ArtisanApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  about: string;
  profileImageUrl: string;
  idImageUrl: string;
  status: ArtisanApplicationStatus;
  submittedDate: string;
}

export interface TenantReport {
  id: string;
  tenantId: string;
  tenantName: string;
  reporterId: string;
  reporterName: string;
  reporterType: 'estate_manager' | 'home_owner';
  reportType: 'positive' | 'neutral' | 'negative';
  title: string;
  description: string;
  createdAt: Date;
  propertyId?: string;
  tags?: string[];
}
