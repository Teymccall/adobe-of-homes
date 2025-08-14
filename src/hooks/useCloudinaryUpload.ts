import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  cloudinaryService, 
  CloudinaryUploadResult, 
  CloudinaryUploadProgress,
  UploadOptions 
} from '@/services/cloudinaryService';
import { useAuth } from '@/context/AuthContext';

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  results: CloudinaryUploadResult[];
}

export const useCloudinaryUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    results: []
  });

  const resetState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      results: []
    });
  }, []);

  // Single file upload
  const uploadSingle = useMutation({
    mutationFn: async ({ 
      file, 
      options 
    }: { 
      file: File; 
      options?: UploadOptions 
    }) => {
      setUploadState(prev => ({ ...prev, isUploading: true, error: null }));
      
      const result = await cloudinaryService.uploadFile(file, {
        ...options,
        onProgress: (progress) => {
          setUploadState(prev => ({ ...prev, progress: progress.progress }));
        }
      });
      
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        results: [result],
        progress: 100 
      }));
      
      return result;
    },
    onError: (error: Error) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message 
      }));
    }
  });

  // Multiple files upload
  const uploadMultiple = useMutation({
    mutationFn: async ({ 
      files, 
      options 
    }: { 
      files: File[]; 
      options?: UploadOptions 
    }) => {
      setUploadState(prev => ({ ...prev, isUploading: true, error: null }));
      
      const results = await cloudinaryService.uploadMultipleFiles(
        files,
        options,
        (fileIndex, progress) => {
          // Individual file progress can be tracked here if needed
        },
        (overallProgress) => {
          setUploadState(prev => ({ ...prev, progress: overallProgress }));
        }
      );
      
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        results,
        progress: 100 
      }));
      
      return results;
    },
    onError: (error: Error) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message 
      }));
    }
  });

  return {
    uploadState,
    uploadSingle: uploadSingle.mutateAsync,
    uploadMultiple: uploadMultiple.mutateAsync,
    isUploading: uploadSingle.isPending || uploadMultiple.isPending,
    resetState
  };
};

// Specialized hook for property images
export const usePropertyImageUpload = () => {
  const { user } = useAuth();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    results: []
  });

  const uploadPropertyImages = useMutation({
    mutationFn: async ({ 
      files, 
      propertyId 
    }: { 
      files: File[]; 
      propertyId: string 
    }) => {
      if (!user) throw new Error('User must be authenticated');
      
      setUploadState(prev => ({ ...prev, isUploading: true, error: null }));
      
      const results = await cloudinaryService.uploadPropertyImages(
        files,
        propertyId,
        (fileIndex, progress) => {
          setUploadState(prev => ({ 
            ...prev, 
            progress: ((fileIndex / files.length) * 100) + (progress.progress / files.length)
          }));
        }
      );
      
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        results,
        progress: 100 
      }));
      
      return results;
    },
    onError: (error: Error) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message 
      }));
    }
  });

  return {
    uploadState,
    uploadPropertyImages: uploadPropertyImages.mutateAsync,
    isUploading: uploadPropertyImages.isPending,
    resetState: () => setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      results: []
    })
  };
};

// Specialized hook for profile image upload
export const useProfileImageUpload = () => {
  const { user, userProfile } = useAuth();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    results: []
  });

  const uploadProfileImage = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      if (!user || !userProfile) throw new Error('User must be authenticated');
      
      setUploadState(prev => ({ ...prev, isUploading: true, error: null }));
      
      const result = await cloudinaryService.uploadProfileImage(
        file,
        user.uid,
        userProfile.role,
        (progress) => {
          setUploadState(prev => ({ ...prev, progress: progress.progress }));
        }
      );
      
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        results: [result],
        progress: 100 
      }));
      
      return result;
    },
    onError: (error: Error) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message 
      }));
    }
  });

  return {
    uploadState,
    uploadProfileImage: uploadProfileImage.mutateAsync,
    isUploading: uploadProfileImage.isPending,
    resetState: () => setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      results: []
    })
  };
};

// Specialized hook for document upload
export const useDocumentUpload = () => {
  const { user } = useAuth();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    results: []
  });

  const uploadDocument = useMutation({
    mutationFn: async ({ 
      file, 
      documentType 
    }: { 
      file: File; 
      documentType: 'id_front' | 'id_back' | 'passport' | 'license' 
    }) => {
      if (!user) throw new Error('User must be authenticated');
      
      setUploadState(prev => ({ ...prev, isUploading: true, error: null }));
      
      const result = await cloudinaryService.uploadIdDocument(
        file,
        user.uid,
        documentType,
        (progress) => {
          setUploadState(prev => ({ ...prev, progress: progress.progress }));
        }
      );
      
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        results: [result],
        progress: 100 
      }));
      
      return result;
    },
    onError: (error: Error) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message 
      }));
    }
  });

  return {
    uploadState,
    uploadDocument: uploadDocument.mutateAsync,
    isUploading: uploadDocument.isPending,
    resetState: () => setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      results: []
    })
  };
};

// Hook for artisan portfolio uploads
export const useArtisanWorkUpload = () => {
  const { user } = useAuth();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    results: []
  });

  const uploadArtisanWork = useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      if (!user) throw new Error('User must be authenticated');
      
      setUploadState(prev => ({ ...prev, isUploading: true, error: null }));
      
      const results = await cloudinaryService.uploadArtisanWork(
        files,
        user.uid,
        (fileIndex, progress) => {
          setUploadState(prev => ({ 
            ...prev, 
            progress: ((fileIndex / files.length) * 100) + (progress.progress / files.length)
          }));
        }
      );
      
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        results,
        progress: 100 
      }));
      
      return results;
    },
    onError: (error: Error) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message 
      }));
    }
  });

  return {
    uploadState,
    uploadArtisanWork: uploadArtisanWork.mutateAsync,
    isUploading: uploadArtisanWork.isPending,
    resetState: () => setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      results: []
    })
  };
}; 