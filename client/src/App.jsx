import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import styles from './components/AppWrapper.module.scss';

const App = () => {
  return (
    <div className={styles.wrapper}>
      <WeatherProvider>
        <SearchBar />
        <WeatherCard />
      </WeatherProvider>

    </div>
  );
};

export default App;
