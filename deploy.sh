#!/bin/bash
set -e

echo "Building application..."
cd apps/web
npm run build

echo "Deploying to Vercel..."
npx vercel --prod

echo "Deployment complete!"
