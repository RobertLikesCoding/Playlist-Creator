import React from 'react';
import Track from './Track';
import { redirectToAuthCodeFlow } from '../utils/spotifyAuthorization.js';
import { createPlaylist } from '../utils/spotifyApiCalls.js';
import styles from '../styles/Tracklists.module.css';

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
  currentTrackPlaying,
  setUserData
}) {
  function handleChange({target}) {
    setPlaylistName(target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault();
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
    if (!verifier) {
      saveSession();
      await redirectToAuthCodeFlow();
      return;
    }

    const isPlaylistCreated  = await createPlaylist(playlistName, trackUris);
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    setUserData(currentUser)
    if (!isPlaylistCreated) {
      alert("Something went wrong");
      return;
    };
    // Reset everything
    setPlaylistTracks([]);
    setTopTracks([]);
    setSearchQuery('');
    setPlaylistName('');
    alert("Playlist successfully created 🥳");
  }

  return (
    <div>
      <h2>Playlist</h2>
      <div className={styles.tracksContainer}>
        <ul className={styles.trackList}>
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
      </div>
      <form className={styles.playlistForm} onSubmit={handleSubmit}>
        <label htmlFor='playlistName'></label>
        <input className={styles.PlaylistNameInput} name='playlistName' placeholder="Name your playlist" type='text' value={playlistName} onChange={handleChange}/>
        <button type='submit'>Save to Spotify</button>
      </form>
    </div>
  )
}