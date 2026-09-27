import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRoutes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    app: 'FridgeAI Engine API',
    description: 'AI-Powered Fridge-to-Meal Planner for Solo Dwellers',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: [
      '/api/auth',
      '/api/inventory',
      '/api/scan',
      '/api/recipes',
      '/api/meals',
      '/api/grocery',
      '/api/user',
    ],
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

import { DBService } from './services/dbService';

// Start Server
const startServer = async () => {
  await connectDB();
  await DBService.seedMongoIfEmpty();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 FridgeAI Server running on port ${PORT}`);
    console.log(`📡 Base URL: http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎯 Mode: Zero-Waste Solo-Dweller Optimizer Active`);
    console.log(`=======================================================`);
  });
};

startServer();

export default app;
