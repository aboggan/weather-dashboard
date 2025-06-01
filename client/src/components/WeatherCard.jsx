import React, { useState, useEffect, useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import { CiStar } from "react-icons/ci";
import { TbDroplet } from "react-icons/tb";
import { LuWind, LuSunrise, LuSunset } from "react-icons/lu";
import styles from './WeatherCard.module.scss';

// Utility functions
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

const WeatherCard = () => {
    const { weatherData } = useContext(WeatherContext);
    const cityId = weatherData?.id;

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cityId) return;

        const fetchWeather = async () => {
            setLoading(true);
            setError(null);

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!weather) return null;

    const timezoneOffset = weather.timezone;

    return (
        <div className={styles.weatherCard}>
            <div className={styles.cityField}>
                <h2>{weather.name} <span>({weather.sys.country})</span></h2>
                <div className={styles.favorite}>
                    <CiStar />
                </div>
            </div>

            <div className={styles.weatherDetails}>
                <div className={styles.mainWeather}>
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                    <div className={styles.tempInfo}>
                        <div className={styles.temp}>{weather.main.temp}°C</div>
                        <div className={styles.description}>{weather.weather[0].description}</div>
                        <div className={styles.feelsLike}>Feels like: {weather.main.feels_like}°C</div>
                    </div>
                </div>
                <div className={styles.extraInfo}>
                    <div className={styles.date}>{formatDate(weather.currentDate)}</div>
                    <div className={styles.metrics}>
                        <div className={styles.column}>
                            <div className={styles.infoItem}><TbDroplet className={styles.humidityIcon} />Humidity: {weather.main.humidity}%</div>
                            <div className={styles.infoItem}><LuSunrise className={styles.sunriseIcon} />Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}</div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.infoItem}><LuWind className={styles.windIcon} />Wind: {weather.wind.speed} m/s</div>
                            <div className={styles.infoItem}><LuSunset className={styles.sunsetIcon} />Sunset: {formatTime(weather.sys.sunset, weather.timezone)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
