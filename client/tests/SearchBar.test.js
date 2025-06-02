import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import SearchBar from '../src/components/SearchBar';
import { WeatherContext } from '../src/context/WeatherContext';
import { HistoryContext } from '../src/context/HistoryContext';

jest.mock('../src/utils/getApiUrl', () => ({
  getApiUrl: () => 'http://localhost:4000',
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { id: 1, name: 'London', country: 'GB' },
        { id: 2, name: 'Paris', country: 'FR' },
      ]),
  })
);

const mockWeatherContext = {
  setWeatherData: jest.fn(),
};

const mockHistoryContext = {
  addToHistory: jest.fn(),
};

describe('SearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  const renderWithProvider = () =>
    render(
      <HistoryContext.Provider value={mockHistoryContext}>
        <WeatherContext.Provider value={mockWeatherContext}>
          <SearchBar />
        </WeatherContext.Provider>
      </HistoryContext.Provider>
    );

  test('should not call setWeatherData for empty input', async () => {
    renderWithProvider();
    const searchButton = screen.getByRole('button', { name: /search/i });

    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(mockWeatherContext.setWeatherData).not.toHaveBeenCalled();
  });

  test('should call setWeatherData with valid city', async () => {
    renderWithProvider();
    const input = screen.getByPlaceholderText(/search city/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'London' } });
      fireEvent.click(screen.getByRole('button', { name: /search/i }));
    });

    await waitFor(() => {
      expect(mockWeatherContext.setWeatherData).toHaveBeenCalledWith({
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
      expect(mockWeatherContext.setWeatherData).not.toHaveBeenCalled();
    });
  });
});
