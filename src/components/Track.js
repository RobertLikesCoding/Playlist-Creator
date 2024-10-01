import React from 'react';
import styles from '../styles/Track.module.css';


export default function Track({track, addOrRemove, onClick, currentTrackPlaying, handlePlayPreview}) {
  const artists = track.artists.map((artist) => artist.name).join(', ');
  const coverImage = track.album.images[2].url;

  return (
    <div className={styles.trackCard}>
      <div className={styles.coverImg}>
        <div className={styles.btnOverlay}>
        { !track.preview_url ? (
            <i className={`fa-solid fa-link-slash ${styles.btnNoPreview}`}></i>
          ) : currentTrackPlaying === track.preview_url ? (
            <i className={`fa-solid fa-stop ${styles.btnStop}`} onClick={() => handlePlayPreview(track.preview_url)}></i>
          ) : (
            <i className={`fa-solid fa-play ${styles.btnPlay}`} onClick={() => handlePlayPreview(track.preview_url)}></i>
          )
        }
        </div>
        <img src={coverImage} alt={`cover art of the song ${track.name}.`}/>
      </div>
      
      <div className={styles.trackInfo}>
        <h3>{track.name}</h3>
        <p>{artists}</p>
        <p>Album: {track.album.name}</p>
      </div>
      { addOrRemove === "add" ? (
        <div className={styles.btn}>
          <i className={`fa-regular fa-plus ${styles.btnAdd}`} onClick={onClick}></i>
        </div>
      ) : (
        <div className={styles.btn}>
          <i className={`fa-solid fa-trash-can ${styles.btnRemove}`} onClick={onClick}></i>
        </div>
      )}
      {/* <button onClick={onClick}>{addOrRemove}</button> */}
    </div>
  )
};