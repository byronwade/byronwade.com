#!/bin/bash

# Local Development Setup Script for local.byronwade.com
echo "🚀 Setting up local.byronwade.com development environment..."

# Check if .env.local exists, if not create from example
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp env.local.example .env.local
    echo "⚠️  Please update .env.local with your actual API keys and configuration"
else
    echo "✅ .env.local already exists"
fi

# Add local.byronwade.com to /etc/hosts if not already present
if ! grep -q "local.byronwade.com" /etc/hosts; then
    echo "📝 Adding local.byronwade.com to /etc/hosts..."
    echo "127.0.0.1 local.byronwade.com" | sudo tee -a /etc/hosts
else
    echo "✅ local.byronwade.com already in /etc/hosts"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating development directories..."
mkdir -p .next/cache
mkdir -p logs

# Set up local database (if using Docker)
if command -v docker &> /dev/null; then
    echo "🐳 Setting up local database with Docker..."
    docker-compose -f docker-compose.local.yml up -d local-db local-redis
    echo "⏳ Waiting for database to be ready..."
    sleep 10
else
    echo "⚠️  Docker not found. Please install Docker to use local database."
fi

echo "✅ Local development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env.local with your API keys"
echo "2. Run 'npm run dev:local' to start development server"
echo "3. Visit http://local.byronwade.com:3001"
echo ""
echo "🐳 Or use Docker: 'npm run docker:local'"
