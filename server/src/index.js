import express from 'express';
import config from './config/config.js';
import corsMiddleware from './middleware/corsMiddleware.js';
import weatherRoutes from './routes/weather.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use('/api/weather', weatherRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Weather API is running');
});

// Start server
app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
