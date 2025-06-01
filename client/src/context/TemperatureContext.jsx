import React, { createContext, useState } from 'react';

export const TemperatureContext = createContext();

export const TemperatureProvider = ({ children }) => {
  const [unit, setUnit] = useState('C'); // default Celsius

  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === 'C' ? 'F' : 'C'));
  };

  return (
    <TemperatureContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
};
