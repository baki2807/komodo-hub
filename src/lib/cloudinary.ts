import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with hardcoded values for development
cloudinary.config({
  cloud_name: 'db3d4xzdn',
  api_key: '549542333541745',
  api_secret: '6J7eTtbWHHI_fpI2byGe_PVayfc',
  secure: true,
});

export default cloudinary; 