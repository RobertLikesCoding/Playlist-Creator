import React, {useState} from 'react';
import Track from './Track';

export default function Tracklist({topTracks, handleAdd, currentTrackPlaying, handlePlayPreview}) {
  return (
    <div className='tracklist'>
      <h2>Results</h2>
      <ul>
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
  )
};