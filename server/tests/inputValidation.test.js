import request from 'supertest';
import app from '../src/index.js';
import mongoose from 'mongoose';

describe('Input Validation', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/weather/favorites without user_uuid returns 400', async () => {
    const response = await request(app)
      .post('/api/weather/favorites')
      .send({ city_name: 'London', city_id: 12345 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  test('POST /api/weather/favorites without city_name returns 400', async () => {
    const response = await request(app)
      .post('/api/weather/favorites')
      .send({ user_uuid: 'user1', city_id: 12345 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  test('POST /api/weather/favorites without city_id returns 400', async () => {
    const response = await request(app)
      .post('/api/weather/favorites')
      .send({ user_uuid: 'user1', city_name: 'London' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });
});
