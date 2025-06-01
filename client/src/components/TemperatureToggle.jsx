import React, { useState } from 'react';
import { FaThermometerHalf } from 'react-icons/fa';
import styles from './TemperatureToggle.module.scss';

const TemperatureToggle = ({ onToggle }) => {
  const [isCelsius, setIsCelsius] = useState(true);

  const handleToggle = () => {
    setIsCelsius(!isCelsius);
    onToggle(isCelsius ? 'F' : 'C');
  };

  return (
    <div className={styles.toggleContainer}>
      <span>°C</span>
      <label className={styles.switch}>
        <input type="checkbox" checked={!isCelsius} onChange={handleToggle} />
        <span className={styles.slider}></span>
      </label>
      <span>°F</span>
      <FaThermometerHalf className={styles.icon} />
    </div>
  );
};

export default TemperatureToggle;
