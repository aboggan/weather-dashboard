import request from 'supertest';
import app from '../src/index.js'; 
import mongoose from 'mongoose';
import FavoriteCity from '../src/models/FavoriteCity.js'; 

describe('Favorites API Endpoints', () => {
  beforeAll(async () => {
  });

  afterAll(async () => {
  });

  afterEach(async () => {
    await FavoriteCity.deleteMany({});
  });

  test('POST /api/weather/favorites should add a city to favorites', async () => {
    const response = await request(app)
      .post('/api/weather/favorites')
      .send({
        user_uuid: 'test-user',
        city_name: 'London',
        city_id: 12345
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('City added to favorites');
  });

  test('GET /api/weather/favorites should return list of favorite cities', async () => {
    
    await FavoriteCity.create({
      user_uuid: 'test-user',
      city_name: 'London',
      city_id: 12345
    });

    const response = await request(app)
      .get('/api/weather/favorites')
      .query({ user_uuid: 'test-user' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].city_name).toBe('London');
  });

  test('DELETE /api/weather/favorites/:id should remove a city from favorites', async () => {
    const favorite = await FavoriteCity.create({
      user_uuid: 'test-user',
      city_name: 'London',
      city_id: 12345
    });

    const response = await request(app)
      .delete(`/api/weather/favorites/${favorite._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('City removed from favorites');
  });
});
