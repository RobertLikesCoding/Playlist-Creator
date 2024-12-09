import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import React from 'react';

describe('When App loads', () => {
  test('should show logo', () => {
    render(<App />);
    const logoElement = screen.getByText("Playlist Creator");
    expect(logoElement).toBeInTheDocument();
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



