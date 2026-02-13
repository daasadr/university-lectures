#!/bin/bash
set -e

PROJECT_DIR="/root/projects/university-lectures"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
PROJECT_NAME="university-lectures"

echo "🚀 Starting deployment for $PROJECT_NAME..."
echo "📁 Project directory: $PROJECT_DIR"

cd "$PROJECT_DIR" || exit 1

echo "📥 Pulling latest code from Git..."
git pull origin main

echo "🛑 Stopping containers..."
docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down

echo "🔨 Building and starting containers..."
docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d --build

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🗄️  Pushing database schema..."
# Použij node_modules/prisma místo npx
docker exec univ-lectures-app node node_modules/prisma/build/index.js db push --accept-data-loss

echo "🔄 Restarting app container..."
docker restart univ-lectures-app

echo "⏳ Waiting for app to start..."
sleep 5

echo "🏥 Running health check..."
if curl -f http://localhost:3002 > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Health check failed, check logs:"
    echo "   docker logs univ-lectures-app"
fi

echo ""
echo "📊 Running containers:"
docker ps --filter "name=univ-lectures"

echo ""
echo "✅ Deployment complete!"
echo "🌐 App should be available at: http://YOUR_SERVER_IP:3002"
