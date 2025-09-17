#!/bin/bash
# Deploy web app only from root

echo "🚀 Deploying Web App..."
cd apps/web
vercel --prod
cd ../..
echo "✅ Web app deployed!"
