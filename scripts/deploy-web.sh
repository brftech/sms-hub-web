#!/bin/bash
# Deploy web app only from root

echo "🚀 Deploying Web App..."
vercel --prod --yes --cwd apps/web
echo "✅ Web app deployed!"
