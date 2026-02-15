# JCS Dashboard 🌿

The **JCS Dashboard** is a comprehensive full-stack web application designed for managing and visualizing sustainability initiatives, events, and department contributions within an educational institution. It features role-based access control, event management, leaderboards, and detailed reporting.

## 🚀 Features

### Core Functionality
- **Event Management**: Create, update, delete, and view sustainability events.
- **Department Leaderboard**: Visual ranking of departments based on their contributions and credits.
- **Reports & Analytics**: Detailed breakdown of events, credits, and participation metrics.
- **Partnerships**: Manage external partnerships and collaborations.
- **Role-Based Access Control (RBAC)**: secure access for Admins, Coordinators, Users, and Viewers.

### 🛡️ Security Enhancements
This project implements robust security measures to protect data and infrastructure:
- **Authentication**: Secure JWT-based authentication with `agron2` password hashing support (via `bcrypt`).
- **Authorization**: Granular RBAC middleware protecting all sensitive routes.
- **Infrastructure Hardening**:
    - **Helmet**: Sets secure HTTP headers (HSTS, X-Frame-Options, etc.).
    - **Rate Limiting**: Protects against brute-force and DoS attacks.
    - **HPP**: Prevents HTTP Parameter Pollution attacks.
    - **CORS**: Configured for secure cross-origin resource sharing.
- **Input Validation**: Strict validation and sanitization using `express-validator` to prevent XSS and SQL Injection.
- **Secure Database Access**: All queries use parameterized inputs or Sequelize ORM methods.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (presumed based on modern standards) / CSS Modules
- **State Management**: React Context API
- **Routing**: React Router
- **UI Libraries**: Framer Motion (Animations), Recharts (Charts), Lucide React (Icons)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize
- **Security**: Helmet, Express Rate Limit, HPP, JSON Web Tokens (JWT), Bcrypt

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server

### 1. Database Setup
1. Create a MySQL database named `jcs_dashboard`.
2. Run the `setup.sql` script located in `database/sql/setup.sql` to create tables.
3. (Optional) Run `mock_data.sql` to seed initial data.

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in `backend/` based on `.env.example`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=jcs_dashboard
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:8000
```

Start the backend server:
```bash
# Development Mode
npm run dev

# Production Build
npm run build
npm start
```
*The backend runs on `http://localhost:5000` by default.*

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*The frontend runs on `http://localhost:8000` by default.*

## 📜 Scripts

### Backend
- `npm start`: Runs the compiled JS from `dist/` (or directly via `ts-node` in dev setup).
- `npm run dev`: Runs the server with `nodemon` for hot-reloading.
- `npm run build`: Compiles TypeScript to JavaScript.

### Frontend
- `npm run dev`: Starts Vite development server on port 8000.
- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build locally.

## 🤝 Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---
**JCS Dashboard** &copy; 2026. All rights reserved.
