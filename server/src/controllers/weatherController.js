import axios from 'axios';
import WeatherHistory from '../models/WeatherHistory.js';
import FavoriteCity from '../models/FavoriteCity.js';

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

    // Clear cache
    const cacheKey = `history_${uuid}`;
    delete cache[cacheKey];

    res.status(200).json({ message: 'History cleared' });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ error: 'Error deleting history' });
  }
};

// POST /api/weather/favorites
const addFavoriteCity = async (req, res) => {
  const { user_uuid, city_name, city_id } = req.body;

  if (!user_uuid || !city_name || !city_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newFavorite = new FavoriteCity({
      user_uuid,
      city_name,
      city_id
    });
    await newFavorite.save();

    // Invalidate cache for this user's favorites
    const cacheKey = `favorites_${user_uuid}`;
    delete cache[cacheKey];

    res.status(201).json({ message: 'City added to favorites' });
  } catch (error) {
    console.error('Error saving favorite:', error);
    res.status(500).json({ error: 'Error saving favorite' });
  }
};

// GET /api/weather/favorites/:uuid
const getFavoriteCities = async (req, res) => {
  const { uuid } = req.params;

  if (!uuid) {
    return res.status(400).json({ error: 'Missing user_uuid' });
  }

  const now = Date.now();
  const cacheKey = `favorites_${uuid}`;
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_TTL_MS)) {
    console.log('Serving user favorites from cache');
    return res.status(200).json(cache[cacheKey].data);
  }

  try {
    const favorites = await FavoriteCity.find({ user_uuid: uuid }).sort({ added_at: -1 });

    // Save to cache
    cache[cacheKey] = {
      timestamp: now,
      data: favorites
    };

    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};


// DELETE /api/weather/favorites/:id
const deleteFavoriteCity = async (req, res) => {
  const { id } = req.params;

  try {
    const favorite = await FavoriteCity.findById(id);
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await FavoriteCity.findByIdAndDelete(id);

    // Invalidate cache for this user's favorites
    const cacheKey = `favorites_${favorite.user_uuid}`;
    delete cache[cacheKey];

    res.status(200).json({ message: 'Favorite deleted' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Error deleting favorite' });
  }
};

export {
  getCurrentWeather,
  getForecastWeather,
  getUserHistory,
  addUserHistory,
  deleteUserHistory,
  addFavoriteCity,
  getFavoriteCities,
  deleteFavoriteCity
};
