
import { sequelize } from '../config/db';
import { Partnership } from '../models/partnership.model';

const checkPartnerships = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        const partnerships = await Partnership.findAll();
        console.log(`Found ${partnerships.length} partnerships.`);
        console.log(JSON.stringify(partnerships, null, 2));
    } catch (error) {
        console.error('Error querying database:', error);
    } finally {
        await sequelize.close();
    }
};

checkPartnerships();
