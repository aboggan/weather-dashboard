import React, { useContext } from 'react';
import { FaRegStar } from 'react-icons/fa';
import { FavoritesContext } from '../context/FavoritesContext';
import { WeatherContext } from '../context/WeatherContext';
import styles from './FavoritesList.module.scss';
import { FaRegTrashAlt } from "react-icons/fa";
const FavoritesList = () => {
  const { favorites, removeAllFavorites } = useContext(FavoritesContext);
  const { setWeatherData } = useContext(WeatherContext);

  return (
    <div className={styles.favoritesContainer}>

      <div className={styles.title}><FaRegStar /><h3>Favorite Cities</h3></div>
      {favorites.length === 0 ? (
        <p>No favorite cities yet. Star a city to add it here.</p>
      ) : (
        <>
          <div className={styles.favoritesList}>
            {favorites.map((city) => (
              <button
                key={`${city.id}-${city.country}`}
                className={styles.favoriteItem}
                onClick={() => setWeatherData({ city: city.name, id: city.id })}
              >
                {city.name} <span>({city.country})</span>
              </button>
            ))}
          </div>
          <div className={styles.clearContainer}>
            <button className={styles.clearButton} onClick={removeAllFavorites}>
            <FaRegTrashAlt className={styles.deleteIcon} />
            Clear Favorites
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesList;
