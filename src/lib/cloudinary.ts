import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'db3d4xzdn',
  api_key: process.env.CLOUDINARY_API_KEY || '549542333541745',
  api_secret: process.env.CLOUDINARY_API_SECRET || '6J7eTtbWHHI_fpI2byGe_PVayfc'
});

export default cloudinary; 