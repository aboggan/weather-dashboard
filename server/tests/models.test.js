import mongoose from 'mongoose';
import connectDB from '../src/models/db.js';
import FavoriteCity from '../src/models/FavoriteCity.js';
import WeatherHistory from '../src/models/WeatherHistory.js';

beforeAll(async () => {
  // Configura la variable de entorno si no está definida
  if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb+srv://alexisboggan:zaDJd19lGJPrL5az@cluster0.hd35quj.mongodb.net/my_weather_dashboard?retryWrites=true&w=majority&appName=Cluster0';
  }
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('FavoriteCity model', () => {
  afterEach(async () => {
    await FavoriteCity.deleteMany({});
  });

  test('creates and removes a document', async () => {
    const favorite = await FavoriteCity.create({
      user_uuid: 'model-test-user',
      city_name: 'Paris',
      city_id: 98765
    });

    expect(favorite.city_name).toBe('Paris');

    await favorite.deleteOne();
    const found = await FavoriteCity.findOne({ city_id: 98765 });
    expect(found).toBeNull();
  });

  test('fails when required fields are missing', async () => {
    await expect(
      FavoriteCity.create({ city_name: 'Rome', city_id: 555 })
    ).rejects.toThrow();
  });
});

describe('WeatherHistory model', () => {
  afterEach(async () => {
    await WeatherHistory.deleteMany({});
  });

  test('creates and removes a document', async () => {
    const history = await WeatherHistory.create({
      user_uuid: 'model-test-user',
      city_name: 'Berlin',
      city_id: 12345,
      country: 'DE'
    });

    expect(history.city_id).toBe(12345);

    await history.deleteOne();
    const found = await WeatherHistory.findOne({ city_id: 12345 });
    expect(found).toBeNull();
  });

  test('fails when required fields are missing', async () => {
    await expect(
      WeatherHistory.create({
        user_uuid: 'model-test-user',
        city_name: 'Berlin'
      })
    ).rejects.toThrow();
  });
});
