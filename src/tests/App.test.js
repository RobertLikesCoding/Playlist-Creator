import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import App, { SearchBar, Tracklist } from '../App';
import React from 'react';


describe('When searching', () => {
  test('should show Searchbar', () => {
    render(<App />);
    const headerElement = screen.getByRole('heading');
    expect(headerElement).toBeInTheDocument();
  })
})