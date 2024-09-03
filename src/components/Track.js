import React from 'react';

export default function Track({track, addOrRemove, onClick}) {
  const artists = track.artists.map((artist) => artist.name).join(', ');

  return (
    <div className='trackCard'>
      <div className="trackInfo">
        <h3>{track.name}</h3>
        <p>Artist: {artists}</p>
        <p>Album: {track.album.name}</p>
      </div>
      <button onClick={onClick}>{addOrRemove}</button>
    </div>
  )
};