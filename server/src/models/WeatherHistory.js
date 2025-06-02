import mongoose from 'mongoose';

const weatherHistorySchema = new mongoose.Schema({
  user_uuid: {
    type: String,
    required: true
  },
  city_name: {
    type: String,
    required: true
  },
  city_id: {
    type: Number,
    required: true
  },
  searched_at: {
    type: Date,
    default: Date.now
  }
}, { collection: 'weather_histories' }); // <= Forzar el nombre exacto de la colección

const WeatherHistory = mongoose.model('WeatherHistory', weatherHistorySchema);

export default WeatherHistory;
