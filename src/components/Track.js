import React from 'react';

export default function Track({track, addOrRemove, onClick, currentTrackPlaying, handlePlayPreview}) {
  const artists = track.artists.map((artist) => artist.name).join(', ');
  const coverImage = track.album.images[2].url;

  return (
    <div className='trackCard'>
      <div className="coverImg">
        <img src={coverImage} alt={`cover art of the song ${track.name}.`}/>
      </div>
      <div className="trackInfo">
        <h3>{track.name}</h3>
        <p>Artist: {artists}</p>
        <p>Album: {track.album.name}</p>
      </div>
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