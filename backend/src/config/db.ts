import { Sequelize } from 'sequelize';
import { config } from './env';

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database Connected Successfully.');
    
    // Sync models with database (only create tables if they don't exist)
    // Since tables are created via setup.sql, we don't use alter: true
    // This prevents foreign key constraint errors
    await sequelize.sync({ alter: false });
    console.log('Database Models Synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};