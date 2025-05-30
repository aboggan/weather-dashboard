import request from 'supertest';
import app from '../src/index.js';

describe('Weather API Endpoints', () => {
  test('GET /api/weather/current/:city returns weather data', async () => {
    const city = 'London';
    const response = await request(app).get(`/api/weather/current/${city}`);

    // Should respond with status 200
    expect(response.statusCode).toBe(200);

    // Should contain 'city' and 'temp' in the response body
    expect(response.body).toHaveProperty('city', city);
    expect(response.body).toHaveProperty('temp');
    expect(typeof response.body.temp).toBe('number');
  });
});
