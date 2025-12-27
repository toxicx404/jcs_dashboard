import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();

// Middlewares
app.use(cors() as any);
app.use(express.json() as any);

// Static Uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')) as any);

// Routes
app.use('/api', routes);

// Root Health Check
app.get('/', (req, res) => {
  res.send('JCS Dashboard API is running.');
});

export default app;