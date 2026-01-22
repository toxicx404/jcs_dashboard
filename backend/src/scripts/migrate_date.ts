
import { sequelize } from '../config/db';

const runMigration = async () => {
    try {
        console.log('Starting migration...');

        // 1. Add Columns
        console.log('Adding fromDate and toDate columns...');
        await sequelize.query('ALTER TABLE events ADD COLUMN fromDate VARCHAR(50) NOT NULL AFTER departmentName');
        await sequelize.query('ALTER TABLE events ADD COLUMN toDate VARCHAR(50) NOT NULL AFTER fromDate');

        // 2. copy data
        console.log('Migrating data...');
        await sequelize.query('UPDATE events SET fromDate = date, toDate = date');

        // 3. Drop old column
        console.log('Dropping date column...');
        await sequelize.query('ALTER TABLE events DROP COLUMN date');

        // 4. Add Indexes
        console.log('Adding indexes...');
        await sequelize.query('CREATE INDEX idx_fromDate ON events(fromDate)');
        await sequelize.query('CREATE INDEX idx_toDate ON events(toDate)');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

runMigration();
