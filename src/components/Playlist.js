import React from "react";
import Track from "./Track";
import Notifier from "./Notifier.js";
import styles from "../styles/Tracklists.module.css";
import "../styles/App.css";

export default function Playlist({
  playlistTracks,
  setPlaylistTracks,
  handleRemove,
  setSearchQuery,
  topTracks,
  setTopTracks,
  playlistName,
  setPlaylistName,
  modalContent,
  setModalContent,
}) {
  function handleChange({ target }) {
    setPlaylistName(target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setPlaylistName(event.target.playlistName.value);
    if (playlistTracks.length === 0) {
      const noTracksAdded = (
        <>
          <i className="fa-regular fa-face-kiss"></i>
          <p>"You forgot to add tracks to your playlist."</p>
        </>
      );
      setModalContent([noTracksAdded, true]);
      return;
    }

    const successMessage = (
      <>
        <i className="fa-regular fa-circle-check"></i>
        <p>{`'${playlistName}' was successfully added to your Playlists!`}</p>
        <p>{`It contains ${playlistTracks.length} songs.`}</p>
        <div className="btn" onClick={handleClose}>
          <span id="login">Create another one</span>
        </div>
      </>
    );
    setModalContent([successMessage, false]);

    // Reset everything
    setPlaylistTracks([]);
    setTopTracks([]);
    setSearchQuery("");
    setPlaylistName("");
  }

  function handleClose() {
    setModalContent(null);
  }

  return (
    <div>
      <Notifier modalContent={modalContent} setModalContent={setModalContent} />
      <h2>Playlist</h2>
      <div className={styles.tracksContainer}>
        {topTracks.length > 0 && playlistTracks.length === 0 ? (
          <span className={styles.emptyState}>
            2. Click
            <i className="fa-sharp fa-solid fa-plus"></i>
            to add Tracks
          </span>
        ) : (
          <ul className={styles.trackList}>
            {playlistTracks.map((track) => {
              return (
                <Track
                  track={track}
                  key={track.id}
                  addOrRemove="remove"
                  handleTrackAction={(e) => handleRemove(track)}
                />
              );
            })}
          </ul>
        )}
      </div>
      <p
        className={`${styles.emptyState} ${
          playlistTracks.length === 0 ? styles.invisible : ""
        }`}
      >
        3. Give it a name
      </p>
      <form className={styles.playlistForm} onSubmit={handleSubmit}>
        <label htmlFor="playlistName" className="dNone"></label>
        <input
          className={styles.PlaylistNameInput}
          name="playlistName"
          placeholder="Name your playlist"
          type="text"
          value={playlistName}
          onChange={handleChange}
        />
        <button
          type="submit"
          className={playlistName.length === 0 ? "inactive" : ""}
        >
          Save to Spotify
        </button>
      </form>
    </div>
  );
}
