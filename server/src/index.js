import express from 'express';
import config from './config/config.js';
import corsMiddleware from './middleware/corsMiddleware.js';
import weatherRoutes from './routes/weather.js';
import connectDB from './models/db.js';
const app = express();
app.set('trust proxy', 1);
connectDB();
// Middlewares
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use('/api/weather', weatherRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Weather API is running');
});

// Start server only if not imported by tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

export default app;
