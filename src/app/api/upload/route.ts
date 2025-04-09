import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      console.error('Upload error: Unauthorized user');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      console.error('Upload error: No file provided in form data');
      return new NextResponse('No file provided', { status: 400 });
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadType: type
    });

    // Set size limits based on file type
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
    const MAX_COVER_SIZE = 10 * 1024 * 1024; // 10MB

    // Check file size limits
    if (type === 'cover' && file.size > MAX_COVER_SIZE) {
      return new NextResponse('Cover image must be less than 10MB', { status: 400 });
    }
    if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
      return new NextResponse('Images must be less than 5MB', { status: 400 });
    }
    if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
      return new NextResponse('Videos must be less than 100MB', { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer created, size:', buffer.length);

    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: type === 'cover' ? 'profile_covers' : 'community_posts',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
            max_bytes: type === 'cover' ? MAX_COVER_SIZE : 
                      file.type.startsWith('video/') ? MAX_VIDEO_SIZE : 
                      MAX_IMAGE_SIZE,
            chunk_size: 6000000, // 6MB chunks for better upload handling
            timeout: 120000, // 2 minutes timeout per chunk
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('Cloudinary upload success:', result?.secure_url);
              resolve(result);
            }
          }
        );

        // Handle upload stream errors
        uploadStream.on('error', (error) => {
          console.error('Upload stream error:', error);
          reject(new Error('Failed to process upload stream'));
        });

        uploadStream.end(buffer);
      });

      return NextResponse.json({ url: (result as any).secure_url });
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload to Cloudinary';
      return new NextResponse(errorMessage, { status: 500 });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Upload failed',
      { status: 500 }
    );
  }
} 