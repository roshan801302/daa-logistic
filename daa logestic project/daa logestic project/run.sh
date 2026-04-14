#!/bin/bash

# Logistics Optimization Platform - Startup Script
# Pure JavaScript/HTML/CSS Implementation

echo "🚀 Starting Logistics Optimization Platform..."

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌐 Starting web server on http://localhost:8000"
npm start

# Wait for the server
wait $SERVER_PID