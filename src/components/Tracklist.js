import React, {useState} from 'react';
import Track from './Track';

export default function Tracklist({topTracks, handleAdd}) {
  return (
    <div className='tracklist'>
      <h2>Results</h2>
      <ul>
        {topTracks.map((track) => {
          return <Track track={track} key={track.id} addOrRemove='add' onClick={(e) => handleAdd(track)}/>
        })}
      </ul>
    </div>
  )
};