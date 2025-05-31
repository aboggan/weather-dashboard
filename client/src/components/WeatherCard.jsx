import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';

const WeatherCard = () => {
  const { weatherData } = useContext(WeatherContext);

  return (
    <div>
      {weatherData ? (
        <h2>Selected City: {weatherData.city}</h2>
      ) : (
        <p>No city selected yet.</p>
      )}
    </div>
  );
};

export default WeatherCard;
