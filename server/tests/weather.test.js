import request from 'supertest';
import app from '../src/index.js';
import mongoose from 'mongoose';

describe('Weather API Endpoints', () => {
  describe('GET /api/weather/current/:id', () => {
    test('returns weather data', async () => {
      const id = 3026520;
      const response = await request(app).get(`/api/weather/current/${id}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', id);
    });
  });

  describe('GET /api/weather/forecast/:id', () => {
    test('returns forecast data', async () => {
      const id = 2643743; // London city ID
      const response = await request(app).get(`/api/weather/forecast/${id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('city');
      expect(typeof response.body.city).toBe('string');
      expect(response.body.city.toLowerCase()).toContain('london');
      expect(response.body).toHaveProperty('forecast');
      expect(Array.isArray(response.body.forecast)).toBe(true);
      expect(response.body.forecast.length).toBeGreaterThan(0);
      expect(response.body.forecast[0]).toHaveProperty('date');
      expect(response.body.forecast[0]).toHaveProperty('temp');
      expect(response.body.forecast[0]).toHaveProperty('description');
    });
  });

  describe('GET /api/weather/history/:uuid', () => {
    test('returns user history', async () => {
      const uuid = '1234abcd-5678-efgh-ijkl-9876mnopqrst';
      const response = await request(app).get(`/api/weather/history/${uuid}`);
      
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/weather/history', () => {
    test('saves new history entry', async () => {
      const newEntry = {
        id: 5128581,
        name: 'New York',
        uuid: '1234abcd-5678-efgh-ijkl-9876mnopqrst'
      };
      const response = await request(app)
        .post('/api/weather/history')
        .send(newEntry);
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'History saved');
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
