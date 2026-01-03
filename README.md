# GlobeTrotter - Travel Planning Application

A comprehensive travel planning platform for Odoo Hackathon 2026 with AI-powered itinerary optimization and budget intelligence.

---

## 🚀 Quick Setup (Local)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Create .env
echo "FLASK_APP=app.py
FLASK_ENV=development
SEED_DATABASE=true
GEOAPIFY_API_KEY=742301defa8b4cacad9a7fbed2ed30ae" > .env

python app.py
```
Backend: `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend: `http://localhost:5173`

---

## ☁️ Deploy to Render

### Backend Deployment

1. **Create New Web Service** on Render
   - Connect GitHub repository
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`

2. **Environment Variables**:
   ```
   FLASK_APP=app.py
   FLASK_ENV=production
   SEED_DATABASE=true
   GEOAPIFY_API_KEY=742301defa8b4cacad9a7fbed2ed30ae
   ```

3. **Get Backend URL**: `https://your-backend.onrender.com`

### Frontend Deployment

1. **Create New Static Site** on Render
   - Connect GitHub repository
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

2. **Environment Variable**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

3. **Important**: After adding env var, click **Manual Deploy** to rebuild

### Connect Frontend to Backend

1. Update `frontend/src/services/api.js` (already configured):
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   ```

2. Deploy backend first, then frontend with backend URL in `VITE_API_URL`

3. Backend CORS is configured for all origins (`*`)

---

## 🛠️ Tech Stack

**Frontend**: React 18, TailwindCSS, Vite  
**Backend**: Flask, SQLite, Flask-CORS  
**Features**: AI Optimization, Budget Intelligence, Geoapify Search

---

## 📁 Project Structure

```
globetrotter/
├── frontend/          # React app
│   └── src/
│       ├── pages/     # Page components
│       ├── components/# UI components
│       └── services/  # API services
├── backend/           # Flask API
│   └── src/
│       ├── controllers/# Request handlers
│       ├── models/    # Data models
│       └── routes/    # API routes
└── database/          # SQL schema & seed data
```

---

## 🔑 Environment Variables

**Backend (.env)**:
```
FLASK_APP=app.py
FLASK_ENV=development
SEED_DATABASE=true
GEOAPIFY_API_KEY=742301defa8b4cacad9a7fbed2ed30ae
```

**Frontend (.env)**:
```
VITE_API_URL=http://localhost:5000/api  # Local
# VITE_API_URL=https://your-backend.onrender.com/api  # Production
```

---

## 🌐 API Endpoints

Base: `/api`

- `POST /users` - Register
- `GET /trips` - Get trips
- `POST /trips` - Create trip
- `GET /cities?search=query` - Search cities
- `GET /cities/search?q=query` - Real-time search (Geoapify)
- `POST /trips/:id/ai/optimize` - AI optimization
- `GET /trips/:id/ai/budget-analysis` - Budget analysis

---

## ✅ Features

- Multi-city trip planning
- City & activity search (Geoapify integration)
- Budget management with AI intelligence
- AI itinerary optimization
- Calendar view
- Public itinerary sharing
- Admin dashboard
- Relational database (SQLite with JOINs, foreign keys)

---

## 🎯 Hackathon Submission

**Status**: ✅ Ready

- All 13 required features implemented
- AI-powered enhancements
- Real-time data (no static JSON)
- Proper relational database usage
- Clean, professional UI

---

**Developed for Odoo Hackathon 2026**
