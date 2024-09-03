import React from 'react';

export default function Track({track, addOrRemove}) {
  const artists = track.artists.map((artist) => artist.name).join(', ');

  function getAddOrRemove(param) {
    if (param === 'add') {
      return <button onClick={handleAddToPlaylist}>Add</button>
    } else {
      return <button onClick={handleRemoveFromPlaylist}>Remove</button>
    }
  };

  function handleAddToPlaylist(e) {
    console.log('Added to Playlist');
  }

  function handleRemoveFromPlaylist(e) {
    console.log('Removed from Playlist');
  }

  return (
    <div className='trackCard'>
      <div className="trackInfo">
        <h3>{track.name}</h3>
        <p>Artist: {artists}</p>
        <p>Album: {track.album.name}</p>
      </div>
      {getAddOrRemove(addOrRemove)}
    </div>
  )
};