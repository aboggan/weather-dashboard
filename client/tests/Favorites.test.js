import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { FavoritesProvider, FavoritesContext } from '../src/context/FavoritesContext';

jest.mock('../src/utils/getApiUrl', () => ({
  getApiUrl: () => 'http://localhost:4000',
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('FavoritesContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should initialize with an empty favorites list', async () => {
    let favoritesValue;
    await act(async () => {
      render(
        <FavoritesProvider>
          <FavoritesContext.Consumer>
            {(value) => {
              favoritesValue = value;
              return null;
            }}
          </FavoritesContext.Consumer>
        </FavoritesProvider>
      );
    });

    expect(favoritesValue.favorites).toEqual([]);
  });

  test('should add a city to favorites', async () => {
    let favoritesValue;
    await act(async () => {
      render(
        <FavoritesProvider>
          <FavoritesContext.Consumer>
            {(value) => {
              favoritesValue = value;
              return null;
            }}
          </FavoritesContext.Consumer>
        </FavoritesProvider>
      );
    });

    const newCity = { name: 'London', id: 2643743 };

    await act(async () => {
      favoritesValue.addToFavorites(newCity);
    });

    await waitFor(() => {
      expect(favoritesValue.favorites.some(f => f.name === 'London')).toBe(true);
    });
  });

  test('should remove a city from favorites', async () => {
    let favoritesValue;
    await act(async () => {
      render(
        <FavoritesProvider>
          <FavoritesContext.Consumer>
            {(value) => {
              favoritesValue = value;
              return null;
            }}
          </FavoritesContext.Consumer>
        </FavoritesProvider>
      );
    });

    const city = { name: 'London', id: 2643743 };

    await act(async () => {
      favoritesValue.addToFavorites(city);
    });

    await waitFor(() => {
      expect(favoritesValue.favorites.some(f => f.name === 'London')).toBe(true);
    });

    await act(async () => {
      favoritesValue.removeFromFavorites({ ...city, _id: 'mock-id' });
    });

    await waitFor(() => {
      expect(favoritesValue.favorites.some(f => f.name === 'London')).toBe(false);
    });
  });
});
