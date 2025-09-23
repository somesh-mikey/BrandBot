#!/bin/bash

echo "Starting BrandBot Frontend and Backend Servers..."
echo

echo "Starting Backend Server..."
cd brandbot-backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Waiting 3 seconds for backend to start..."
sleep 3

echo "Starting Frontend Server..."
cd ../brandbot-frontend
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait

