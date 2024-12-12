import React from 'react';
import styles from '../styles/Track.module.css';


export default function Track({track, addOrRemove, handleTrackAction}) {
  const artists = track.artists.map((artist) => artist.name).join(', ');
  const coverImage = track.album.images[2].url;

  return (
    <div className={styles.trackCard}>
      <div className={styles.coverImg}>
        <img src={coverImage} alt={`cover art of the song ${track.name}.`}/>
      </div>
      <div className={styles.trackInfo}>
        <h3>{track.name}</h3>
        <p>{artists}</p>
        <p>Album: {track.album.name}</p>
      </div>

      { addOrRemove === "add" ? (
        <div className={styles.btn}>
          <i className={`fa-sharp fa-solid fa-plus ${styles.btnAdd}`} onClick={handleTrackAction}></i>
        </div>
      ) : (
        <div className={styles.btn}>
          <i className={`fa-solid fa-trash-can ${styles.btnRemove}`} onClick={handleTrackAction}></i>
        </div>
      )}
    </div>
  )
};