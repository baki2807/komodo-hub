import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
            max_bytes: type === 'cover' ? 10 * 1024 * 1024 : 
                      file.type.startsWith('video/') ? 50 * 1024 * 1024 : 
                      5 * 1024 * 1024
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
        uploadStream.end(buffer);
      });

      return NextResponse.json({ url: (result as any).secure_url });
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return new NextResponse('Failed to upload to Cloudinary', { status: 500 });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Upload failed',
      { status: 500 }
    );
  }
} 