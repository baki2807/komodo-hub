// Load environment variables
require('dotenv').config({ path: './.env.local' });

console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Exists' : 'Missing');
console.log('Clerk Publishable Key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Exists' : 'Missing');
console.log('Clerk Secret Key:', process.env.CLERK_SECRET_KEY ? 'Exists' : 'Missing');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Exists' : 'Missing');

// Print the first few characters of each key (for security)
if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  console.log('Publishable Key first 10 chars:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.slice(0, 10));
}

if (process.env.CLERK_SECRET_KEY) {
  console.log('Secret Key first 10 chars:', process.env.CLERK_SECRET_KEY.slice(0, 10));
}

if (process.env.DATABASE_URL) {
  console.log('Database URL first 10 chars:', process.env.DATABASE_URL.slice(0, 10));
} 