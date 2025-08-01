#!/bin/bash

# Impulse MVP Setup Script
# This script sets up both the backend and frontend for the Impulse physics study companion

echo "🚀 Setting up Impulse - AI-Enhanced Physics Study Companion"
echo "=========================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js and try again."
    exit 1
fi

echo "✅ Python 3 and Node.js are installed"

# Backend Setup
echo ""
echo "📦 Setting up Backend (FastAPI)..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Backend setup complete!"

# Frontend Setup
echo ""
echo "📦 Setting up Frontend (React + Vite)..."
cd ../frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"

# Return to root directory
cd ..

echo ""
echo "🎉 Setup complete! To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser to http://localhost:5173"
echo ""
echo "📚 Demo Flow:"
echo "   - Welcome page with app introduction"
echo "   - Click 'Start Learning' to begin"
echo "   - Answer physics questions"
echo "   - See real-time feedback and motivation"
echo "   - Experience adaptive difficulty"
echo ""
echo "Happy learning! 🚀" 