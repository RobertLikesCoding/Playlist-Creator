import React, {useState} from 'react';
import Track from './Track';
import { getAccessToken } from '../utils/spotifyAuthorization.js'
import createPlaylist from '../utils/spotifyApiCalls.js'

export default function Playlist({playlistTracks, setPlaylistTracks, handleRemove, saveSession, restoreSession}) {
  const [playlistName, setPlaylistName] = useState('');

  function handleChange({target}) {
    setPlaylistName(target.value)
  }

  function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("Code?", code);

    const trackUris = playlistTracks.map((track) => {
      return track.uri
    });
    if (trackUris.length === 0) {
      alert("You forgot to add tracks to your playlist!");
      return;
    } else if (!playlistName) {
      alert("Give your playlist a name!");
      return;
    }
    if (code) {
      console.log("Code found. Getting access token.")
      const accessToken = getAccessToken(code)
      console.log(accessToken)
      createPlaylist(playlistName, trackUris)
    }

    if (!code) {
    console.log('no verifier found')
      saveSession();
      setTimeout(() => {
        createPlaylist(playlistName, trackUris);
        restoreSession();
      },3000);
    }

    createPlaylist(playlistName, trackUris);
    setPlaylistTracks([]);
    setPlaylistName('');
  }

  return (
    <div className='playlist'>
      <h2>Playlist</h2>
      <form>
        <label htmlFor='playlistName'>Name your playlist: </label>
        <input id="playlistName" name='playlistName' type='text' value={playlistName} onChange={handleChange}/>
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