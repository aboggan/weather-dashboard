import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import WeatherCard from '../src/components/WeatherCard';
import { WeatherContext } from '../src/context/WeatherContext';
import { getApiUrl } from '../src/utils/getApiUrl';

jest.mock('../src/utils/getApiUrl', () => ({
  getApiUrl: () => 'http://localhost:4000',
}));

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

const mockWeatherData = { id: 1 };

describe('WeatherCard Component', () => {
  test('renders temperature, humidity, and description', async () => {
    render(
      <WeatherContext.Provider value={{ weatherData: mockWeatherData }}>
        <WeatherCard />
      </WeatherContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/20°C/i)).toBeInTheDocument();
      expect(screen.getByText(/Humidity: 60%/i)).toBeInTheDocument();
      expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    });
  });
});
