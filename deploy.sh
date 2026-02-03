#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Stop old containers
docker-compose down

# Build and start
docker-compose up -d --build

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Health check
sleep 5
curl -f http://localhost:3000 || echo "❌ Health check failed"

echo "✅ Deployment complete!"