import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';

const App = () => {
  return (
    <WeatherProvider>
      <SearchBar />
      <WeatherCard />
    </WeatherProvider>
  );
};

export default App;
