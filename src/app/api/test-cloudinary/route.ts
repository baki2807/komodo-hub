import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    // Get the current Cloudinary configuration
    const config = cloudinary.config();
    
    // Test if we can connect to Cloudinary
    const testResult = await cloudinary.api.ping();
    
    return NextResponse.json({
      status: 'success',
      config: {
        cloud_name: config.cloud_name,
        api_key: config.api_key?.substring(0, 4) + '...', // Only show first 4 chars for security
        hasSecret: !!config.api_secret,
      },
      testResult
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      config: cloudinary.config()
    }, { status: 500 });
  }
} 