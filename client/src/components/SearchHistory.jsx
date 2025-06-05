import React, { useContext } from 'react';
import { HistoryContext } from '../context/HistoryContext';
import { WeatherContext } from '../context/WeatherContext';
import styles from './SearchHistory.module.scss';
import { FaHistory } from "react-icons/fa";

import { FaRegTrashAlt } from "react-icons/fa";

const SearchHistory = () => {
  const { history, clearHistory } = useContext(HistoryContext);
  const { setWeatherData } = useContext(WeatherContext);

  const handleSelect = (item) => {
    setWeatherData({ city: item.name, id: item.id });
  };

  return (
    <div className={styles.historyContainer}>
      <div className={styles.title}>
        <FaHistory />

        <h3>Search History</h3>
      </div>
      {history.length === 0 ? (
        <p className={styles.empty}>No search history yet.</p>
      ) : (
        <>
          <div className={styles.historyList}>
            {history.map((item, index) => (
              <button
                key={index}
                className={styles.historyItem}
                onClick={() => handleSelect(item)}
              >
                {item.name} <span>({item.country})</span>
              </button>
            ))}
          </div>
          <div className={styles.clearContainer}>
            <button className={styles.clearButton} onClick={clearHistory}>
            <FaRegTrashAlt className={styles.deleteIcon} />
            Clear History
          </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchHistory;
