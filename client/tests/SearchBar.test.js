// client/tests/SearchBar.test.js

import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import SearchBar from '../src/components/SearchBar';
import { WeatherContext } from '../src/context/WeatherContext';

// Mock fetch for cities.json
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { id: 1, name: 'London', country: 'GB' },
        { id: 2, name: 'Paris', country: 'FR' },
      ]),
  })
);

const mockContextValue = {
  setWeatherData: jest.fn(),
};

describe('SearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = () =>
    render(
      <WeatherContext.Provider value={mockContextValue}>
        <SearchBar />
      </WeatherContext.Provider>
    );

  test('should not call setWeatherData for empty input', async () => {
    renderWithProvider();
    const searchButton = screen.getByRole('button', { name: /search/i });

    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(mockContextValue.setWeatherData).not.toHaveBeenCalled();
  });

  test('should call setWeatherData with valid city', async () => {
    renderWithProvider();
    const input = screen.getByPlaceholderText(/search city/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'London' } });
      fireEvent.click(screen.getByRole('button', { name: /search/i }));
    });

    await waitFor(() => {
      expect(mockContextValue.setWeatherData).toHaveBeenCalledWith({
        city: 'London',
        id: 1,
      });
    });
  });

  test('should show error for invalid city', async () => {
    renderWithProvider();
    const input = screen.getByPlaceholderText(/search city/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'InvalidCity' } });
      fireEvent.click(screen.getByRole('button', { name: /search/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/city not found/i)).toBeInTheDocument();
      expect(mockContextValue.setWeatherData).not.toHaveBeenCalled();
    });
  });
});
