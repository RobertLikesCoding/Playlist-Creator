import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import App, { SearchBar, Tracklist } from '../App';
import React from 'react';

describe('When App loads', () => {
  test('should show Heading', () => {
    render(<App />);
    const headerElement = screen.getByRole('heading');
    expect(headerElement).toBeInTheDocument();
  });

  test('should show Searchbar', () => {
    render(<App />);
    const searchBarElement = screen.getByRole('textbox');
    expect(searchBarElement).toBeInTheDocument();
  });

  test('should allow typing in Searchbar', () => {
    render(<App />);
    const searchBarElement = screen.getByRole('textbox');
    fireEvent.change(searchBarElement, { target: { value: 'test' } });
    expect(searchBarElement.value).toBe('test');
  });
});


