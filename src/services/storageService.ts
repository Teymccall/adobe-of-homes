import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTaskSnapshot
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export type UploadPath = 'properties' | 'profiles' | 'documents' | 'artisans';

export interface UploadProgress {
  progress: number;
  snapshot: UploadTaskSnapshot;
}

export interface UploadResult {
  url: string;
  fileName: string;
  fullPath: string;
}

class StorageService {
  // Upload single file
  async uploadFile(
    file: File,
    path: UploadPath,
    subfolder?: string,
    fileName?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      const finalFileName = fileName || `${Date.now()}_${file.name}`;
      const pathString = subfolder ? `${path}/${subfolder}/${finalFileName}` : `${path}/${finalFileName}`;
      const storageRef = ref(storage, pathString);

      if (onProgress) {
        // Use resumable upload for progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress({ progress, snapshot });
            },
            (error) => {
              console.error('Upload error:', error);
              reject(error);
            },
            async () => {
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({
                  url,
                  fileName: finalFileName,
                  fullPath: pathString
                });
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } else {
        // Simple upload without progress
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        
        return {
          url,
          fileName: finalFileName,
          fullPath: pathString
        };
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[],
    path: UploadPath,
    subfolder?: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    try {
      const uploadPromises = files.map((file, index) => 
        this.uploadFile(
          file,
          path,
          subfolder,
          undefined,
          onProgress ? (progress) => onProgress(index, progress) : undefined
        )
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }

  // Upload property images
  async uploadPropertyImages(
    files: File[],
    propertyId: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    return this.uploadMultipleFiles(files, 'properties', propertyId, onProgress);
  }

  // Upload profile image
  async uploadProfileImage(
    file: File,
    userId: string,
    userType: 'home_owner' | 'artisan' | 'admin' | 'staff',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    return this.uploadFile(file, 'profiles', `${userType}/${userId}`, 'profile.jpg', onProgress);
  }

  // Upload ID document
  async uploadIdDocument(
    file: File,
    userId: string,
    documentType: 'id_front' | 'id_back' | 'passport',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    return this.uploadFile(file, 'documents', userId, `${documentType}.jpg`, onProgress);
  }

  // Delete file
  async deleteFile(fullPath: string): Promise<void> {
    try {
      const storageRef = ref(storage, fullPath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Delete multiple files
  async deleteMultipleFiles(fullPaths: string[]): Promise<void> {
    try {
      const deletePromises = fullPaths.map(path => this.deleteFile(path));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple files:', error);
      throw error;
    }
  }

  // Get all files in a folder
  async getFilesInFolder(folderPath: string): Promise<string[]> {
    try {
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);
      
      const urls = await Promise.all(
        result.items.map(item => getDownloadURL(item))
      );
      
      return urls;
    } catch (error) {
      console.error('Error getting files in folder:', error);
      throw error;
    }
  }

  // Generate download URL from path
  async getDownloadUrl(fullPath: string): Promise<string> {
    try {
      const storageRef = ref(storage, fullPath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  // Validate file
  validateFile(file: File, maxSizeInMB = 10, allowedTypes?: string[]): { isValid: boolean; error?: string } {
    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        error: `File size must be less than ${maxSizeInMB}MB`
      };
    }

    // Check file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type must be one of: ${allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  }

  // Validate image file
  validateImageFile(file: File, maxSizeInMB = 10): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return this.validateFile(file, maxSizeInMB, allowedTypes);
  }

  // Validate document file
  validateDocumentFile(file: File, maxSizeInMB = 5): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return this.validateFile(file, maxSizeInMB, allowedTypes);
  }

  // Resize image (client-side)
  async resizeImage(file: File, maxWidth = 800, maxHeight = 600, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Batch upload with retry logic
  async batchUploadWithRetry(
    files: File[],
    path: UploadPath,
    subfolder?: string,
    maxRetries = 3,
    onProgress?: (overall: number, file: number, fileProgress: number) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      let retries = 0;
      let success = false;
      
      while (!success && retries < maxRetries) {
        try {
          const result = await this.uploadFile(
            files[i],
            path,
            subfolder,
            undefined,
            onProgress ? (progress) => {
              const overallProgress = (i / files.length) * 100;
              onProgress(overallProgress, i, progress.progress);
            } : undefined
          );
          
          results.push(result);
          success = true;
        } catch (error) {
          retries++;
          if (retries >= maxRetries) {
            throw error;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }
    }
    
    return results;
  }
}

export const storageService = new StorageService();
export default storageService; 