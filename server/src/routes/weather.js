import express from 'express';
import { getCurrentWeather } from '../controllers/weatherController.js';
import { getForecastWeather } from '../controllers/weatherController.js';

import weatherRateLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/current/:id', weatherRateLimiter, getCurrentWeather);

router.get('/forecast/:city', getForecastWeather);

export default router;
