// WeatherCard.jsx
import React from 'react';
import { CiStar } from "react-icons/ci";
import styles from './WeatherCard.module.scss';
import { TbDroplet } from "react-icons/tb";
import { LuWind } from "react-icons/lu";
import { LuSunrise } from "react-icons/lu";
import { LuSunset } from "react-icons/lu";
// Mock data
const mockWeatherData = {
    coord: {
        lon: -58.3816,
        lat: -34.6037
    },
    weather: [
        {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d"
        }
    ],
    base: "stations",
    main: {
        temp: 25.5,
        feels_like: 26.2,
        temp_min: 24.0,
        temp_max: 27.0,
        pressure: 1013,
        humidity: 50
    },
    visibility: 10000,
    wind: {
        speed: 3.6,
        deg: 180
    },
    clouds: {
        all: 0
    },
    dt: 1623411600,
    sys: {
        type: 1,
        id: 8233,
        country: "AR",
        sunrise: 1623392900,
        sunset: 1623431900
    },
    timezone: -10800,
    id: 3435910,
    name: "Buenos Aires",
    cod: 200,
    currentDate: "2025-05-31"
};




// Utility function for time formatting
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
        weekday: 'short',   // Sat, Sun, etc.
        month: 'short',     // Jan, Feb, etc.
        day: 'numeric'      // 31, 24, etc.
    });
};

const WeatherCard = () => {
    const weather = mockWeatherData;
    const timezoneOffset = weather.timezone; // in seconds

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
