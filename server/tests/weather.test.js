import request from 'supertest';
import app from '../src/index.js';

describe('Weather API Endpoints', () => {

  describe('GET /api/weather/current/:id', () => {
    test('returns weather data', async () => {
      const id = 3026520;
      const response = await request(app).get(`/api/weather/current/${id}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', id);
    });
  });

  describe('GET /api/weather/forecast/:city', () => {
    test('returns forecast data', async () => {
      const city = 'London';
      const response = await request(app).get(`/api/weather/forecast/${city}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('city', city);
      expect(response.body).toHaveProperty('forecast');
      expect(Array.isArray(response.body.forecast)).toBe(true);
    });
  });

});
