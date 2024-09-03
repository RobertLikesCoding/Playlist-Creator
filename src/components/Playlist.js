import React, {useState} from 'react';
import Track from './Track';

export default function Playlist({playlistTracks, handleRemove}) {

  return (
    <div className='playlist'>
      <h2>Playlist</h2>
      {playlistTracks.map((track) => {
        return <Track track={track} key={track.id} addOrRemove='remove' onClick={(e) => handleRemove(track)}/>
      })}
    </div>
  )
}