#!/bin/bash
# Deploy both apps from root

echo "🚀 Deploying All Apps..."

echo "📱 Deploying Web App..."
cd apps/web
vercel --prod
cd ../..

echo "💻 Deploying Unified App..."
cd apps/unified  
vercel --prod
cd ../..

echo "✅ All apps deployed!"
