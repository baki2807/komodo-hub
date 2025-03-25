# Komodo Hub

A modern learning platform built with Next.js, featuring interactive courses, real-time chat, and social features.

## Features

- 🎓 Interactive Learning Modules
- 💬 Real-time Chat System
- 👥 User Profiles and Progress Tracking
- 🖼️ Image Upload with Cloudinary
- 🔒 Secure Authentication with Clerk
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- Next.js 14
- PostgreSQL with Drizzle ORM
- Clerk Authentication
- Cloudinary for Image Storage
- Tailwind CSS for Styling
- TypeScript

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL Database
- Clerk Account
- Cloudinary Account

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="your_postgresql_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
CLERK_WEBHOOK_SECRET="your_clerk_webhook_secret"
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npm run db:generate
   npm run db:push
   ```

3. Initialize sample data:
   ```bash
   npm run init
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the following environment variables in Vercel:
   - DATABASE_URL
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - CLERK_WEBHOOK_SECRET

4. Deploy!

### Database Setup

1. Create a PostgreSQL database
2. Run migrations:
   ```bash
   npm run db:generate
   npm run db:push
   ```
3. Initialize data:
   ```bash
   npm run init
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable components
├── lib/                 # Utility functions and configurations
├── models/             # MongoDB models
├── store/              # Redux store configuration
└── types/              # TypeScript type definitions
```

## Setting up Clerk Webhooks

1. Go to your Clerk Dashboard (https://dashboard.clerk.com)
2. Navigate to your application's Webhooks section
3. Create a new webhook endpoint with the URL: `https://your-domain.com/api/webhook/clerk`
4. Select the following events to monitor:
   - user.created
   - user.updated
   - user.deleted
5. Copy the Webhook Secret and add it to your `.env` file:
   ```
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_from_clerk_dashboard
   ```
6. Deploy your application to ensure the webhook endpoint is accessible

The webhook handler will automatically sync user data between Clerk and your database when users are created, updated, or deleted.

## Local Development Without Webhooks

When developing locally, Clerk webhooks can't reach your localhost. Here are two solutions:

### 1. Automatic User Creation (Already Implemented)

The `/api/users` endpoint automatically creates users in your database when they're authenticated with Clerk but don't exist in your database yet.

### 2. Manual Webhook Simulation

You can manually trigger webhook events using the development endpoint:

```bash
# Create/update a user
curl -X POST http://localhost:3000/api/dev-webhook/clerk \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "user.created",
    "data": {
      "id": "YOUR_CLERK_USER_ID",
      "email_addresses": [{"email_address": "user@example.com"}],
      "first_name": "John",
      "last_name": "Doe",
      "image_url": "https://example.com/avatar.jpg"
    }
  }'
```

Replace `YOUR_CLERK_USER_ID` with your actual Clerk user ID.




