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
  playlistName,
  handlePlayPreview,
  currentTrackPlaying
}) {
  function handleChange({target}) {
    setPlaylistName(target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const code = new URLSearchParams(window.location.search).get("code");
    const verifier = localStorage.getItem("verifier");

    setPlaylistName(event.target.playlistName.value);
    const trackUris = playlistTracks.map((track) => {
      return track.uri
    });
    if (trackUris.length === 0) {
      alert("You forgot to add tracks to your playlist. 🤔");
      return;
    } else if (!playlistName) {
      alert("Give your playlist a name!");
      return;
    }
    if (!code || !verifier) {
      saveSession();
      await redirectToAuthCodeFlow();
      return;
    }

    const isPlaylistCreated  = await createPlaylist(playlistName, trackUris);
    if (!isPlaylistCreated) {
      alert("Something went wrong");
    };
    // Reset everything
    setPlaylistTracks([]);
    setTopTracks([]);
    setSearchQuery('');
    setPlaylistName('');
    alert("Playlist successfully created 🥳");
  }

  return (
    <div className='playlist'>
      <h2>Playlist</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='playlistName'>Name your playlist: </label>
        <input id="playlistName" name='playlistName' type='text' value={playlistName} onChange={handleChange}/>
      </form>
      <ul>
        {playlistTracks.map((track) => {
          return <Track
          track={track}
          key={track.id}
          addOrRemove='remove'
          onClick={(e) => handleRemove(track)}
          handlePlayPreview={handlePlayPreview}
          currentTrackPlaying={currentTrackPlaying}
          />
        })}
      </ul>
      <button type='submit'>Save to Spotify</button>
    </div>
  )
}