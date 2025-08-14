// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dfrrgzgzu',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '914682856623734',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || 'hxPSQoH5svu6G1ohNP-CiRdNVso',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'adobe_of_homes_upload'
};

// Generate Cloudinary upload URL
export const getCloudinaryUploadUrl = () => {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/upload`;
};

// Generate Cloudinary signed upload parameters
export const generateSignature = (params: Record<string, any>) => {
  // Note: In production, signature generation should be done on the server
  // For demo purposes, we'll use unsigned uploads with upload preset
  return {
    ...params,
    upload_preset: CLOUDINARY_CONFIG.uploadPreset,
    cloud_name: CLOUDINARY_CONFIG.cloudName
  };
};

// Generate optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'crop' | 'scale';
  } = {}
) => {
  const { width, height, quality = 'auto', format = 'auto', crop = 'fill' } = options;
  
  let transformations = [];
  
  if (width || height) {
    let sizeTransform = '';
    if (width) sizeTransform += `w_${width}`;
    if (height) sizeTransform += height ? `,h_${height}` : '';
    if (crop) sizeTransform += `,c_${crop}`;
    transformations.push(sizeTransform);
  }
  
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  const transformString = transformations.length > 0 ? `/${transformations.join(',')}` : '';
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload${transformString}/${publicId}`;
};

// Generate video/document URL
export const getDocumentUrl = (publicId: string) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/raw/upload/${publicId}`;
};

// Predefined image transformations
export const IMAGE_TRANSFORMATIONS = {
  thumbnail: { width: 150, height: 150, crop: 'fill' as const },
  small: { width: 300, height: 200, crop: 'fill' as const },
  medium: { width: 600, height: 400, crop: 'fill' as const },
  large: { width: 1200, height: 800, crop: 'fill' as const },
  profile: { width: 200, height: 200, crop: 'fill' as const },
  banner: { width: 1920, height: 400, crop: 'fill' as const }
};

export { CLOUDINARY_CONFIG }; 