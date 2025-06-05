import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getApiUrl } from '../utils/getApiUrl';

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [userUUID, setUserUUID] = useState('');

  useEffect(() => {
    let uuid = localStorage.getItem('userUUID');
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem('userUUID', uuid);
    }
    setUserUUID(uuid);

    const storedHistory = localStorage.getItem('weatherHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }

    // Fetch history from backend
    fetch(`${getApiUrl()}/api/weather/history/${uuid}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch history: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data.map(item => ({
            name: item.city_name,
            id: item.city_id,
            country: item.country
          })));
        }
      })
      .catch(err => console.error('Error fetching history:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (city) => {
    if (!history.some((item) => item.id === city.id)) {
      setHistory((prev) => [
        { name: city.name, id: city.id, country: city.country },
        ...prev.slice(0, 9)
      ]);
      persistHistory(city);
    }
  };

  const persistHistory = async (entry) => {
    try {
      await fetch(`${getApiUrl()}/api/weather/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: entry.id,
          name: entry.name,
          country: entry.country,
          uuid: userUUID
        })
      });
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const deleteHistoryFromBackend = async () => {
    try {
      await fetch(`${getApiUrl()}/api/weather/history/${userUUID}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weatherHistory');
    deleteHistoryFromBackend();
  };
  
  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
