import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Forecast from '../components/Forecast';
import { WeatherContext } from '../context/WeatherContext';
import { TemperatureContext } from '../context/TemperatureContext';

// Mock fetch
global.fetch = jest.fn();

const mockWeatherData = { id: 12345 };
const mockForecast = [
  {
    date: '2025-06-01 12:00:00',
    temp: 25,
    description: 'clear sky',
    icon: '01d'
  },
  {
    date: '2025-06-02 12:00:00',
    temp: 22,
    description: 'few clouds',
    icon: '02d'
  }
];

describe('Forecast Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders InitialScreen when no city selected', () => {
    render(
      <WeatherContext.Provider value={{ weatherData: null }}>
        <TemperatureContext.Provider value={{ unit: 'C' }}>
          <Forecast />
        </TemperatureContext.Provider>
      </WeatherContext.Provider>
    );
    expect(screen.getByText(/select a city/i)).toBeInTheDocument();
  });

  test('renders LoadingScreen while fetching data', async () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    render(
      <WeatherContext.Provider value={{ weatherData: mockWeatherData }}>
        <TemperatureContext.Provider value={{ unit: 'C' }}>
          <Forecast />
        </TemperatureContext.Provider>
      </WeatherContext.Provider>
    );
    expect(screen.getByText(/loading forecast/i)).toBeInTheDocument();
  });

  test('renders forecast data correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        forecast: mockForecast
      })
    });

    render(
      <WeatherContext.Provider value={{ weatherData: mockWeatherData }}>
        <TemperatureContext.Provider value={{ unit: 'C' }}>
          <Forecast />
        </TemperatureContext.Provider>
      </WeatherContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/5-Day Forecast/i)).toBeInTheDocument();
    });

    // Verify all forecast entries are rendered
    mockForecast.forEach((day) => {
      const dateText = new Date(day.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      expect(screen.getByText(dateText)).toBeInTheDocument();
      expect(screen.getByText(`${Math.round(day.temp)}°C`)).toBeInTheDocument();
      expect(screen.getByText(day.description)).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false
    });

    render(
      <WeatherContext.Provider value={{ weatherData: mockWeatherData }}>
        <TemperatureContext.Provider value={{ unit: 'C' }}>
          <Forecast />
        </TemperatureContext.Provider>
      </WeatherContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
