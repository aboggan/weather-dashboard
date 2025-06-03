import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import WeatherCard from '../src/components/WeatherCard';
import { WeatherContext } from '../src/context/WeatherContext';
import { TemperatureContext } from '../src/context/TemperatureContext';
import { FavoritesContext } from '../src/context/FavoritesContext'; // <== Esto faltaba

jest.mock('../src/utils/getApiUrl', () => ({
  getApiUrl: () => 'http://localhost:4000',
}));

beforeEach(() => {
  jest.clearAllMocks();
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        name: 'London',
        sys: { country: 'GB', sunrise: 1600000000, sunset: 1600040000 },
        weather: [{ description: 'clear sky', icon: '01d' }],
        main: { temp: 20, feels_like: 18, humidity: 60 },
        wind: { speed: 5 },
        timezone: 0,
        currentDate: '2025-06-01',
      }),
  })
);

const mockWeatherData = {
  id: 2643743,
  name: 'London',
  sys: { country: 'GB', sunrise: 1600000000, sunset: 1600040000 },
  weather: [{ description: 'clear sky', icon: '01d' }],
  main: { temp: 20, feels_like: 18, humidity: 60 },
  wind: { speed: 5 },
  timezone: 0,
  currentDate: '2025-06-01',
};

const renderWithProviders = (component) => {
  return render(
    <TemperatureContext.Provider value={{ unit: 'C' }}>
      <WeatherContext.Provider value={{ weatherData: mockWeatherData }}>
        <FavoritesContext.Provider
          value={{
            favorites: [],
            addToFavorites: jest.fn(),
            removeFromFavorites: jest.fn(),
          }}
        >
          {component}
        </FavoritesContext.Provider>
      </WeatherContext.Provider>
    </TemperatureContext.Provider>
  );
};

describe('WeatherCard Component', () => {
  test('renders temperature, humidity, and description', async () => {
    renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/20°C/i)).toBeInTheDocument();
      expect(screen.getByText(/Humidity: 60%/i)).toBeInTheDocument();
      expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    });
  });

  test('renders error message when fetch fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      })
    );

    renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });
});
