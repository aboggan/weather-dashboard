import axios from 'axios';
import WeatherHistory from '../models/WeatherHistory.js';

// Simple cache to avoid repeated calls
const cache = {};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// GET /api/weather/current/:id
const getCurrentWeather = async (req, res) => {
  const id = req.params.id;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const now = Date.now();
  if (cache[id] && (now - cache[id].timestamp < CACHE_TTL_MS)) {
    console.log('Serving current weather from cache');
    return res.status(200).json(cache[id].data);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    const weatherData = response.data;
    weatherData.currentDate = new Date().toISOString().split('T')[0];

    // Save to cache
    cache[id] = {
      timestamp: now,
      data: weatherData
    };

    res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

// GET /api/weather/forecast/:city
const getForecastWeather = async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    const forecastData = response.data.list.slice(0, 5).map((entry) => ({
      date: entry.dt_txt,
      temp: entry.main.temp,
      description: entry.weather[0].description
    }));

    res.status(200).json({
      city: response.data.city.name,
      forecast: forecastData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
};

// GET /api/weather/history/:uuid
const getUserHistory = async (req, res) => {
  const { uuid } = req.params;

  const now = Date.now();
  const cacheKey = `history_${uuid}`;
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_TTL_MS)) {
    console.log('Serving user history from cache');
    return res.status(200).json(cache[cacheKey].data);
  }

  try {
    const history = await WeatherHistory.find({ user_uuid: uuid })
      .sort({ searched_at: -1 })
      .limit(10);

    // Save to cache
    cache[cacheKey] = {
      timestamp: now,
      data: history
    };

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Error fetching history' });
  }
};

// POST /api/weather/history
const addUserHistory = async (req, res) => {
  const { id, name, uuid } = req.body;
  try {
    const entry = new WeatherHistory({
      user_uuid: uuid,
      city_name: name,
      city_id: id
    });
    await entry.save();

    // Invalidate cache entry for this user
    const cacheKey = `history_${uuid}`;
    delete cache[cacheKey];

    res.status(201).json({ message: 'History saved' });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Error saving history' });
  }
};

// DELETE /api/weather/history/:uuid
const deleteUserHistory = async (req, res) => {
  const { uuid } = req.params;
  try {
    await WeatherHistory.deleteMany({ user_uuid: uuid });

    // Limpiar cache
    const cacheKey = `history_${uuid}`;
    delete cache[cacheKey];

    res.status(200).json({ message: 'History cleared' });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ error: 'Error deleting history' });
  }
};


export {
  getCurrentWeather,
  getForecastWeather,
  getUserHistory,
  addUserHistory,
  deleteUserHistory
};
