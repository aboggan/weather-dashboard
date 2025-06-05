import request from 'supertest';
import nock from 'nock';
import app from '../src/index.js';
import mongoose from 'mongoose';
import FavoriteCity from '../src/models/FavoriteCity.js';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  process.env.OPENWEATHER_API_KEY = 'test-key';
});

beforeEach(() => {
  nock.cleanAll();
});

afterAll(async () => {
  nock.restore();
  await mongoose.connection.close();
});

describe('Weather API Endpoints', () => {
  describe('GET /api/weather/current/:id', () => {
    test('returns weather data', async () => {
      const id = 3026520;
      const mockWeather = { id, name: 'Test City', weather: [] };

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, mockWeather);

      const response = await request(app).get(`/api/weather/current/${id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', id);
    });

    test('handles weather API errors', async () => {
      const id = 11111;

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(500, { message: 'error' });

      const response = await request(app).get(`/api/weather/current/${id}`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/weather/forecast/:id', () => {
    test('returns forecast data', async () => {
      const id = 2643743;
      const mockForecast = {
        city: { name: 'London' },
        list: [
          {
            dt_txt: '2024-01-01 00:00:00',
            main: { temp: 20 },
            weather: [{ description: 'sunny', icon: '01d' }]
          }
        ]
      };

      nock('https://api.openweathermap.org')
        .get('/data/2.5/forecast')
        .query(true)
        .reply(200, mockForecast);

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

    test('handles forecast API errors', async () => {
      const id = 22222;

      nock('https://api.openweathermap.org')
        .get('/data/2.5/forecast')
        .query(true)
        .reply(500, { message: 'error' });

      const response = await request(app).get(`/api/weather/forecast/${id}`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty('error');
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
        country: 'US',
        uuid: '1234abcd-5678-efgh-ijkl-9876mnopqrst'
      };
      const response = await request(app)
        .post('/api/weather/history')
        .send(newEntry);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'History saved');
    });
  });

  describe('DELETE /api/weather/favorites/:uuid/:city_id', () => {
    test('removes a city from favorites', async () => {
      const favorite = await FavoriteCity.create({
        user_uuid: 'test-user',
        city_name: 'London',
        city_id: 12345,
        country: 'GB'
      });

      const response = await request(app)
        .delete(`/api/weather/favorites/${favorite.user_uuid}/${favorite.city_id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Favorite deleted');
    });
  });
});
