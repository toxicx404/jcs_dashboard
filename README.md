# JCS Sustainability Dashboard

A full-stack application for managing sustainability events and tracking SDG (Sustainable Development Goals) progress.

## Project Structure

```
Website-main/
├── backend/          # Backend API (Node.js/Express/Sequelize)
│   ├── src/
│   ├── package.json  # Backend dependencies
│   └── .env          # Backend environment variables
├── frontend/         # Frontend React application
│   ├── src/
│   ├── package.json  # Frontend dependencies
│   └── .env          # Frontend environment variables
└── database/
    └── sql/
        └── setup.sql # MySQL database setup
```

## Quick Start

### 1. Install Dependencies

**Option A: Install all at once (from root)**
```bash
npm run install:all
```

**Option B: Install separately**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Set Up Database

1. Run the SQL setup script in MySQL Workbench:
   ```sql
   -- Open database/sql/setup.sql and execute it
   ```

2. Configure backend environment:
   ```bash
   cd backend
   copy .env.example .env
   # Edit .env with your MySQL credentials
   ```

### 3. Run the Application

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

**Or from root:**
```bash
npm run dev:backend   # Terminal 1
npm run dev:frontend   # Terminal 2
```

## Available Scripts

### Root Level
- `npm run install:all` - Install dependencies for both backend and frontend
- `npm run dev:backend` - Start backend development server
- `npm run dev:frontend` - Start frontend development server
- `npm run build:backend` - Build backend for production
- `npm run build:frontend` - Build frontend for production

### Backend (`cd backend`)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - Compile TypeScript to JavaScript

### Frontend (`cd frontend`)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=jcs_dashboard
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
GEMINI_API_KEY=your_gemini_api_key_here
```

## Database Setup

See `database/sql/README.md` for detailed database setup instructions.

## Technology Stack

- **Backend**: Node.js, Express, Sequelize, MySQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Database**: MySQL

## License

Private project
