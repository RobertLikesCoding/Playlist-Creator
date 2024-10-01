import React from 'react';
import styles from '../styles/Track.module.css';


export default function Track({track, addOrRemove, onClick, currentTrackPlaying, handlePlayPreview}) {
  const artists = track.artists.map((artist) => artist.name).join(', ');
  const coverImage = track.album.images[2].url;

  return (
    <div className={styles.trackCard}>
      <div className={styles.coverImg}>
        <img src={coverImage} alt={`cover art of the song ${track.name}.`}/>
      </div>
      <div className={styles.trackInfo}>
        <h3>{track.name}</h3>
        <p>Artist: {artists}</p>
        <p>Album: {track.album.name}</p>
      </div>
      { !track.preview_url ? (
          <button className={styles.btnNoPreview}>No Preview</button>
        ) : currentTrackPlaying === track.preview_url ? (
          <button onClick={() => handlePlayPreview(track.preview_url)} className={styles.btnStop}>Stop</button>
        ) : (
          <button onClick={() => handlePlayPreview(track.preview_url)} className={styles.btnPlay}>Play</button>
        )
      }
      <button onClick={onClick}>{addOrRemove}</button>
    </div>
  )
};