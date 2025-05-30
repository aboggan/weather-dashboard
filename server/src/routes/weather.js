import express from 'express';
import { getCurrentWeather } from '../controllers/weatherController.js';
import { getForecastWeather } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/current/:city', getCurrentWeather);

router.get('/forecast/:city', getForecastWeather);

export default router;
