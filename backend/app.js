import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import taskRoutes from './routes/tasks.js ';

// Create express app
const app = express();

// Middleware

// Enable Cross Origin Resource Sharing for all requests
app.use(cors());

// Secure Express app by setting various HTTP headers
app.use(helmet());

// Log HTTP requests
app.use(morgan('dev'));

// Parse JSON request body
app.use(json());

// Routes
app.use('/api/tasks', taskRoutes);

// root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Task Manager API!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Not found handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;