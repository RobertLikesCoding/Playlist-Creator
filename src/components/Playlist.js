import React, {useState} from 'react';
import Track from './Track';
import Notifier from './Notifier.js';
import { redirectToAuthCodeFlow } from '../utils/spotifyAuthorization.js';
import { createPlaylist } from '../utils/spotifyApiCalls.js';
import styles from '../styles/Tracklists.module.css';
import '../styles/App.css';

export default function Playlist({
  playlistTracks,
  setPlaylistTracks,
  handleRemove,
  saveSession,
  setSearchQuery,
  topTracks,
  setTopTracks,
  playlistName,
  setPlaylistName,
  handlePlayPreview,
  currentTrackPlaying
}) {
  const [modalStatus, setModalStatus] = useState(null);

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
    if (!isPlaylistCreated) {
      alert("Something went wrong, please try again.");
      return;
    };

    // might not need these two lines:
    // const currentUser = JSON.parse(localStorage.getItem('current_user'));
    // setUserData(currentUser);



    // Reset everything
    setPlaylistTracks([]);
    setTopTracks([]);
    setSearchQuery('');
    setPlaylistName('');

  }

  return (
    <div>
      <Notifier modalStatus={modalStatus} setModalStatus={setModalStatus}/>
      <h2>Playlist</h2>
      <div className={styles.tracksContainer}>
        { topTracks.length > 0 && playlistTracks.length === 0 ? (
          <span className={styles.emptyState}>2. Click
          <i className="fa-sharp fa-solid fa-plus"></i>
          to add Tracks
          </span>
        ) : (
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
        )}
      </div>
      <p className={`${styles.emptyState} ${playlistTracks.length === 0 ? styles.invisible : ""}`}>3. Give it a name</p>
      <form className={styles.playlistForm} onSubmit={handleSubmit}>
        <label htmlFor='playlistName'></label>
        <input className={styles.PlaylistNameInput} name='playlistName' placeholder="Name your playlist" type='text' value={playlistName} onChange={handleChange}/>
        <button type='submit' className={playlistName.length === 0 ? "inactive" : ""}>
          Save to Spotify
        </button>
      </form>
    </div>
  )
}