import React from 'react';
import Track from './Track';
import styles from '../styles/Tracklist.module.css';

export default function Tracklist({topTracks, handleAdd, currentTrackPlaying, handlePlayPreview}) {
  return (
    <div>
      <h2>Results</h2>
      <div className={styles.tracksContainer}>
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
      </div>
    </div>
  )
};