import React, { useContext } from 'react';
import { HistoryContext } from '../context/HistoryContext';
import { WeatherContext } from '../context/WeatherContext';
import styles from './SearchHistory.module.scss';

const SearchHistory = () => {
  const { history, clearHistory } = useContext(HistoryContext);
  const { setWeatherData } = useContext(WeatherContext);

  const handleSelect = (item) => {
    setWeatherData({ city: item.name, id: item.id });
  };

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h3>Search History</h3>
      </div>
      <div className={styles.historyList}>
        {history.length === 0 ? (
          <p className={styles.empty}>No search history yet.</p>
        ) : (
          history.map((item, index) => (
            <button
              key={index}
              className={styles.historyItem}
              onClick={() => handleSelect(item)}
            >
              {item.name}
            </button>
          ))
        )}
      </div>
      <button className={styles.clearButton} onClick={clearHistory}>
        Clear History
      </button>
    </div>
  );
};

export default SearchHistory;
