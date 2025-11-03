import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} imageBuffer - Image buffer data
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} Upload result
 */
export interface UploadTransformation {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
}

export interface UploadOptions {
  folder?: string;
  resource_type?: 'image' | 'video' | 'raw';
  transformation?: UploadTransformation[];
}

export interface UploadResult {
  public_id: string;
  version?: number;
  signature?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  created_at?: string;
  tags?: string[];
  bytes?: number;
  type?: string;
  etag?: string;
  placeholder?: boolean;
  url?: string;
  secure_url?: string;
  original_filename?: string;
}

export async function uploadImage(imageBuffer: Buffer, folder = 'portfolio'): Promise<UploadResult> {
  return new Promise<UploadResult>((resolve, reject) => {
    const uploadStream: NodeJS.WritableStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 630, crop: 'limit', quality: 'auto' },
          { format: 'webp' }
        ]
      } as UploadOptions,
      (error: Error | undefined, result?: UploadResult) => {
        if (error) reject(error);
        else resolve(result as UploadResult);
      }
    );

    uploadStream.end(imageBuffer);
  });
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Delete result
 */
export interface DeleteResult {
  result: string;
  status?: number;
}

export async function deleteImage(publicId: string): Promise<DeleteResult> {
  try {
    if (!publicId) {
      throw new Error('Public ID is required');
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image: ${result.result}`);
    }

    console.log('Successfully deleted image:', publicId);
    return result;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    throw error;
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} Public ID
 */
export function getPublicIdFromUrl(url: string) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    // Handle different Cloudinary URL formats
    const patterns = [
      /\/v\d+\/(.+)\.\w+$/, // Standard format
      /\/image\/upload\/.*\/(.+)\.\w+$/, // With transformations
      /cloudinary\.com\/.*\/upload\/(.+)\.\w+$/ // Full URL
    ];

    for (const pattern of patterns) {
      const matches = url.match(pattern);
      if (matches && matches[1]) {
        // Remove version number if present
        return matches[1].replace(/^v\d+\//, '');
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', url, error);
    return null;
  }
}

/**
 * Generate optimized image URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Optimized URL
 */
export interface OptimizedImageOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
}

export function getOptimizedImageUrl(publicId: string, options: OptimizedImageOptions = {}): string {
  const { width = 800, height = 600, quality = 'auto', format = 'webp' } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality,
    format,
    fetch_format: 'auto'
  });
}

/**
 * Check if URL is a Cloudinary URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export function isCloudinaryUrl(url: string) {
  return url && typeof url === 'string' && url.includes('cloudinary');
}