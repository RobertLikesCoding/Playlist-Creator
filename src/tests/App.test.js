import { render, screen, fireEvent } from '@testing-library/react';
import { isTokenExpired, getRefreshToken, restoreSession } from '../utils/spotifyAuthorization';
// import renderer from 'react-test-renderer';
import App from '../App';
import React from 'react';

describe('When App loads', () => {
  test('should show Heading', () => {
    render(<App />);
    const headerElement = screen.getByText("Create your Playlist");
    expect(headerElement).toBeInTheDocument();
  });

  test('should show Searchbar', () => {
    render(<App />);
    const searchBarElement = screen.getByPlaceholderText("Search for artist...");
    expect(searchBarElement).toBeInTheDocument();
  });

  test('should allow typing in Searchbar', () => {
    render(<App />);
    const searchBarElement = screen.getByPlaceholderText("Search for artist...");
    fireEvent.change(searchBarElement, { target: { value: 'test' } });
    expect(searchBarElement.value).toBe('test');
  });
});



