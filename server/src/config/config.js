import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 4000,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.MONGODB_URI,
  googleClientId: process.env.GOOGLE_CLIENT_ID
};
