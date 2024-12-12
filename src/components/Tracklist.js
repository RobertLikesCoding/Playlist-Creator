import React from 'react';
import Track from './Track';
import styles from '../styles/Tracklists.module.css';
import '../styles/App.css';

export default function Tracklist({topTracks, handleAdd}) {
  return (
    <div className="flexColumn">
      <h2>Tracks</h2>
      <div className={styles.tracksContainer}>
        { topTracks.length !== 0 ? (
          <ul className={styles.trackList}>
            {topTracks.map((track) => {
              return <Track
              track={track}
              key={track.id}
              addOrRemove='add'
              handleTrackAction={() => handleAdd(track)}
              />
            })}
          </ul>
        ) : (
          <p className={styles.emptyState}>1. Search for an Artist to start creating a playlist</p>
        )}
      </div>
    </div>
  )
};