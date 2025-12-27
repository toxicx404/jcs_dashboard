
import { sequelize } from '../config/db';
import '../models/partnership.model'; // Import models to ensure they are registered

const sync = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB. Syncing...');
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully! Schema should now include new columns.');
        process.exit(0);
    } catch (err) {
        console.error('Sync failed:', err);
        process.exit(1);
    }
};

sync();
