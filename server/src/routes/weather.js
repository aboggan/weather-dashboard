import express from 'express';
import {
    getCurrentWeather,
    getForecastWeather,
    getUserHistory,
    addUserHistory,
    deleteUserHistory, 
    addFavoriteCity, 
    getFavoriteCities, 
    deleteFavoriteCity
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

// Favicon endpoint

router.post('/favorites', addFavoriteCity);
router.get('/favorites/:uuid', getFavoriteCities);
router.delete('/favorites/:uuid/:cityId', deleteFavoriteCity);

export default router;
