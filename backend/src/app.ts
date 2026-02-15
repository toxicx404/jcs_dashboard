/// <reference path="./types/hpp.d.ts" />
import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

import helmet from 'helmet';
import hpp from 'hpp';
import { apiLimiter } from './middlewares/rateLimiter';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(hpp());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Configure this in .env for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}) as any);
app.use('/api', apiLimiter); // Apply rate limiting to all API routes

// Body Parsing
app.use(express.json({ limit: '10kb' }) as any); // Limit body size

// Static Uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')) as any);

// Routes
app.use('/api', routes);

// Root Health Check
app.get('/', (req, res) => {
  res.send('JCS Dashboard API is running.');
});

export default app;