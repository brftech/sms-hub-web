#!/bin/bash

# SMS Hub Web - Development Setup Script
# This script sets up the development environment with all optimizations

set -e

echo "🚀 Setting up SMS Hub Web development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Run linting
echo "🔧 Running linter..."
npm run lint:check

# Run tests
echo "🧪 Running tests..."
npm run test:run

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Development environment setup complete!"
echo ""
echo "📋 Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run test         - Run tests in watch mode"
echo "  npm run test:e2e     - Run Playwright E2E tests"
echo "  npm run lint:fix     - Fix linting issues"
echo "  npm run format       - Format code with Prettier"
echo "  npm run analyze      - Analyze bundle size"
echo ""
echo "🎯 Ready to develop!"
