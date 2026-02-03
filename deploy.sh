#!/bin/bash

# Exit on any error
set -e

# Project configuration
PROJECT_DIR="/root/projects/university-lectures"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
PROJECT_NAME="university-lectures"

echo "🚀 Starting deployment for $PROJECT_NAME..."
echo "📁 Project directory: $PROJECT_DIR"

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Pull latest code from Git
echo "📥 Pulling latest code from Git..."
git pull origin main

# Stop containers (only this project)
echo "🛑 Stopping containers..."
docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d --build

# Wait for containers to be healthy
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Run Prisma migrations
echo "🗄️  Running database migrations..."
docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" exec -T app npx prisma migrate deploy

# Health check
echo "🏥 Running health check..."
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Health check failed, but deployment completed. Check logs:"
    echo "   docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs app"
fi

# Show running containers
echo ""
echo "📊 Running containers:"
docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps

echo ""
echo "✅ Deployment complete!"
echo "🌐 App should be available at: http://YOUR_SERVER_IP"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs -f app"
echo "   Stop all:     docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME down"
echo "   Restart:      docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME restart"


