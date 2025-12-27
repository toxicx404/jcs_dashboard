# Troubleshooting Guide

## Common Issues and Solutions

### 1. Backend: MySQL Access Denied Error

**Error:**
```
Access denied for user 'root'@'localhost' (using password: YES)
```

**Solution:**
1. Check your MySQL password in `backend/.env` file
2. Make sure MySQL server is running
3. Verify the database exists (run `database/sql/setup.sql` in MySQL Workbench)
4. Update `backend/.env` with correct credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_actual_mysql_password
DB_NAME=jcs_dashboard
```

**Steps to fix:**
1. Open `backend/.env` file
2. Update `DB_PASS` with your actual MySQL root password
3. If you don't know your MySQL password:
   - Open MySQL Workbench
   - Try connecting with your usual password
   - Or reset MySQL password if needed
4. Make sure the database `jcs_dashboard` exists (run setup.sql)

### 2. Frontend: 'vite' is not recognized

**Error:**
```
'vite' is not recognized as an internal or external command
```

**Solution:**
Install frontend dependencies:

```bash
cd frontend
npm install
```

Then try again:
```bash
npm run dev
```

### 3. Database Not Found

**Error:**
```
Unknown database 'jcs_dashboard'
```

**Solution:**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/sql/setup.sql`
4. Execute the entire script
5. Verify database was created:
   ```sql
   SHOW DATABASES LIKE 'jcs_dashboard';
   ```

### 4. Port Already in Use

**Error:**
```
Port 5000 is already in use
```

**Solution:**
- Change port in `backend/.env`:
  ```env
  PORT=5001
  ```
- Or stop the process using port 5000

### 5. Module Not Found Errors

**Solution:**
Delete node_modules and reinstall:

```bash
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Frontend
cd ../frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## Quick Setup Checklist

- [ ] MySQL Server is installed and running
- [ ] Database `jcs_dashboard` is created (run setup.sql)
- [ ] `backend/.env` file exists with correct MySQL credentials
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Backend server starts without errors (`cd backend && npm run dev`)
- [ ] Frontend server starts without errors (`cd frontend && npm run dev`)

## Testing Database Connection

You can test your MySQL connection manually:

1. Open MySQL Workbench
2. Create a new connection if needed
3. Test connection with your credentials
4. Once connected, run:
   ```sql
   USE jcs_dashboard;
   SHOW TABLES;
   ```
5. You should see `departments` and `events` tables

## Getting Help

If issues persist:
1. Check MySQL server is running: `services.msc` → MySQL
2. Verify MySQL credentials in `backend/.env`
3. Check database exists: Run `database/sql/setup.sql`
4. Reinstall dependencies in both backend and frontend

