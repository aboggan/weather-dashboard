import React, { useState, useContext, useEffect, useRef } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import styles from './SearchBar.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

let citiesData = null;

const SearchBar = () => {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [errorMessage, setErrorMessage] = useState('');
    const { setWeatherData } = useContext(WeatherContext);

    // Reference to the suggestions container
    const suggestionsRef = useRef(null);

    // Function to load cities data from JSON
    const loadCities = async () => {
        if (!citiesData) {
            const response = await fetch('/cities.json');
            citiesData = await response.json();
        }
    };

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setCity(value);
        setErrorMessage('');
        setSelectedIndex(-1);

        if (value.trim().length > 2) {
            await loadCities();

            const filteredCities = citiesData
                .filter((item) =>
                    item.name.toLowerCase().startsWith(value.trim().toLowerCase())
                )
                .slice(0, 5);

            setSuggestions(filteredCities);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (selectedCity) => {
        setWeatherData({ city: selectedCity.name, id: selectedCity.id });
        setCity(selectedCity.name);
        setSuggestions([]);
        setErrorMessage('');
        setSelectedIndex(-1);
    };

    const handleSearchSubmit = async () => {
        await loadCities();

        let matchingCity = null;

        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            matchingCity = suggestions[selectedIndex];
        } else {
            matchingCity = citiesData.find(
                (item) => item.name.toLowerCase() === city.trim().toLowerCase()
            );
        }

        if (matchingCity) {
            setWeatherData({ city: matchingCity.name, id: matchingCity.id });
            setErrorMessage('');
            setCity(matchingCity.name);
        } else {
            setErrorMessage('City not found.');
        }

        setSuggestions([]);
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSubmit();
        }
    };

    // Hide suggestions on outside click or Escape key
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(e.target)
            ) {
                setSuggestions([]);
                setSelectedIndex(-1);
            }
        };

        const handleKeyDownOutside = (e) => {
            if (e.key === 'Escape') {
                setSuggestions([]);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDownOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDownOutside);
        };
    }, []);

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.searchField} ref={suggestionsRef}>
                    <input
                        type="text"
                        placeholder="Search city..."
                        value={city}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={styles.input}
                    />
                     <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                    <ul className={styles.suggestions}>
                        {suggestions.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(item)}
                                className={`${styles.suggestionItem} ${selectedIndex === index ? styles.selected : ''
                                    }`}
                            >
                                {item.name}, {item.country}
                            </li>
                        ))}
                    </ul>
                </div>

                <button className={styles.button} onClick={handleSearchSubmit}>
                    Search
                </button>
            </div>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
    );
};

export default SearchBar;
