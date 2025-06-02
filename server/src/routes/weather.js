import express from 'express';
import {
  getCurrentWeather,
  getForecastWeather,
  getUserHistory,
  addUserHistory,
  deleteUserHistory
} from '../controllers/weatherController.js';
import weatherRateLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

// Weather endpoints
router.get('/current/:id', weatherRateLimiter, getCurrentWeather);
router.get('/forecast/:city', getForecastWeather);

// History endpoints
router.get('/history/:uuid', weatherRateLimiter, getUserHistory);
router.post('/history', weatherRateLimiter, addUserHistory);
router.delete('/history/:uuid', weatherRateLimiter, deleteUserHistory);
export default router;
