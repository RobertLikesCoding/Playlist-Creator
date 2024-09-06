import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import redirectToAuthCodeFlow from '../utils/spotifyAuthorization';
import React from 'react';
import Playlist from '../components/Playlist';

jest.mock('../utils/spotifyApiCalls');

describe('Playlist component', () => {
  const mockSetPlaylistTracks = jest.fn();
  const mockHandleRemove = jest.fn();

  test('should show alert when no tracks are added', () => {
    render(
      <Playlist
        playlistTracks={[]}
        setPlaylistTracks={mockSetPlaylistTracks}
        handleRemove={mockHandleRemove}
      />
    );

    window.alert = jest.fn();

    fireEvent.click(screen.getByText('Save to Spotify'));
    expect(window.alert).toHaveBeenCalledWith('You forgot to add tracks to your playlist!');
  });
})