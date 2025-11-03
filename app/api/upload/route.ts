import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export interface UploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  bytes?: number;
}

export interface SuccessResponse {
  success: true;
  imageUrl: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

export interface ErrorResponse {
  error: string;
}

export type UploadResponse = SuccessResponse | ErrorResponse;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as (File & { arrayBuffer(): Promise<ArrayBuffer> }) | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' } as ErrorResponse,
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = (await uploadImage(buffer, 'portfolio/projects')) as UploadResult;

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    } as SuccessResponse);

  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' } as ErrorResponse,
      { status: 500 }
    );
  }
}