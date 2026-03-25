# Upstash Redis Setup Guide

## What Changed

The like and share counts are now stored globally in Upstash Redis instead of locally in JSON files. This means:
- All users see the same like/share counts
- Counts persist across deployments
- No more read-only filesystem issues on Vercel

## Setup Instructions

### 1. Install Upstash Redis Integration

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (projectpulse)
3. Click on the "Storage" tab
4. Click "Create Database"
5. Select "Upstash" from Marketplace Database Providers
6. Click "Continue" to install the integration
7. Create a new Redis database named "projectpulse-redis"
8. Select a region close to your users
9. Click "Create"

### 2. Connect to Your Project

After creating the database:
1. Vercel will automatically add environment variables to your project
2. The following variables will be added:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 3. Deploy

1. Push your changes to GitHub (already done)
2. Vercel will automatically deploy
3. The Redis database will be connected and ready to use
4. If deployment doesn't trigger, manually redeploy from Vercel dashboard

## How It Works

### API Routes

- `POST /api/ideas/[id]/like` - Increment like count in KV
- `DELETE /api/ideas/[id]/like` - Decrement like count in KV
- `POST /api/ideas/share` - Increment share count in KV
- `GET /api/ideas` - Fetch ideas with counts from KV

### Redis Helper Functions (`lib/kv.ts`)

Uses `@upstash/redis` package:
- `incrementLikes(ideaId)` - Increment like count
- `decrementLikes(ideaId)` - Decrement like count
- `incrementShares(ideaId)` - Increment share count
- `getLikes(ideaId)` - Get like count
- `getShares(ideaId)` - Get share count
- `getAllCounts(ideaIds)` - Batch fetch all counts

### Frontend

- Optimistic updates for instant UI feedback
- API calls to persist changes globally
- Fallback to server count if API call succeeds

## Testing Locally

To test locally, you need to set up environment variables:

1. Get your Upstash Redis credentials from Vercel dashboard (Settings → Environment Variables)
2. Create `.env.local` file:
```bash
UPSTASH_REDIS_REST_URL="your_upstash_redis_rest_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_rest_token"
```

3. Run dev server:
```bash
npm run dev
```

## Migration Notes

- Existing like/share counts in `data/ideas.json` are NOT automatically migrated
- Redis starts with 0 counts for all ideas
- If you want to preserve existing counts, you'll need to manually seed the Redis database using the Upstash console

## Troubleshooting

### "Failed to update likes" error
- Check that Upstash Redis is installed and connected
- Verify environment variables are set in Vercel (Settings → Environment Variables)
- Check Vercel deployment logs for detailed error messages
- Try redeploying from Vercel dashboard

### Counts not updating
- Clear browser cache and localStorage
- Check browser console for API errors
- Verify Upstash Redis integration is active in Vercel
- Check that environment variables are present in the deployment
