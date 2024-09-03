import React from 'react';
import Track from './Track';

export default function Tracklist({topTracks}) {
  return (
    <div className='tracklist'>
      <h2>Results</h2>
      <ul>
        { topTracks.map((track) => {
          return <Track track={track} key={track.id} addOrRemove='add' />
        })}
      </ul>
    </div>
  )
};