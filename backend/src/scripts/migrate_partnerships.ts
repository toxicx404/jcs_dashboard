
import { sequelize } from '../config/db';

const runMigration = async () => {
    try {
        console.log('Starting partnerships migration...');

        // 1. Update existing nulls to '' or 'N/A' to avoid error when modifying column
        console.log('Updating existing null values...');
        await sequelize.query("UPDATE partnerships SET website = 'N/A' WHERE website IS NULL");
        await sequelize.query("UPDATE partnerships SET linkedin = 'N/A' WHERE linkedin IS NULL");

        // 2. Modify columns to NOT NULL
        console.log('Setting columns to NOT NULL...');
        await sequelize.query('ALTER TABLE partnerships MODIFY website VARCHAR(255) NOT NULL');
        await sequelize.query('ALTER TABLE partnerships MODIFY linkedin VARCHAR(255) NOT NULL');

        console.log('Partnership migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

runMigration();
