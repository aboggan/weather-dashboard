import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getApiUrl } from '../utils/getApiUrl';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [userUUID, setUserUUID] = useState('');

  useEffect(() => {
    let uuid = localStorage.getItem('userUUID');
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem('userUUID', uuid);
    }
    setUserUUID(uuid);

    const storedFavorites = localStorage.getItem('weatherFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    fetch(`${getApiUrl()}/api/weather/favorites/${uuid}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch favorites: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setFavorites(
            data.map(item => ({
              name: item.city_name,
              id: item.city_id,
              country: item.country
            }))
          );
        }
      })
      .catch(err => console.error('Error fetching favorites:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (city) => {
    if (!favorites.some((item) => item.id === city.id)) {
      setFavorites((prev) => [
        { name: city.name, id: city.id, country: city.country },
        ...prev
      ]);
      persistFavorite(city);
    }
  };

  const persistFavorite = async (entry) => {
    try {
      await fetch(`${getApiUrl()}/api/weather/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_uuid: userUUID,
          city_name: entry.name,
          city_id: entry.id,
          country: entry.country
        })
      });
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  const deleteFavoriteFromBackend = async (cityId) => {
    try {
      await fetch(`${getApiUrl()}/api/weather/favorites/${userUUID}/${cityId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  const removeFromFavorites = (favorite) => {
    setFavorites((prev) => prev.filter((item) => item.id !== favorite.id));
    deleteFavoriteFromBackend(favorite.id);
  };

  const removeAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('weatherFavorites');
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, removeAllFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
