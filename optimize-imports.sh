#!/bin/bash

# Replace UI imports with marketing-optimized version
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|from "@sms-hub/ui"|from "@sms-hub/ui/marketing"|g' {} \;

echo "Updated UI imports to use optimized marketing export"