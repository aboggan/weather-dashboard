import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { WeatherContext } from '../context/WeatherContext';
import styles from './FavoritesList.module.scss';

const FavoritesList = () => {
  const { favorites, removeAllFavorites } = useContext(FavoritesContext);
  const { setWeatherData } = useContext(WeatherContext);

  return (
    <div className={styles.favoritesContainer}>
      <h3>Favorite Cities</h3>
      {favorites.length === 0 ? (
        <p>No favorite cities yet. Star a city to add it here.</p>
      ) : (
        <>
          <div className={styles.favoritesList}>
            {favorites.map((city) => (
              <span
                key={city.id}
                className={styles.favoriteItem}
                onClick={() => setWeatherData(city)}
              >
                {city.name}
              </span>
            ))}
          </div>
          <button className={styles.clearButton} onClick={removeAllFavorites}>
            Clear Favorites
          </button>
        </>
      )}
    </div>
  );
};

export default FavoritesList;
