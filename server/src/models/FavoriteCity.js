import mongoose from 'mongoose';

const favoriteCitySchema = new mongoose.Schema({
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
  added_at: {
    type: Date,
    default: Date.now
  }
}, { collection: 'favorite_cities' }); // Force exact collection name

const FavoriteCity = mongoose.model('FavoriteCity', favoriteCitySchema);

export default FavoriteCity;
