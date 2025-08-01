# Impulse Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- Git

### 1. Clone and Setup
```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd Impulse

# Run the automated setup script
./setup.sh
```

### 2. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```
✅ Backend running on http://localhost:8000

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

### 3. Demo the Application

1. **Open** http://localhost:5173 in your browser
2. **Click** "🚀 Start Learning" 
3. **Answer** physics questions
4. **Watch** adaptive difficulty in action
5. **See** motivational messages appear

## 🎯 Demo Features

### Core Functionality
- ✅ Welcome page with app introduction
- ✅ Session-based learning (no login required)
- ✅ Multiple-choice physics questions
- ✅ Real-time feedback with explanations
- ✅ Adaptive difficulty adjustment
- ✅ Motivational nudges
- ✅ Progress tracking

### Technical Highlights
- ✅ React frontend with TailwindCSS
- ✅ FastAPI backend with SQLite
- ✅ Adaptive learning algorithm
- ✅ RESTful API design
- ✅ Responsive UI design

## 📊 Sample Questions Included

The MVP includes 5 sample physics questions covering:
- **Mechanics**: Force units, work calculations
- **Kinematics**: Acceleration, projectile motion
- **Energy**: Conservation principles

## 🔧 Troubleshooting

### Backend Issues
```bash
# Check Python version
python3 --version

# Reinstall dependencies
cd backend
pip install -r requirements.txt

# Reset database
rm impulse.db
# Restart backend to recreate tables
```

### Frontend Issues
```bash
# Check Node.js version
node --version

# Clear cache and reinstall
cd frontend
npm cache clean --force
npm install
```

### Port Conflicts
```bash
# Check if ports are in use
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Kill processes if needed
kill -9 <PID>
```

## 📚 Next Steps

### For Development
1. Add more physics questions to `backend/main.py`
2. Enhance the adaptive algorithm
3. Add user authentication
4. Implement more subjects

### For Production
1. Deploy to cloud platform
2. Add PostgreSQL database
3. Implement user accounts
4. Add analytics dashboard

## 🎓 Educational Value

This MVP demonstrates:
- **Adaptive Learning**: Questions adjust to student performance
- **Immediate Feedback**: Students learn from mistakes instantly
- **Motivation**: Encouraging messages maintain engagement
- **Progress Tracking**: Visual feedback on learning progress

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the detailed documentation in `/docs`
3. Examine the code comments for implementation details

---

**Happy Learning! 🚀**

The Impulse MVP is ready for demonstration and further development. 