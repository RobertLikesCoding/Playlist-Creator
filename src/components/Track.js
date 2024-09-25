import React from 'react';

export default function Track({track, addOrRemove, onClick, currentTrackPlaying, handlePlayPreview}) {
  const artists = track.artists.map((artist) => artist.name).join(', ');

  return (
    <div className='trackCard'>
      <div className="trackInfo">
        <h3>{track.name}</h3>
        <p>Artist: {artists}</p>
        <p>Album: {track.album.name}</p>
      </div>
      {console.log(track, track.preview_url)}
      { !track.preview_url ? (
          <button className="btnNoPreview">No Preview</button>
        ) : currentTrackPlaying === track.preview_url ? (
          <button onClick={() => handlePlayPreview(track.preview_url)} className="btnStop">Stop</button>
        ) : (
          <button onClick={() => handlePlayPreview(track.preview_url)} className="btnPlay">Play</button>
        )
      }
      <button onClick={onClick}>{addOrRemove}</button>
    </div>
  )
};