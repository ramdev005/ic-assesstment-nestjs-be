#!/bin/bash

# Script to clean up any existing NestJS processes and start fresh
echo "🧹 Cleaning up existing NestJS processes..."

# Kill all existing nest processes
pkill -f "nest start" 2>/dev/null
pkill -f "node.*nest" 2>/dev/null

# Kill any processes using port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo "⏳ Waiting for processes to clean up..."
sleep 3

# Check if port 3000 is free
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3000 is still in use. Please check manually."
    exit 1
else
    echo "✅ Port 3000 is free"
fi

echo "🚀 Starting NestJS development server..."
pnpm run start:dev
