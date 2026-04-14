#!/bin/bash
# Start backend in background
echo "Starting backend server..."
node backend/server.cjs &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 3

# Start frontend
echo "Starting frontend..."
npm run dev

# On exit, kill backend
trap "kill $BACKEND_PID" EXIT
