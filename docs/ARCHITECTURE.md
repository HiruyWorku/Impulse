# Impulse Architecture Documentation

## System Overview

Impulse is a web-based AI-enhanced physics study companion designed as an MVP for introductory physics students. The system demonstrates adaptive learning, real-time feedback, and motivational features.

## Architecture Pattern

The application follows a **client-server architecture** with:
- **Frontend**: React.js single-page application
- **Backend**: FastAPI REST API
- **Database**: SQLite (for MVP simplicity)
- **State Management**: React Context API

## Backend Architecture

### FastAPI Server (`backend/main.py`)

#### Core Components:

1. **Session Management**
   - Tracks user sessions with unique IDs
   - Stores performance metrics (accuracy, consecutive correct/incorrect)
   - Implements adaptive difficulty logic

2. **Question System**
   - SQLite database with physics questions
   - Questions categorized by difficulty (easy, medium, hard)
   - Random question selection with difficulty filtering

3. **Adaptive Learning Engine**
   - Monitors consecutive correct/incorrect answers
   - Adjusts difficulty: increases after 3 consecutive correct, decreases after 2 consecutive incorrect
   - Simulates reinforcement learning behavior

4. **Motivation System**
   - Context-aware motivational messages
   - Based on accuracy ranges and performance patterns
   - Encourages continued learning

#### API Endpoints:

```
POST /session/start          # Initialize new user session
GET  /questions/{difficulty} # Get adaptive question
POST /questions/submit       # Submit answer and get feedback
GET  /motivation/nudge       # Get motivational message
GET  /session/stats/{id}     # Get session statistics
```

#### Data Models:

```python
class QuestionResponse:
    question_id: int
    user_answer: str
    is_correct: bool
    time_taken: Optional[float]

class UserSession:
    session_id: str
    total_questions: int
    correct_answers: int
    current_difficulty: str
    consecutive_correct: int
    consecutive_incorrect: int
```

## Frontend Architecture

### React Application Structure

#### State Management:
- **React Context API** for global state
- **useReducer** for complex state logic
- **Local state** for component-specific data

#### Component Hierarchy:

```
App
├── WelcomePage
│   └── Session initialization
└── QuizInterface
    ├── ProgressBar
    ├── Question display
    ├── Answer options
    ├── Feedback section
    └── MotivationNudge
```

#### Key Components:

1. **WelcomePage** (`components/WelcomePage.js`)
   - App introduction and feature highlights
   - Session initialization
   - Navigation to quiz interface

2. **QuizInterface** (`components/QuizInterface.js`)
   - Main quiz functionality
   - Question display and answer selection
   - Real-time feedback
   - Integration with motivation system

3. **MotivationNudge** (`components/MotivationNudge.js`)
   - Displays encouraging messages
   - Auto-hide functionality
   - Animated appearance

4. **ProgressBar** (`components/ProgressBar.js`)
   - Visual progress tracking
   - Accuracy display
   - Performance indicators

### API Integration (`services/api.js`)

- **Axios** for HTTP requests
- **Error handling** with user-friendly messages
- **Request/response interceptors** for consistent data flow

## Database Schema

### Questions Table
```sql
CREATE TABLE questions (
    id INTEGER PRIMARY KEY,
    question_text TEXT NOT NULL,
    options TEXT NOT NULL,        -- JSON array of options
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    difficulty TEXT NOT NULL,      -- 'easy', 'medium', 'hard'
    topic TEXT NOT NULL           -- 'mechanics', 'kinematics', 'energy'
);
```

### User Responses Table
```sql
CREATE TABLE user_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    question_id INTEGER NOT NULL,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Adaptive Learning Algorithm

### Difficulty Adjustment Logic:

```python
# Increase difficulty after 3 consecutive correct answers
if session.consecutive_correct >= 3:
    if difficulty == "easy": difficulty = "medium"
    elif difficulty == "medium": difficulty = "hard"

# Decrease difficulty after 2 consecutive incorrect answers
elif session.consecutive_incorrect >= 2:
    if difficulty == "hard": difficulty = "medium"
    elif difficulty == "medium": difficulty = "easy"
```

### Motivation System:

- **Accuracy-based messages**: Different encouragement based on performance ranges
- **Streak-based messages**: Special recognition for consecutive correct answers
- **Struggle support**: Encouraging messages when user is having difficulty

## Security Considerations

### MVP Limitations:
- No authentication (session-based for demo)
- No input validation beyond basic types
- No rate limiting
- SQLite for simplicity (not production-ready)

### Production Improvements:
- JWT authentication
- Input sanitization
- Rate limiting
- PostgreSQL/Redis for scalability
- HTTPS enforcement

## Performance Considerations

### Current Optimizations:
- React.memo for component optimization
- Efficient state updates with useReducer
- Minimal API calls with proper caching
- Responsive design with TailwindCSS

### Scalability Improvements:
- Database indexing
- API response caching
- CDN for static assets
- Load balancing for multiple instances

## Testing Strategy

### Backend Testing:
- Unit tests for adaptive learning logic
- API endpoint testing with pytest
- Database integration tests

### Frontend Testing:
- Component testing with React Testing Library
- User interaction testing
- API integration testing

## Deployment Architecture

### Development:
- Backend: `uvicorn main:app --reload` (localhost:8000)
- Frontend: `npm start` (localhost:3000)
- Database: Local SQLite file

### Production Considerations:
- Docker containerization
- Environment variable management
- Database migration scripts
- Monitoring and logging
- CI/CD pipeline

## Future Enhancements

### AI/ML Features:
- More sophisticated adaptive algorithms
- Personalized learning paths
- Question recommendation engine
- Performance prediction models

### User Experience:
- User accounts and progress tracking
- Social features (leaderboards, study groups)
- Mobile app development
- Offline mode support

### Content Management:
- Question bank expansion
- Multiple subjects support
- Content creation tools
- Analytics dashboard

## Development Guidelines

### Code Organization:
- Clear separation of concerns
- Comprehensive documentation
- Consistent naming conventions
- Modular component design

### Best Practices:
- Error handling at all levels
- Loading states for better UX
- Responsive design principles
- Accessibility considerations

This architecture provides a solid foundation for the MVP while maintaining flexibility for future enhancements and scalability improvements. 