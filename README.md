# EduStack - Course Material Management System

Full-stack web application for faculty to upload/manage course materials and students to browse/download them.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MongoDB

**Option A - MongoDB Atlas (Recommended, 5 min):**
1. Create free account: https://www.mongodb.com/cloud/atlas/register
2. Create M0 free cluster
3. Create database user (username: edustack, password: edustack123)
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string
6. Update `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://edustack:edustack123@cluster0.xxxxx.mongodb.net/edustack?retryWrites=true&w=majority
```

**Option B - Local MongoDB:**
1. Install: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. `.env` already configured for localhost

### 3. Seed Database
```bash
cd backend
node seed.js
```

### 4. Start Backend
```bash
npm start
```
Server runs on http://localhost:5000

### 5. Open Frontend
Open `index.html` in your browser

## Demo Accounts

**Faculty:** `faculty@edustack.com` / `faculty123`  
**Student:** `student@edustack.com` / `student123`

## Features

**Faculty:** Create courses, upload materials (PDF/PPT/DOC/ZIP), view stats, manage uploads  
**Student:** Browse courses, search materials, download files, mark useful, submit feedback

## Project Structure

```
hackathon/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js    # JWT auth
│   ├── models/               # User, Course, Material schemas
│   ├── routes/               # API endpoints
│   ├── uploads/              # Uploaded files
│   ├── .env                  # Environment config
│   ├── server.js             # Express server
│   ├── seed.js               # Sample data
│   └── package.json          # Dependencies
└── index.html                # Frontend SPA
```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course (faculty)
- `GET /api/materials` - List materials
- `POST /api/materials/upload` - Upload material (faculty)
- `PUT /api/materials/:id/download` - Track download
- `POST /api/materials/:id/feedback` - Add feedback
- `GET /api/dashboard/faculty` - Faculty stats
- `GET /api/dashboard/student` - Student stats

## Troubleshooting

**MongoDB connection error:** Check if MongoDB is running or Atlas connection string is correct  
**Port in use:** Change PORT in `backend/.env`  
**Login fails:** Verify backend is running on port 5000

---
Demo - https://youtu.be/qv9yYe5RTJs

Built for educational purposes
