# Impulse - AI-Enhanced Physics Study Companion

## Overview
Impulse is a web-based AI-enhanced study companion designed to help students in introductory physics courses. This MVP demonstrates core features including adaptive quizzes, real-time feedback, and motivational nudges.

## Project Structure
```
impulse/
├── frontend/          # React application
├── backend/           # FastAPI server
├── data/              # Question bank and data files
└── docs/              # Documentation
```

## Core Features
- **Adaptive Quiz System**: Questions adjust difficulty based on performance
- **Real-time Feedback**: Immediate correct/incorrect responses with explanations
- **Motivation Nudges**: Encouraging messages based on user progress
- **Performance Tracking**: Tracks user responses for adaptive learning.

## Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Demo Flow
1. **Welcome Page**: App introduction and start button
2. **Quiz Interface**: Multiple-choice physics questions
3. **Real-time Feedback**: Immediate response feedback
4. **Adaptive Difficulty**: Questions adjust based on performance
5. **Motivation Nudges**: Encouraging messages throughout

## Technology Stack
- **Frontend**: React, TailwindCSS, Context API
- **Backend**: FastAPI, SQLite, JSON data storage
- **AI Features**: Simple reinforcement learning simulation

## Development Notes
- Modular structure for easy expansion
- Clear separation of concerns
- Comprehensive comments for educational purposes
- Ready for professor demonstration
