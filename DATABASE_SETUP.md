# Database Setup Guide

## Current Issue: MySQL Access Denied

You're getting this error:
```
Access denied for user 'root'@'localhost' (using password: YES)
```

This means your MySQL password in `backend/.env` is incorrect.

## Step-by-Step Fix

### Step 1: Find Your MySQL Password

**Option A: If you know your MySQL password**
- Use that password in the `.env` file

**Option B: If you forgot your MySQL password**
1. Open MySQL Workbench
2. Try to connect - if it fails, you'll need to reset the password
3. Or check if you have MySQL saved credentials somewhere

**Option C: Reset MySQL Password (if needed)**
1. Stop MySQL service
2. Start MySQL in safe mode
3. Reset password
4. Restart MySQL service

### Step 2: Update backend/.env File

1. Navigate to `backend` folder
2. Open `.env` file (or copy from `.env.example` if it doesn't exist)
3. Update the password:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=YOUR_ACTUAL_MYSQL_PASSWORD_HERE
DB_NAME=jcs_dashboard
```

**Important:** Replace `YOUR_ACTUAL_MYSQL_PASSWORD_HERE` with your actual MySQL root password.

### Step 3: Create the Database

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open the file: `database/sql/setup.sql`
4. Execute the entire script (click the lightning bolt icon or press Ctrl+Shift+Enter)
5. Verify the database was created:
   ```sql
   SHOW DATABASES LIKE 'jcs_dashboard';
   USE jcs_dashboard;
   SHOW TABLES;
   ```
   You should see `departments` and `events` tables.

### Step 4: Test Backend Connection

```bash
cd backend
npm start
```

You should see:
```
MySQL Database Connected Successfully.
Database Models Synced.
Server running on port 5000 in development mode
```

## Common MySQL Password Scenarios

### Default MySQL Installation
- **XAMPP**: Usually no password (empty string) or `root`
- **WAMP**: Usually no password (empty string)
- **MySQL Standalone**: Password set during installation
- **MySQL Workbench**: Check saved connections

### If Password is Empty
In `backend/.env`, use:
```env
DB_PASS=
```
(Leave it empty, no quotes)

### If You Need to Set a New Password
1. Connect to MySQL Workbench
2. Go to Server → Users and Privileges
3. Select `root@localhost`
4. Change password
5. Update `backend/.env` with new password

## Verification Checklist

- [ ] MySQL Server is running
- [ ] You can connect to MySQL Workbench
- [ ] `backend/.env` has correct `DB_PASS`
- [ ] Database `jcs_dashboard` exists (run setup.sql)
- [ ] Backend can connect (`npm start` works)

## Still Having Issues?

1. **Test MySQL connection manually:**
   - Open MySQL Workbench
   - Try connecting with your credentials
   - If it works there, use the same password in `.env`

2. **Check MySQL service is running:**
   - Press `Win + R`
   - Type `services.msc`
   - Find MySQL service
   - Make sure it's running

3. **Try connecting without password:**
   - Set `DB_PASS=` (empty) in `.env`
   - Some local MySQL installations have no password by default

4. **Check for typos:**
   - Make sure there are no extra spaces in `.env` file
   - Password should be on one line only

