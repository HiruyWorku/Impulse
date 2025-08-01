"""
Impulse Backend - FastAPI Server
Main application file containing all API endpoints for the physics study companion.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import sqlite3
from datetime import datetime
import random

# Initialize FastAPI app
app = FastAPI(
    title="Impulse API",
    description="AI-Enhanced Physics Study Companion Backend",
    version="1.0.0"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://impulse-gamma.vercel.app",  # Your exact Vercel URL
        "https://impulse-0586zavrk-hiruyworkus-projects.vercel.app",
        "https://*.vercel.app",  # Allow all Vercel subdomains
        "https://*.onrender.com"  # Allow all Render subdomains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class QuestionResponse(BaseModel):
    question_id: int
    user_answer: str
    is_correct: bool
    time_taken: Optional[float] = None

class UserSession(BaseModel):
    session_id: str
    total_questions: int = 0
    correct_answers: int = 0
    current_difficulty: str = "medium"
    consecutive_correct: int = 0
    consecutive_incorrect: int = 0

# Global session storage (in production, use Redis or database)
user_sessions: Dict[str, UserSession] = {}

# Initialize database and load questions
def init_database():
    """Initialize SQLite database and load sample physics questions."""
    conn = sqlite3.connect('impulse.db')
    cursor = conn.cursor()
    
    # Create questions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY,
            question_text TEXT NOT NULL,
            options TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            explanation TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            topic TEXT NOT NULL
        )
    ''')
    
    # Create user_responses table for tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            question_id INTEGER NOT NULL,
            user_answer TEXT NOT NULL,
            is_correct BOOLEAN NOT NULL,
            time_taken REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Sample physics questions for MVP
    sample_questions = [
        {
            "question_text": "What is the SI unit of force?",
            "options": json.dumps(["Newton", "Joule", "Watt", "Pascal"]),
            "correct_answer": "Newton",
            "explanation": "Force is measured in Newtons (N) in the SI system. 1 N = 1 kg⋅m/s²",
            "difficulty": "easy",
            "topic": "mechanics"
        },
        {
            "question_text": "A car accelerates from 0 to 60 km/h in 10 seconds. What is its average acceleration?",
            "options": json.dumps(["6 m/s²", "60 m/s²", "1.67 m/s²", "10 m/s²"]),
            "correct_answer": "1.67 m/s²",
            "explanation": "a = Δv/Δt = (60 km/h) / (10 s) = (16.67 m/s) / (10 s) = 1.67 m/s²",
            "difficulty": "medium",
            "topic": "kinematics"
        },
        {
            "question_text": "What is the work done by a force of 10 N moving an object 5 meters?",
            "options": json.dumps(["2 J", "5 J", "50 J", "15 J"]),
            "correct_answer": "50 J",
            "explanation": "Work = Force × Distance = 10 N × 5 m = 50 Joules",
            "difficulty": "easy",
            "topic": "energy"
        },
        {
            "question_text": "A ball is thrown upward with initial velocity 20 m/s. What is its maximum height? (g = 9.8 m/s²)",
            "options": json.dumps(["20.4 m", "40.8 m", "10.2 m", "30.6 m"]),
            "correct_answer": "20.4 m",
            "explanation": "h = v₀²/(2g) = (20 m/s)²/(2×9.8 m/s²) = 400/19.6 = 20.4 m",
            "difficulty": "hard",
            "topic": "kinematics"
        },
        {
            "question_text": "What is the principle of conservation of energy?",
            "options": json.dumps([
                "Energy can be created but not destroyed",
                "Energy can be destroyed but not created", 
                "Energy cannot be created or destroyed, only transformed",
                "Energy is always increasing"
            ]),
            "correct_answer": "Energy cannot be created or destroyed, only transformed",
            "explanation": "The total energy in a closed system remains constant, only changing forms.",
            "difficulty": "medium",
            "topic": "energy"
        }
    ]
    
    # Insert sample questions if table is empty
    cursor.execute("SELECT COUNT(*) FROM questions")
    if cursor.fetchone()[0] == 0:
        for question in sample_questions:
            cursor.execute('''
                INSERT INTO questions (question_text, options, correct_answer, explanation, difficulty, topic)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                question["question_text"],
                question["options"],
                question["correct_answer"],
                question["explanation"],
                question["difficulty"],
                question["topic"]
            ))
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_database()

@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {"message": "Impulse API is running!", "version": "1.0.0"}

@app.post("/session/start")
async def start_session():
    """Start a new user session and return session ID."""
    session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{random.randint(1000, 9999)}"
    user_sessions[session_id] = UserSession(session_id=session_id)
    return {"session_id": session_id, "message": "Session started successfully"}

@app.get("/questions/{difficulty}")
async def get_question(difficulty: str, session_id: str):
    """
    Get a physics question based on difficulty level.
    Implements adaptive difficulty based on user performance.
    """
    if session_id not in user_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = user_sessions[session_id]
    
    # Adaptive difficulty logic
    if session.consecutive_correct >= 3:
        # User is doing well, increase difficulty
        if difficulty == "easy":
            difficulty = "medium"
        elif difficulty == "medium":
            difficulty = "hard"
    elif session.consecutive_incorrect >= 2:
        # User is struggling, decrease difficulty
        if difficulty == "hard":
            difficulty = "medium"
        elif difficulty == "medium":
            difficulty = "easy"
    
    # Get question from database
    conn = sqlite3.connect('impulse.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, question_text, options, correct_answer, explanation, difficulty, topic
        FROM questions 
        WHERE difficulty = ?
        ORDER BY RANDOM()
        LIMIT 1
    ''', (difficulty,))
    
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        raise HTTPException(status_code=404, detail="No questions available for this difficulty")
    
    question_id, question_text, options, correct_answer, explanation, q_difficulty, topic = result
    
    return {
        "question_id": question_id,
        "question_text": question_text,
        "options": json.loads(options),
        "correct_answer": correct_answer,
        "explanation": explanation,
        "difficulty": q_difficulty,
        "topic": topic
    }

@app.post("/questions/submit")
async def submit_answer(response: QuestionResponse, session_id: str):
    """
    Submit user answer and return feedback.
    Updates session statistics for adaptive learning.
    """
    if session_id not in user_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = user_sessions[session_id]
    
    # Update session statistics
    session.total_questions += 1
    if response.is_correct:
        session.correct_answers += 1
        session.consecutive_correct += 1
        session.consecutive_incorrect = 0
    else:
        session.consecutive_correct = 0
        session.consecutive_incorrect += 1
    
    # Store response in database
    conn = sqlite3.connect('impulse.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_responses (session_id, question_id, user_answer, is_correct, time_taken)
        VALUES (?, ?, ?, ?, ?)
    ''', (session_id, response.question_id, response.user_answer, response.is_correct, response.time_taken))
    conn.commit()
    conn.close()
    
    # Get question details for feedback
    conn = sqlite3.connect('impulse.db')
    cursor = conn.cursor()
    cursor.execute('SELECT explanation FROM questions WHERE id = ?', (response.question_id,))
    explanation = cursor.fetchone()[0]
    conn.close()
    
    return {
        "is_correct": response.is_correct,
        "explanation": explanation,
        "session_stats": {
            "total_questions": session.total_questions,
            "correct_answers": session.correct_answers,
            "accuracy": round(session.correct_answers / session.total_questions * 100, 1)
        }
    }

@app.get("/motivation/nudge")
async def get_motivation_nudge(session_id: str):
    """
    Return a motivational message based on user performance.
    Implements simple AI-like behavior for encouragement.
    """
    if session_id not in user_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = user_sessions[session_id]
    
    # Calculate performance metrics
    accuracy = session.correct_answers / max(session.total_questions, 1) * 100
    
    # Motivational messages based on performance
    if session.total_questions == 0:
        return {"message": "Welcome to Impulse! Let's start your physics journey together! 🚀"}
    
    elif accuracy >= 80:
        if session.consecutive_correct >= 3:
            return {"message": "Incredible! You're on fire! 🔥 Keep up this amazing momentum!"}
        else:
            return {"message": "Excellent work! You're mastering these concepts beautifully! ⭐"}
    
    elif accuracy >= 60:
        if session.consecutive_correct >= 2:
            return {"message": "Great progress! You're building confidence with each question! 💪"}
        else:
            return {"message": "You're doing well! Remember, every mistake is a learning opportunity! 📚"}
    
    elif accuracy >= 40:
        if session.consecutive_incorrect >= 2:
            return {"message": "Don't give up! Physics takes time to master. Let's try an easier question! 🌟"}
        else:
            return {"message": "Keep going! You're making progress, even if it doesn't feel like it! 💫"}
    
    else:
        return {"message": "Hey, it's okay to struggle! Let's take it step by step. You've got this! 🌈"}

@app.get("/session/stats/{session_id}")
async def get_session_stats(session_id: str):
    """Get comprehensive session statistics for the user."""
    if session_id not in user_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = user_sessions[session_id]
    accuracy = session.correct_answers / max(session.total_questions, 1) * 100
    
    return {
        "session_id": session_id,
        "total_questions": session.total_questions,
        "correct_answers": session.correct_answers,
        "accuracy": round(accuracy, 1),
        "current_difficulty": session.current_difficulty,
        "consecutive_correct": session.consecutive_correct,
        "consecutive_incorrect": session.consecutive_incorrect
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 