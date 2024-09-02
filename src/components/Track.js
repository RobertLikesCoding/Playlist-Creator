import React from 'react';

export default function Track({track}) {
  console.log(track);
  const artists = track.artists.map((artist) => artist.name).join(', ');

  return (
    <div className='trackCard'>
      <div class="trackInfo">
        <h3>{track.name}</h3>
        <p>Artist: {artists}</p>
        <p>Album: {track.album.name}</p>
      </div>
      <button class="addToPlaylistBtn">Add to playlist</button>
    </div>
  )
};