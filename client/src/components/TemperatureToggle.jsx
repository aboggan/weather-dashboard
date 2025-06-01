import React, { useContext } from 'react';
import { FaThermometerHalf } from 'react-icons/fa';
import styles from './TemperatureToggle.module.scss';
import { TemperatureContext } from '../context/TemperatureContext';

const TemperatureToggle = () => {
  const { unit, toggleUnit } = useContext(TemperatureContext);

  return (
    <div className={styles.toggleContainer}>
      <span>°C</span>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={unit === 'F'}
          onChange={toggleUnit}
          aria-label={`Toggle temperature unit. Currently showing ${unit}.`}
        />
        <span className={styles.slider}></span>
      </label>
      <span>°F</span>
      <FaThermometerHalf className={styles.icon} />
    </div>
  );
};

export default TemperatureToggle;
