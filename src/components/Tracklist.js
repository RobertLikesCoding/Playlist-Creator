import React from 'react';
import Track from './Track';

export default function Tracklist({topTracks}) {
  return (
    <div className='tracklist'>
      <ul>
        { topTracks.map((track) => {
          return <Track track={track} key={track.id}/>
        })}
      </ul>
    </div>
  )
};