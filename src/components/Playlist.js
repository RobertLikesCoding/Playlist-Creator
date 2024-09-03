import React from 'react';
import Track from './Track';

export default function Playlist({addedTracks}) {
  return (
    <div className='playlist'>
      {addedTracks.map((track) => {
        <Track track={track} key={track.id} addOrRemove='remove'/>
      })}
    </div>
  )
}