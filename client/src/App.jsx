import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Title from './components/Title';
import styles from './components/AppWrapper.module.scss';

const App = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title />

      </div>
      <WeatherProvider>
        <SearchBar />
        <WeatherCard />
      </WeatherProvider>

    </div>
  );
};

export default App;
