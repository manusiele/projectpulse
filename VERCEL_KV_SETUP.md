# Vercel KV Setup Guide

## What Changed

The like and share counts are now stored globally in Vercel KV (Redis) instead of locally in JSON files. This means:
- All users see the same like/share counts
- Counts persist across deployments
- No more read-only filesystem issues on Vercel

## Setup Instructions

### 1. Create Vercel KV Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (projectpulse)
3. Click on the "Storage" tab
4. Click "Create Database"
5. Select "KV" (Redis)
6. Choose a name (e.g., "projectpulse-kv")
7. Select a region close to your users
8. Click "Create"

### 2. Connect to Your Project

After creating the database:
1. Vercel will automatically add environment variables to your project
2. The following variables will be added:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 3. Deploy

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. The KV database will be connected and ready to use

## How It Works

### API Routes

- `POST /api/ideas/[id]/like` - Increment like count in KV
- `DELETE /api/ideas/[id]/like` - Decrement like count in KV
- `POST /api/ideas/share` - Increment share count in KV
- `GET /api/ideas` - Fetch ideas with counts from KV

### KV Helper Functions (`lib/kv.ts`)

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

1. Get your KV credentials from Vercel dashboard
2. Create `.env.local` file:
```bash
KV_URL="your_kv_url"
KV_REST_API_URL="your_rest_api_url"
KV_REST_API_TOKEN="your_token"
KV_REST_API_READ_ONLY_TOKEN="your_read_only_token"
```

3. Run dev server:
```bash
npm run dev
```

## Migration Notes

- Existing like/share counts in `data/ideas.json` are NOT automatically migrated
- KV starts with 0 counts for all ideas
- If you want to preserve existing counts, you'll need to manually seed the KV database

## Troubleshooting

### "Failed to update likes" error
- Check that KV database is created and connected
- Verify environment variables are set in Vercel
- Check Vercel logs for detailed error messages

### Counts not updating
- Clear browser cache and localStorage
- Check browser console for API errors
- Verify KV database is accessible from your deployment region
