#!/bin/bash

# SMS Hub Development Script
# Start development servers for both web and unified apps

set -e  # Exit on error

echo "🚀 Starting SMS Hub development servers..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
START_WEB=true
START_UNIFIED=true

while [[ $# -gt 0 ]]; do
  case $1 in
    --web-only)
      START_UNIFIED=false
      shift
      ;;
    --unified-only)
      START_WEB=false
      shift
      ;;
    --help)
      echo "Usage: ./dev.sh [options]"
      echo ""
      echo "Options:"
      echo "  --web-only       Start only the web app"
      echo "  --unified-only   Start only the unified app"
      echo "  --help           Show this help message"
      echo ""
      echo "Examples:"
      echo "  ./dev.sh                    # Start both apps"
      echo "  ./dev.sh --web-only         # Start only web app"
      echo "  ./dev.sh --unified-only     # Start only unified app"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Build the filter argument for pnpm dev
FILTER_ARG=""
if [ "$START_WEB" = true ] && [ "$START_UNIFIED" = true ]; then
  FILTER_ARG="--filter=@sms-hub/web --filter=@sms-hub/unified"
elif [ "$START_WEB" = true ]; then
  FILTER_ARG="--filter=@sms-hub/web"
elif [ "$START_UNIFIED" = true ]; then
  FILTER_ARG="--filter=@sms-hub/unified"
else
  echo "No apps selected to start"
  exit 1
fi

echo -e "${YELLOW}📝 Development URLs:${NC}"
echo "  Web:     http://localhost:3000"
echo "  Unified: http://localhost:3001"
echo ""
echo -e "${BLUE}Starting development servers...${NC}"
echo "Press Ctrl+C to stop"
echo ""

# Start the development servers
pnpm dev $FILTER_ARG