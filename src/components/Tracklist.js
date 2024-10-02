import React from 'react';
import Track from './Track';
import styles from '../styles/Tracklists.module.css';

export default function Tracklist({topTracks, handleAdd, currentTrackPlaying, handlePlayPreview}) {
  return (
    <div>
      <h2>Tracks</h2>
      <div className={styles.tracksContainer}>
        { topTracks.length !== 0 ? (
          <ul className={styles.trackList}>
            {topTracks.map((track) => {
              return <Track
              track={track}
              key={track.id}
              addOrRemove='add'
              onClick={() => handleAdd(track)}
              handlePlayPreview={handlePlayPreview}
              currentTrackPlaying={currentTrackPlaying}
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