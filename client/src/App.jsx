import React from 'react';
import styles from './components/AppWrapper.module.scss';
import SearchBar from './components/SearchBar';
import TemperatureToggle from './components/TemperatureToggle';
import Title from './components/Title';
import WeatherCard from './components/WeatherCard';
import { WeatherProvider } from './context/WeatherContext';

import { TemperatureProvider } from './context/TemperatureContext';
const App = () => {
  return (
    <div className={styles.wrapper}>
      <TemperatureProvider>
      <div className={styles.header}>
        <Title />
        
          <TemperatureToggle />
      </div>
      <WeatherProvider>
        <SearchBar />
        <WeatherCard />
      </WeatherProvider>

      </TemperatureProvider>
    </div>
  );
};

export default App;
