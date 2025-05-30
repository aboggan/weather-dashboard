import axios from 'axios';

// Controller to handle GET /api/weather/current/:city
const getCurrentWeather = async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    const weatherData = {
      city: response.data.name,
      temp: response.data.main.temp,
      description: response.data.weather[0].description
    };

    res.status(200).json(weatherData);
  } catch (error) {
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