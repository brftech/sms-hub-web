#!/bin/bash

# SMS Hub Deployment Script
# Deploy both web and unified apps to production

set -e  # Exit on error

echo "🚀 Starting SMS Hub deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Parse arguments
DEPLOY_WEB=true
DEPLOY_UNIFIED=true
FORCE_FLAG=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --web-only)
      DEPLOY_UNIFIED=false
      shift
      ;;
    --unified-only)
      DEPLOY_WEB=false
      shift
      ;;
    --force)
      FORCE_FLAG="--force"
      shift
      ;;
    --help)
      echo "Usage: ./deploy.sh [options]"
      echo ""
      echo "Options:"
      echo "  --web-only       Deploy only the web app"
      echo "  --unified-only   Deploy only the unified app"
      echo "  --force          Force deployment (bypass cache)"
      echo "  --help           Show this help message"
      echo ""
      echo "Examples:"
      echo "  ./deploy.sh                    # Deploy both apps"
      echo "  ./deploy.sh --web-only         # Deploy only web app"
      echo "  ./deploy.sh --unified-only     # Deploy only unified app"
      echo "  ./deploy.sh --force            # Force deploy both apps"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Deploy Web App
if [ "$DEPLOY_WEB" = true ]; then
  echo -e "${BLUE}📦 Deploying Web App...${NC}"
  echo "------------------------"

  # Link to web project from root
  vercel link --project sms-hub-web --yes > /dev/null 2>&1

  if vercel --prod --yes $FORCE_FLAG; then
    echo -e "${GREEN}✅ Web app deployed successfully!${NC}"
  else
    echo -e "${RED}❌ Web app deployment failed${NC}"
    exit 1
  fi

  echo ""
fi

# Deploy Unified App
if [ "$DEPLOY_UNIFIED" = true ]; then
  echo -e "${BLUE}📦 Deploying Unified App...${NC}"
  echo "---------------------------"

  # Link to unified project from root
  vercel link --project sms-hub-unified --yes > /dev/null 2>&1

  if vercel --prod --yes $FORCE_FLAG; then
    echo -e "${GREEN}✅ Unified app deployed successfully!${NC}"
  else
    echo -e "${RED}❌ Unified app deployment failed${NC}"
    exit 1
  fi

  echo ""
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Production URLs:"
echo "  Web:     https://www.gnymble.com"
echo "  Unified: https://unified.gnymble.com"
echo ""
echo "Other hubs:"
echo "  PercyTech: https://www.percytech.com → https://unified.percytech.com"
echo "  PercyMD:   https://www.percymd.com → https://unified.percymd.com"
echo "  PercyText: https://www.percytext.com → https://unified.percytext.com"