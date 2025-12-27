# Database Setup Guide

## Overview

This folder contains the complete database setup script for the JCS Dashboard application.

## Files

- **setup.sql** - Complete database setup with all tables (no mock data)

## Database Schema

### Core Tables

1. **departments** - Department/School information
   - Stores department details, coordinators, and statistics
   - Auto-calculated fields: `totalCredits`, `eventCount`

2. **events** - Sustainability events
   - Stores all event submissions with full details
   - Links to departments via foreign key
   - Supports multiple SDGs per event (JSON)

### User Management Tables

3. **users** - User accounts (for future authentication)
   - Supports Admin, Coordinator, Viewer roles
   - Links to departments for coordinators
   - Password hashing ready

4. **notifications** - User notifications
   - System notifications for users
   - Read/unread tracking

### Supporting Tables

5. **file_uploads** - File tracking
   - Tracks all uploaded files
   - Links to events and users
   - Supports multiple file types

6. **audit_logs** - Change tracking
   - Logs all important system changes
   - Tracks who, what, when, and changes made

7. **event_comments** - Event review comments
   - Comments/notes on events during review
   - Supports internal and public comments

8. **settings** - System configuration
   - Key-value settings storage
   - Supports different data types

## Setup Instructions

### Option 1: MySQL Workbench (Recommended)

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/sql/setup.sql`
4. Execute the entire script (F5 or Run button)
5. Verify tables are created in the Schema panel

### Option 2: Command Line

```bash
mysql -u root -p < database/sql/setup.sql
```

Enter your MySQL root password when prompted.

### Option 3: Manual Execution

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Copy and paste the contents of `setup.sql`

3. Verify:
   ```sql
   USE jcs_dashboard;
   SHOW TABLES;
   ```

## Important Notes

### ⚠️ Warning: This Script Drops Existing Database

The script uses `DROP DATABASE IF EXISTS` which will **delete all existing data**. 

**Before running:**
- Backup your data if needed
- Ensure you're ready to start fresh

### Foreign Key Relationships

- `events.departmentId` → `departments.id` (CASCADE delete)
- `users.departmentId` → `departments.id` (SET NULL on delete)
- `file_uploads.eventId` → `events.id` (CASCADE delete)
- `file_uploads.uploadedBy` → `users.id` (SET NULL on delete)
- `audit_logs.userId` → `users.id` (SET NULL on delete)
- `notifications.userId` → `users.id` (CASCADE delete)
- `event_comments.eventId` → `events.id` (CASCADE delete)
- `event_comments.userId` → `users.id` (SET NULL on delete)
- `settings.updatedBy` → `users.id` (SET NULL on delete)

### Indexes

All tables have appropriate indexes for:
- Primary keys
- Foreign keys
- Frequently queried fields
- Search fields

## Table Details

### departments
- **Purpose**: Store department/school information
- **Key Fields**: `code` (unique), `coordinatorName`, `totalCredits`, `eventCount`
- **Auto-calculated**: Credits and event counts are calculated from events

### events
- **Purpose**: Store sustainability event submissions
- **Key Fields**: `title`, `departmentId`, `status`, `credits`, `sdgs` (JSON)
- **Status Flow**: Draft → Submitted → Under Review → Approved/Rejected

### users
- **Purpose**: User authentication and authorization (future)
- **Key Fields**: `username`, `email`, `role`, `departmentId`
- **Roles**: Admin (full access), Coordinator (department access), Viewer (read-only)

### file_uploads
- **Purpose**: Track uploaded files
- **Key Fields**: `filename`, `filePath`, `uploadedBy`, `eventId`
- **Types**: Event images, proof documents, other files

### audit_logs
- **Purpose**: Track system changes for auditing
- **Key Fields**: `action`, `entityType`, `entityId`, `oldValues`, `newValues`
- **Use Cases**: Track who changed what and when

### notifications
- **Purpose**: User notifications
- **Key Fields**: `userId`, `title`, `message`, `isRead`
- **Types**: Info, success, warning, error

### event_comments
- **Purpose**: Comments on events during review
- **Key Fields**: `eventId`, `userId`, `comment`, `isInternal`
- **Use**: Admin feedback, internal notes

### settings
- **Purpose**: System-wide configuration
- **Key Fields**: `keyName` (unique), `value`, `type`
- **Types**: String, number, boolean, JSON

## Next Steps

After running setup.sql:

1. **Configure Backend Environment:**
   ```bash
   cd backend
   copy .env.example .env
   # Update database credentials in .env
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Verify Connection:**
   - Backend should connect successfully
   - Check console for "MySQL Database Connected Successfully"

4. **Add Initial Data:**
   - Use the application to add departments and events
   - Or create a separate seed script if needed

## Troubleshooting

### Error: Access Denied
- Verify MySQL credentials in `backend/.env`
- Ensure MySQL user has CREATE/DROP DATABASE privileges

### Error: Foreign Key Constraint
- Ensure tables are created in order (departments before events)
- Check that referenced IDs exist

### Error: Table Already Exists
- The script drops the database first, so this shouldn't happen
- If it does, manually drop: `DROP DATABASE jcs_dashboard;`

## Future Enhancements

Consider adding these tables if needed:
- `event_attachments` - Multiple files per event
- `department_settings` - Per-department configuration
- `credit_history` - Credit change tracking
- `reports` - Saved report configurations
- `email_templates` - Notification templates

