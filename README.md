# Weather Dashboard

## Overview

Weather Dashboard is a full-stack application that allows users to search for weather by city, view current conditions, see a 5-day forecast, manage favorite cities, and access search history.

You can see the live version here: [Weather Dashboard](https://weather-dashboard-peach-two.vercel.app/).

## Features

- Search for weather by city
- Display current weather (temperature, humidity, description)
- 5-day forecast
- Manage favorite cities
- Search history

## Tech Stack

- **Frontend:** React (Hooks)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **API:** OpenWeatherMap

---

## Project Setup and Installation

### Backend

```bash
cd server
npm install
cp .env.example .env
```

Configure the environment variables as specified in **Environment Variables**.

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on: `http://localhost:5173/`

---

## API Documentation

### Endpoints

- `GET /api/weather/current/:city` - Returns current weather for a city.
- `GET /api/weather/forecast/:city` - Returns a 5-day forecast.
- `POST /api/weather/favorites` - Add a city to favorites.
- `GET /api/weather/favorites` - Get favorite cities.
- `DELETE /api/weather/favorites/:id` - Remove a city from favorites.
- `GET /api/weather/history` - Get search history.

---

## Database Setup

This project uses MongoDB and Mongoose.

- Install MongoDB locally or use MongoDB Atlas.
- Define the connection string in `.env`:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.hd35quj.mongodb.net/my_weather_dashboard?retryWrites=true&w=majority&appName=Cluster0
# Example: mongodb+srv://user123:myPassword@cluster0.hd35quj.mongodb.net/my_weather_dashboard?retryWrites=true&w=majority&appName=Cluster0
```

- Mongoose models are located in `server/src/models` and include:
  - `FavoriteCity.js`
  - `WeatherHistory.js`

No schema migrations are needed as in relational databases.

---

## Environment Variables

### Server (.env)

```
OPENWEATHER_API_KEY=your_openweather_api_key
# Example: 07b48d7c72997475d4d5be252313eddc

CLIENT_URL=https://your-deployed-client-url/
# Example: https://weather-dashboard-peach-two.vercel.app/

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.hd35quj.mongodb.net/my_weather_dashboard?retryWrites=true&w=majority&appName=Cluster0
# Example: mongodb+srv://user123:myPassword@cluster0.hd35quj.mongodb.net/my_weather_dashboard?retryWrites=true&w=majority&appName=Cluster0

ALLOWED_ORIGINS=https://your-deployed-client-url,https://another-allowed-origin,http://localhost:5173
# Example: https://my-weather-dashboard.vercel.app,https://weather-dashboard-peach-two.vercel.app,http://localhost:5173
```

### Client (.env)

```
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key
# Example: 07b48d7c72997475d4d5be252313eddc

VITE_API_URL=http://localhost:4000
```

---

## Running Tests

### Backend

```bash
cd server
npm run test
```

### Frontend

```bash
cd client
npm test
```

---

## Known Limitations

- No real user authentication implemented (UUID simulated).
- The search bar uses a local JSON file for suggestions instead of the OpenWeatherMap autocomplete endpoint, which would be a more scalable option but is not available in the free tier.
- Limited to free tier OpenWeatherMap API call limits.
- Users are identified by local UUID only (no persistent user accounts).
