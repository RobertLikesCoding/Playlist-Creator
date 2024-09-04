import React, {useState} from 'react';
import Track from './Track';

export default function Playlist({playlistTracks, handleRemove}) {
  const [playlistName, setPlaylistName] = useState('');

  function handleChange({target}) {
    setPlaylistName(target.value)
  }

  function handleSubmit(e) {
    playlistTracks.map((track) => {
      return track.id
    })
  }

  return (
    <div className='playlist'>
      <h2>Playlist</h2>
      <form>
        <label for='playlistName'>Name your playlist: </label>
        <input name='playlistName' type='text' onChange={handleChange}/>
        <ul>
          {playlistTracks.map((track) => {
            return <Track track={track} key={track.id} addOrRemove='remove' onClick={(e) => handleRemove(track)}/>
          })}
        </ul>
        <button type='submit' onClick={handleSubmit}>Save to Spotify</button>
      </form>
    </div>
  )
}