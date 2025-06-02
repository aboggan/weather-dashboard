import React from 'react';
import styles from './components/AppWrapper.module.scss';
import SearchBar from './components/SearchBar';
import TemperatureToggle from './components/TemperatureToggle';
import Title from './components/Title';
import WeatherCard from './components/WeatherCard';
import { WeatherProvider } from './context/WeatherContext';
import { TemperatureProvider } from './context/TemperatureContext';
import { HistoryProvider } from './context/HistoryContext';
import SearchHistory from './components/SearchHistory';

const App = () => {
  return (
    <div className={styles.wrapper}>
      <TemperatureProvider>
        <div className={styles.header}>
          <Title />
          <TemperatureToggle />
        </div>
        <WeatherProvider>
          <HistoryProvider>
            <SearchBar />
            <WeatherCard />
            <SearchHistory onSelect={(city) => console.log(city)} />
          </HistoryProvider>
        </WeatherProvider>
      </TemperatureProvider>
    </div>
  );
};

export default App;
