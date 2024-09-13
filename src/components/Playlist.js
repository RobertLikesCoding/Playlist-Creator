import React, {useState} from 'react';
import Track from './Track';
import { getAccessToken } from '../utils/spotifyAuthorization.js'
import { redirectToAuthCodeFlow } from '../utils/spotifyAuthorization.js'
import createPlaylist from '../utils/spotifyApiCalls.js'

export default function Playlist({
  playlistTracks,
  setPlaylistTracks,
  handleRemove,
  saveSession,
  setSearchQuery,
  setTopTracks,
  setPlaylistName,
  playlistName
}) {
  function handleChange({target}) {
    setPlaylistName(target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const code = new URLSearchParams(window.location.search).get("code");

    setPlaylistName(event.target.playlistName.value);
    const trackUris = playlistTracks.map((track) => {
      return track.uri
    });
    if (trackUris.length === 0) {
      alert("You forgot to add tracks to your playlist!");
      return;
    } else if (!playlistName) {
      alert("Give your playlist a name!");
      return;
    }
    if (code) {
      await getAccessToken(code);
    } else {
      saveSession();
      await redirectToAuthCodeFlow();
    }

    createPlaylist(playlistName, trackUris);
    // Reset everything
    setPlaylistTracks([]);
    setTopTracks([]);
    setSearchQuery('');
    setPlaylistName('');
  }

  return (
    <div className='playlist'>
      <h2>Playlist</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='playlistName'>Name your playlist: </label>
        <input id="playlistName" name='playlistName' type='text' value={playlistName} onChange={handleChange}/>
        <ul>
          {playlistTracks.map((track) => {
            return <Track track={track} key={track.id} addOrRemove='remove' onClick={(e) => handleRemove(track)}/>
          })}
        </ul>
        <button type='submit'>Save to Spotify</button>
      </form>
    </div>
  )
}