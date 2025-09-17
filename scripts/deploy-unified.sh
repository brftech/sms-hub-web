#!/bin/bash
# Deploy unified app only from root

echo "🚀 Deploying Unified App..."
cd apps/unified
vercel --prod
cd ../..
echo "✅ Unified app deployed!"
