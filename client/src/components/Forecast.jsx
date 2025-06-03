import React, { useState, useEffect, useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import { TemperatureContext } from '../context/TemperatureContext';
import styles from './Forecast.module.scss';
import { getApiUrl } from '../utils/getApiUrl';

const InitialScreen = () => (
    <div className={styles.initialScreen}>
        <p>Please select a city to view the forecast.</p>
    </div>
);

const LoadingScreen = () => (
    <div className={styles.loadingScreen}>
        <p>Loading forecast...</p>
    </div>
);

const Forecast = () => {
    const { weatherData } = useContext(WeatherContext);
    const { unit } = useContext(TemperatureContext);
    const cityId = weatherData?.id;

    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!cityId) return;

        const fetchForecast = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/api/weather/forecast/${parseInt(cityId, 10)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch forecast data');
                }
                const data = await response.json();
                setForecast(data.forecast || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [cityId]);

    useEffect(() => {
        if (loading) {
            setIsVisible(false);
        } else if (forecast.length > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [forecast, loading]);

    const convertTemperature = (temp) => {
        return unit === 'C'
            ? Math.round(temp)
            : Math.round((temp * 9) / 5 + 32);
    };

    if (!cityId) return <InitialScreen />;
    if (loading) return <LoadingScreen />;
    if (error) return <p>Error: {error}</p>;
    if (forecast.length === 0) return null;

    return (
        <div className={`${styles.forecast} ${isVisible ? styles.visible : ''}`}>
            <h3>5-Day Forecast</h3>
            <div className={styles.forecastCards}>
                {forecast.map((day, index) => (
                    <div key={index} className={styles.card}>
                        <img
                            src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                            alt={day.description}
                        />
                        <p>{new Date(day.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}</p>
                        <p>{convertTemperature(day.temp)}°{unit}</p>
                        <p>{day.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forecast;
