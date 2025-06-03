import React from 'react';
import styles from './components/AppWrapper.module.scss';
import FavoritesList from './components/FavoritesList';
import SearchBar from './components/SearchBar';
import TemperatureToggle from './components/TemperatureToggle';
import Title from './components/Title';
import WeatherCard from './components/WeatherCard';
import { FavoritesProvider } from './context/FavoritesContext';
import { HistoryProvider } from './context/HistoryContext';
import { TemperatureProvider } from './context/TemperatureContext';
import { WeatherProvider } from './context/WeatherContext';
import Forecast from './components/Forecast';
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
            <FavoritesProvider>

              <WeatherCard />
              <Forecast />
              <div className={styles.bottom}>

                <FavoritesList />
                <SearchHistory onSelect={(city) => console.log(city)} />
              </div>
            </FavoritesProvider>
          </HistoryProvider>
        </WeatherProvider>
      </TemperatureProvider>
    </div>
  );
};

export default App;
