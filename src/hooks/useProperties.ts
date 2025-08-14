import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { propertyService, PropertySearchFilters, FirebaseProperty } from '@/services/propertyService';
import { Property } from '@/data/types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

// Query keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertySearchFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  featured: () => [...propertyKeys.all, 'featured'] as const,
  search: (term: string, filters?: PropertySearchFilters) => [...propertyKeys.all, 'search', term, filters] as const,
  byOwner: (ownerId: string) => [...propertyKeys.all, 'byOwner', ownerId] as const,
};

// Get single property
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyService.getProperty(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get properties with filters and pagination
export const useProperties = (filters?: PropertySearchFilters, limitCount = 20) => {
  return useInfiniteQuery({
    queryKey: propertyKeys.list(filters || {}),
    queryFn: ({ pageParam }) => propertyService.getProperties(filters, limitCount, pageParam),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDoc : undefined,
    initialPageParam: undefined as QueryDocumentSnapshot<DocumentData> | undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get featured properties
export const useFeaturedProperties = (limitCount = 6) => {
  return useQuery({
    queryKey: propertyKeys.featured(),
    queryFn: () => propertyService.getFeaturedProperties(limitCount),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search properties
export const useSearchProperties = (searchTerm: string, filters?: PropertySearchFilters) => {
  return useQuery({
    queryKey: propertyKeys.search(searchTerm, filters),
    queryFn: () => propertyService.searchProperties(searchTerm, filters),
    enabled: !!searchTerm.trim(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get properties by home owner
export const usePropertiesByOwner = (ownerId: string) => {
  return useQuery({
    queryKey: propertyKeys.byOwner(ownerId),
    queryFn: () => propertyService.getPropertiesByHomeOwner(ownerId),
    enabled: !!ownerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create property mutation
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (propertyData: Omit<FirebaseProperty, 'id' | 'createdAt' | 'updatedAt'>) => 
      propertyService.createProperty(propertyData),
    onSuccess: () => {
      // Invalidate and refetch property lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.featured() });
      
      // Invalidate user's properties if available
      if (user) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.byOwner(user.uid) });
      }
    },
  });
};

// Update property mutation
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FirebaseProperty> }) =>
      propertyService.updateProperty(id, updates),
    onSuccess: (_, { id }) => {
      // Invalidate specific property
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      // Invalidate all property lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.featured() });
    },
  });
};

// Delete property mutation
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: propertyKeys.detail(id) });
      // Invalidate all property lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.featured() });
    },
  });
};

// Verify property mutation
export const useVerifyProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, verifiedBy }: { id: string; verifiedBy: string }) =>
      propertyService.verifyProperty(id, verifiedBy),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.featured() });
    },
  });
};

// Reject property verification mutation
export const useRejectPropertyVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, verifiedBy }: { id: string; verifiedBy: string }) =>
      propertyService.rejectPropertyVerification(id, verifiedBy),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.featured() });
    },
  });
};

// Real-time properties hook
export const useRealTimeProperties = (filters?: PropertySearchFilters) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = propertyService.subscribeToProperties(
      (newProperties) => {
        setProperties(newProperties);
        setLoading(false);
      },
      filters
    );

    return () => {
      unsubscribe();
    };
  }, [filters]);

  return { properties, loading, error };
};

// Property statistics hook
export const usePropertyStats = (ownerId?: string) => {
  const { data: properties, isLoading } = usePropertiesByOwner(ownerId || '');

  const stats = {
    total: properties?.length || 0,
    verified: properties?.filter(p => p.isVerified).length || 0,
    available: properties?.filter(p => p.availability === 'available').length || 0,
    rented: properties?.filter(p => p.status === 'rented').length || 0,
    pending: properties?.filter(p => p.verificationStatus === 'pending').length || 0,
  };

  return { stats, isLoading };
};

// Search with debounce hook
export const useDebouncedSearch = (searchTerm: string, filters?: PropertySearchFilters, delay = 500) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return useSearchProperties(debouncedTerm, filters);
}; 