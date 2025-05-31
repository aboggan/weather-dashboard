import axios from 'axios';
// Simple cache to avoid infinite requests
const cache = {};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// GET /api/weather/current/:id
const getCurrentWeather = async (req, res) => {
  const id = req.params.id;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const now = Date.now();
  if (cache[id] && (now - cache[id].timestamp < CACHE_TTL_MS)) {
    console.log('Serving from cache');
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


// Controller to handle GET /api/weather/forecast/:city
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

export { getCurrentWeather, getForecastWeather };