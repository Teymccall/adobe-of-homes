import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Property, PropertyType, PropertyStatus, PropertyAvailability, VerificationStatus } from "@/data/types";

// Updated Property interface for Firebase
export interface FirebaseProperty extends Omit<Property, 'id' | 'createdAt' | 'verificationDate'> {
  id?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  verificationDate?: Timestamp | Date;
}

export interface PropertySearchFilters {
  location?: string;
  region?: string;
  town?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  isVerified?: boolean;
  status?: PropertyStatus;
  availability?: PropertyAvailability;
  homeOwnerId?: string;
}

class PropertyService {
  private collectionName = 'properties';

  // Create property
  async createProperty(propertyData: Omit<FirebaseProperty, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const property: Omit<FirebaseProperty, 'id'> = {
        ...propertyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Only set default values if not provided (allows admin to override)
        verificationStatus: propertyData.verificationStatus || 'unverified',
        isVerified: propertyData.isVerified ?? false,
        isFeatured: propertyData.isFeatured ?? false
      };

      const docRef = await addDoc(collection(db, this.collectionName), property);
      return docRef.id;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  // Get property by ID
  async getProperty(id: string): Promise<Property | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as FirebaseProperty;
        return this.convertFirebaseProperty(id, data);
      }

      return null;
    } catch (error) {
      console.error('Error getting property:', error);
      throw error;
    }
  }

  // Update property
  async updateProperty(id: string, updates: Partial<FirebaseProperty>): Promise<void> {
    try {
      const propertyRef = doc(db, this.collectionName, id);
      await updateDoc(propertyRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    try {
      const propertyRef = doc(db, this.collectionName, id);
      await deleteDoc(propertyRef);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  // Get all properties (simple method for components that need all properties)
  async getAllProperties(): Promise<Property[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as FirebaseProperty;
        return this.convertFirebaseProperty(doc.id, data);
      });
    } catch (error) {
      console.error('Error getting all properties:', error);
      throw error;
    }
  }

  // Get properties with pagination
  async getProperties(filters?: PropertySearchFilters, limitCount = 20, lastDoc?: QueryDocumentSnapshot<DocumentData>): Promise<{
    properties: Property[];
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
    hasMore: boolean;
  }> {
    try {
      let q = query(collection(db, this.collectionName));

      // Apply filters
      if (filters) {
        if (filters.location) {
          q = query(q, where('location', '>=', filters.location), where('location', '<=', filters.location + '\uf8ff'));
        }
        if (filters.region) {
          q = query(q, where('region', '==', filters.region));
        }
        if (filters.town) {
          q = query(q, where('town', '==', filters.town));
        }
        if (filters.propertyType) {
          q = query(q, where('propertyType', '==', filters.propertyType));
        }
        if (filters.status) {
          q = query(q, where('status', '==', filters.status));
        }
        if (filters.availability) {
          q = query(q, where('availability', '==', filters.availability));
        }
        if (filters.isVerified !== undefined) {
          q = query(q, where('isVerified', '==', filters.isVerified));
        }
        if (filters.homeOwnerId) {
          q = query(q, where('homeOwnerId', '==', filters.homeOwnerId));
        }
        if (filters.bedrooms) {
          q = query(q, where('bedrooms', '>=', filters.bedrooms));
        }
        if (filters.bathrooms) {
          q = query(q, where('bathrooms', '>=', filters.bathrooms));
        }
        if (filters.minPrice) {
          q = query(q, where('price', '>=', filters.minPrice));
        }
        if (filters.maxPrice) {
          q = query(q, where('price', '<=', filters.maxPrice));
        }
      }

      // Order by creation date (newest first)
      q = query(q, orderBy('createdAt', 'desc'));

      // Apply pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(limitCount + 1)); // Get one extra to check if there are more

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      const hasMore = docs.length > limitCount;

      // Remove the extra doc if exists
      if (hasMore) {
        docs.pop();
      }

      const properties = docs.map(doc => {
        const data = doc.data() as FirebaseProperty;
        return this.convertFirebaseProperty(doc.id, data);
      });

      const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : undefined;

      return {
        properties,
        lastDoc: newLastDoc,
        hasMore
      };
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  }

  // Get properties by home owner
  async getPropertiesByHomeOwner(homeOwnerId: string): Promise<Property[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('homeOwnerId', '==', homeOwnerId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as FirebaseProperty;
        return this.convertFirebaseProperty(doc.id, data);
      });
    } catch (error) {
      console.error('Error getting properties by home owner:', error);
      throw error;
    }
  }

  // Search properties by text
  async searchProperties(searchTerm: string, filters?: PropertySearchFilters): Promise<Property[]> {
    try {
      // Note: For full-text search, you might want to use Algolia or implement a search index
      // This is a basic search implementation
      const searchTermLower = searchTerm.toLowerCase();
      
      let q = query(collection(db, this.collectionName));
      
      // Apply filters first
      if (filters) {
        if (filters.propertyType) {
          q = query(q, where('propertyType', '==', filters.propertyType));
        }
        if (filters.status) {
          q = query(q, where('status', '==', filters.status));
        }
        if (filters.availability) {
          q = query(q, where('availability', '==', filters.availability));
        }
      }

      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirebaseProperty;
        return this.convertFirebaseProperty(doc.id, data);
      });

      // Filter by search term (client-side)
      return properties.filter(property => 
        property.title.toLowerCase().includes(searchTermLower) ||
        property.description.toLowerCase().includes(searchTermLower) ||
        property.location.toLowerCase().includes(searchTermLower) ||
        property.region?.toLowerCase().includes(searchTermLower) ||
        property.town?.toLowerCase().includes(searchTermLower)
      );
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  // Verify property
  async verifyProperty(id: string, verifiedBy: string): Promise<void> {
    try {
      await this.updateProperty(id, {
        isVerified: true,
        verificationStatus: 'verified' as VerificationStatus,
        verificationDate: serverTimestamp() as any,
        verifiedBy
      });
    } catch (error) {
      console.error('Error verifying property:', error);
      throw error;
    }
  }

  // Reject property verification
  async rejectPropertyVerification(id: string, verifiedBy: string): Promise<void> {
    try {
      await this.updateProperty(id, {
        isVerified: false,
        verificationStatus: 'rejected' as VerificationStatus,
        verificationDate: serverTimestamp() as any,
        verifiedBy
      });
    } catch (error) {
      console.error('Error rejecting property verification:', error);
      throw error;
    }
  }

  // Get featured properties
  async getFeaturedProperties(limitCount = 6): Promise<Property[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('isVerified', '==', true),
        where('availability', '==', 'available')
        // Temporarily removed orderBy to avoid index requirement
        // orderBy('createdAt', 'desc'),
        // limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirebaseProperty;
        return this.convertFirebaseProperty(doc.id, data);
      });
      
      // Filter featured, then sort and limit in memory to avoid index requirement
      return properties
        .filter(p => (p as any).isFeatured)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error getting featured properties:', error);
      throw error;
    }
  }

  // Listen to properties in real-time
  subscribeToProperties(callback: (properties: Property[]) => void, filters?: PropertySearchFilters) {
    let q = query(collection(db, this.collectionName));

    // Apply filters
    if (filters) {
      if (filters.homeOwnerId) {
        q = query(q, where('homeOwnerId', '==', filters.homeOwnerId));
      }
      if (filters.isVerified !== undefined) {
        q = query(q, where('isVerified', '==', filters.isVerified));
      }
    }

    q = query(q, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const properties = snapshot.docs.map(doc => {
        const data = doc.data() as FirebaseProperty;
        return this.convertFirebaseProperty(doc.id, data);
      });
      callback(properties);
    });
  }

  // Helper method to convert Firebase property to app property
  private convertFirebaseProperty(id: string, data: FirebaseProperty): Property {
    return {
      ...data,
      id,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      verificationDate: data.verificationDate instanceof Timestamp ? data.verificationDate.toDate() : data.verificationDate
    } as Property;
  }
}

export const propertyService = new PropertyService();
export default propertyService; 