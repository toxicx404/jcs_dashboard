import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';
import { Department } from './models/department.model';

// Optional: Initial Seeder
const seedData = async () => {
    try {
        const count = await Department.count();
        if (count === 0) {
            console.log("Database is empty. You can seed initial data here.");
            // Example:
            // await Department.bulkCreate([...]);
        }
    } catch (e) {
        console.error("Seeding error", e);
    }
};

const startServer = async () => {
  // Connect to MySQL
  await connectDB();
  
  // Check for seed
  await seedData();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer();