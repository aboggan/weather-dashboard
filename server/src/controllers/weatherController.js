// Sample controller to handle GET /api/weather/current/:city
// In the real app, fetch data from OpenWeatherMap API

const getCurrentWeather = (req, res) => {
    const city = req.params.city;
    // Mocked response
    res.json({
      city,
      temp: 25,
      description: 'Sunny'
    });
  };
  
  export { getCurrentWeather };
  