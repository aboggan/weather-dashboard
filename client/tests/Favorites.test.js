import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { FavoritesProvider, FavoritesContext } from '../src/context/FavoritesContext';

describe('FavoritesContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should initialize with an empty favorites list', () => {
    let favoritesValue;
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

    expect(favoritesValue.favorites).toEqual([]);
  });

  test('should add a city to favorites', async () => {
    let favoritesValue;
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

    const newCity = { name: 'London', id: 2643743 };

    favoritesValue.addToFavorites(newCity);

    await waitFor(() => {
      expect(favoritesValue.favorites.some(f => f.name === 'London')).toBe(true);
    });
  });

  test('should remove a city from favorites', async () => {
    let favoritesValue;
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

    const city = { name: 'London', id: 2643743 };

    favoritesValue.addToFavorites(city);

    await waitFor(() => {
      expect(favoritesValue.favorites.some(f => f.name === 'London')).toBe(true);
    });

    // Remove it
    favoritesValue.removeFromFavorites({ ...city, _id: 'mock-id' });

    await waitFor(() => {
      expect(favoritesValue.favorites.some(f => f.name === 'London')).toBe(false);
    });
  });
});
