import React, { useContext, useEffect, useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { LuSunrise, LuSunset, LuWind } from "react-icons/lu";
import { TbDroplet } from "react-icons/tb";
import { FavoritesContext } from '../context/FavoritesContext';
import { TemperatureContext } from '../context/TemperatureContext';
import { WeatherContext } from '../context/WeatherContext';
import { getApiUrl } from '../utils/getApiUrl';
import styles from './WeatherCard.module.scss';
import { PiSpinnerBold } from "react-icons/pi";
const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
};

const InitialScreen = () => (
    <div className={styles.initialScreen}>
        <p>Please select a city to view the weather.</p>
    </div>
);

const LoadingScreen = () => (
    <div className={styles.loadingScreen}>
        <PiSpinnerBold/> 
       <p>  Loading...</p>
    </div>
);

const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const WeatherCard = () => {
    const { weatherData } = useContext(WeatherContext);
    const { unit } = useContext(TemperatureContext);
    const { favorites, addToFavorites, removeFromFavorites } = useContext(FavoritesContext);
    const cityId = weatherData?.id;

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const isFavorite = favorites.some((fav) => fav.id === cityId);

    const handleFavoriteClick = () => {
        if (isFavorite) {
            const favoriteToRemove = favorites.find((fav) => fav.id === cityId);
            removeFromFavorites(favoriteToRemove);
        } else {
            addToFavorites({
                name: weather.name,
                id: cityId,
                country: weather.sys.country
            });
        }
    };

    const convertWindSpeed = (speed) => {
        return unit === 'C'
            ? `${speed} m/s`
            : `${(speed * 2.237).toFixed(1)} mph`;
    };

    useEffect(() => {
        if (!cityId) return;

        const fetchWeather = async () => {
            setLoading(true);
            setError(null);

            try {
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/api/weather/current/${parseInt(cityId, 10)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setWeather(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [cityId]);

    useEffect(() => {
        if (loading) {
            setIsVisible(false);
        } else if (weather) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [weather, loading]);

    if (!cityId) return <InitialScreen />;
    if (loading) return <LoadingScreen />;
    if (error) return <p>Error: {error}</p>;
    if (!weather) return null;

    const timezoneOffset = weather.timezone;

    const convertTemperature = (temp) => {
        return unit === 'C'
            ? Math.round(temp)
            : Math.round((temp * 9) / 5 + 32);
    };

    return (
        <div className={`${styles.weatherCard} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.cityField}>
                <div className={styles.cityName}>

                    <h2>{weather.name}</h2> <span>({weather.sys.country})</span>
                </div>
                <div
                    className={`${styles.favorite} ${isFavorite ? styles.active : ''}`}
                    onClick={handleFavoriteClick}
                >
                    {isFavorite ? <FaStar /> : <FaRegStar />}
                </div>
            </div>

            <div className={styles.weatherDetails}>
                <div className={styles.mainWeather}>
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                    <div className={styles.tempInfo}>
                        <div className={styles.temp}>
                            {convertTemperature(weather.main.temp)}°{unit}
                        </div>
                        <div className={styles.description}>{capitalize(weather.weather[0].description)}</div>
                        <div className={styles.feelsLike}>
                            Feels like {convertTemperature(weather.main.feels_like)}°{unit}
                        </div>
                    </div>
                </div>
                <div className={styles.extraInfo}>
                    <div className={styles.date}>{formatDate(weather.currentDate)}</div>
                    <div className={styles.metrics}>
                        <div className={styles.column}>
                            <div className={styles.infoItem}>
                                <TbDroplet className={styles.humidityIcon} />Humidity: {weather.main.humidity}%
                            </div>
                            <div className={styles.infoItem}>
                                <LuSunrise className={styles.sunriseIcon} />Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.infoItem}>
                                <LuWind className={styles.windIcon} />Wind: {convertWindSpeed(weather.wind.speed)}
                            </div>
                            <div className={styles.infoItem}>
                                <LuSunset className={styles.sunsetIcon} />Sunset: {formatTime(weather.sys.sunset, weather.timezone)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
