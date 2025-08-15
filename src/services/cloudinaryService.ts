import { 
  getCloudinaryUploadUrl, 
  generateSignature, 
  getOptimizedImageUrl, 
  getDocumentUrl,
  CLOUDINARY_CONFIG
} from '@/lib/cloudinary';

export type UploadResourceType = 'image' | 'raw' | 'video' | 'auto';
export type UploadFolder = 'properties' | 'profiles' | 'documents' | 'artisans';

export interface CloudinaryUploadProgress {
  progress: number;
  total: number;
  loaded: number;
}

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  url: string;
  width?: number;
  height?: number;
  format: string;
  resourceType: string;
  folder?: string;
  originalFilename: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: UploadFolder;
  resourceType?: UploadResourceType;
  transformation?: string;
  tags?: string[];
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  eager?: string[];
  onProgress?: (progress: CloudinaryUploadProgress) => void;
}

class CloudinaryService {
  private uploadUrl = getCloudinaryUploadUrl();

  // Upload single file to Cloudinary
  async uploadFile(file: File, options: UploadOptions = {}): Promise<CloudinaryUploadResult> {
    try {
      const {
        folder,
        resourceType = 'auto',
        transformation,
        tags = [],
        quality,
        format,
        eager = [],
        onProgress
      } = options;

      // Validate file
      this.validateFile(file, resourceType);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
      
      if (folder) {
        formData.append('folder', folder);
      }
      
      if (resourceType !== 'auto') {
        formData.append('resource_type', resourceType);
      }
      
      if (transformation) {
        formData.append('transformation', transformation);
      }
      
      if (tags.length > 0) {
        formData.append('tags', tags.join(','));
      }
      
      if (quality) {
        formData.append('quality', quality.toString());
      }
      
      if (format && format !== 'auto') {
        formData.append('format', format);
      }
      
      if (eager.length > 0) {
        formData.append('eager', eager.join('|'));
      }

      // Add timestamp for cache busting
      formData.append('timestamp', Date.now().toString());

      // Log form data for debugging
      console.log('Cloudinary upload form data:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Create XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              onProgress({
                progress: (event.loaded / event.total) * 100,
                total: event.total,
                loaded: event.loaded
              });
            }
          });
        }

        xhr.addEventListener('load', () => {
          console.log('Cloudinary response status:', xhr.status);
          console.log('Cloudinary response:', xhr.responseText);
          
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(this.formatUploadResult(result));
            } catch (error) {
              console.error('Failed to parse Cloudinary response:', error);
              reject(new Error('Failed to parse upload response'));
            }
          } else {
            let errorMessage = `Upload failed with status: ${xhr.status}`;
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              if (errorResponse.error && errorResponse.error.message) {
                errorMessage = `Cloudinary Error: ${errorResponse.error.message}`;
              }
            } catch (parseError) {
              // Use default error message
            }
            console.error('Cloudinary upload failed:', errorMessage);
            reject(new Error(errorMessage));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.open('POST', this.uploadUrl);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {},
    onFileProgress?: (fileIndex: number, progress: CloudinaryUploadProgress) => void,
    onOverallProgress?: (overallProgress: number) => void
  ): Promise<CloudinaryUploadResult[]> {
    const results: CloudinaryUploadResult[] = [];
    const totalFiles = files.length;
    let completedFiles = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await this.uploadFile(file, {
          ...options,
          onProgress: onFileProgress ? (progress) => onFileProgress(i, progress) : undefined
        });
        
        results.push(result);
        completedFiles++;
        
        if (onOverallProgress) {
          onOverallProgress((completedFiles / totalFiles) * 100);
        }
      } catch (error) {
        console.error(`Failed to upload file ${i}:`, error);
        throw error;
      }
    }

    return results;
  }

  // Upload property images
  async uploadPropertyImages(
    files: File[],
    propertyId: string,
    onProgress?: (fileIndex: number, progress: CloudinaryUploadProgress) => void
  ): Promise<CloudinaryUploadResult[]> {
    return this.uploadMultipleFiles(files, {
      folder: 'properties',
      resourceType: 'image',
      tags: ['property', propertyId],
      quality: 'auto',
      format: 'auto'
      // Note: Eager transformations removed for unsigned uploads
      // Images will be transformed on-demand using Cloudinary URLs
    }, onProgress);
  }

  // Upload profile image
  async uploadProfileImage(
    file: File,
    userId: string,
    userType: 'home_owner' | 'artisan' | 'admin' | 'staff',
    onProgress?: (progress: CloudinaryUploadProgress) => void
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: 'profiles',
      resourceType: 'image',
      tags: ['profile', userType, userId],
      quality: 'auto',
      format: 'auto'
      // Note: Eager transformations removed for unsigned uploads
      // Images will be transformed on-demand using Cloudinary URLs
    }, onProgress);
  }

  // Upload ID document
  async uploadIdDocument(
    file: File,
    userId: string,
    documentType: 'id_front' | 'id_back' | 'passport' | 'license',
    onProgress?: (progress: CloudinaryUploadProgress) => void
  ): Promise<CloudinaryUploadResult> {
    const resourceType = file.type === 'application/pdf' ? 'raw' : 'image';
    
    return this.uploadFile(file, {
      folder: 'documents',
      resourceType,
      tags: ['document', documentType, userId],
      quality: resourceType === 'image' ? 90 : undefined,
      onProgress
    });
  }

  // Upload artisan work/portfolio images
  async uploadArtisanWork(
    files: File[],
    artisanId: string,
    onProgress?: (fileIndex: number, progress: CloudinaryUploadProgress) => void
  ): Promise<CloudinaryUploadResult[]> {
    return this.uploadMultipleFiles(files, {
      folder: 'artisans',
      resourceType: 'image',
      tags: ['artisan', 'portfolio', artisanId],
      quality: 'auto',
      format: 'auto'
      // Note: Eager transformations removed for unsigned uploads
      // Images will be transformed on-demand using Cloudinary URLs
    }, onProgress);
  }

  // Delete image from Cloudinary
  async deleteFile(publicId: string): Promise<void> {
    try {
      // Note: For production, this should be done server-side with proper authentication
      // Client-side deletion requires the destroy endpoint to be enabled and configured
      const deleteUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`;
      
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('timestamp', Date.now().toString());

      const response = await fetch(deleteUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.result !== 'ok') {
        throw new Error('Failed to delete file from Cloudinary');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Get optimized image URL
  getOptimizedImageUrl(publicId: string, transformation?: string) {
    if (transformation) {
      return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformation}/${publicId}`;
    }
    return getOptimizedImageUrl(publicId);
  }

  // Get document URL
  getDocumentUrl(publicId: string) {
    return getDocumentUrl(publicId);
  }

  // Generate different image sizes using on-demand transformations
  getImageSizes(publicId: string) {
    return {
      thumbnail: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_150,h_150,c_fill/${publicId}`,
      small: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_300,h_200,c_fill/${publicId}`,
      medium: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_600,h_400,c_fill/${publicId}`,
      large: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_1200,h_800,c_fill/${publicId}`,
      original: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${publicId}`
    };
  }

  // Validate file before upload
  private validateFile(file: File, resourceType: UploadResourceType) {
    const maxSizes = {
      image: 10 * 1024 * 1024,  // 10MB
      raw: 10 * 1024 * 1024,    // 10MB for documents
      video: 100 * 1024 * 1024, // 100MB
      auto: 10 * 1024 * 1024    // 10MB default
    };

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedDocumentTypes = ['application/pdf', ...allowedImageTypes];

    const maxSize = maxSizes[resourceType];
    
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    if (resourceType === 'image' && !allowedImageTypes.includes(file.type)) {
      throw new Error('Invalid image file type. Allowed: JPEG, PNG, WebP, GIF');
    }

    if (resourceType === 'raw' && !allowedDocumentTypes.includes(file.type)) {
      throw new Error('Invalid document file type. Allowed: PDF, JPEG, PNG, WebP, GIF');
    }
  }

  // Format upload result from Cloudinary response
  private formatUploadResult(cloudinaryResult: any): CloudinaryUploadResult {
    return {
      publicId: cloudinaryResult.public_id,
      secureUrl: cloudinaryResult.secure_url,
      url: cloudinaryResult.url,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      format: cloudinaryResult.format,
      resourceType: cloudinaryResult.resource_type,
      folder: cloudinaryResult.folder,
      originalFilename: cloudinaryResult.original_filename,
      bytes: cloudinaryResult.bytes
    };
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService; 