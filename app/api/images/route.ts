import { NextResponse } from 'next/server';
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

// DELETE specific image
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const publicId = getPublicIdFromUrl(imageUrl);

    if (!publicId) {
      return NextResponse.json(
        { error: 'Invalid Cloudinary URL' },
        { status: 400 }
      );
    }

    const result = await deleteImage(publicId);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      publicId,
      result
    });

  } catch (error) {
    console.error('Image deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image: ' + error.message },
      { status: 500 }
    );
  }
}