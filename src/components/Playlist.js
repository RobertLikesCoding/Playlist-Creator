import React, {useState} from 'react';
import Track from './Track';
import { getAccessToken } from '../utils/spotifyAuthorization.js'
import { redirectToAuthCodeFlow } from '../utils/spotifyAuthorization.js'
import createPlaylist from '../utils/spotifyApiCalls.js'

export default function Playlist({playlistTracks, setPlaylistTracks, handleRemove, saveSession, restoreSession}) {
  // const [playlistName, setPlaylistName] = useState('');

  // function handleChange({target}) {
  //   setPlaylistName(target.value)
  // }

  async function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("Code?", code);

    const playlistName = event.target.playlistName.value;
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
      console.log("Code found. Getting access token.");
      const accessToken = await getAccessToken(code);
      console.log("AT recieved: ", accessToken);
    } else {
      console.log('no code found');
      saveSession();
      console.log('session saved');
      setTimeout(async () => {
        await redirectToAuthCodeFlow()
        const newCode = params.get("code");
        const accessToken = await getAccessToken(code);
        console.log("AT recieved: ", accessToken);
      },3000);
    }

    createPlaylist(playlistName, trackUris);
    // setPlaylistTracks([]);
    // setPlaylistName('');
  }

  return (
    <div className='playlist'>
      <h2>Playlist</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='playlistName'>Name your playlist: </label>
        <input id="playlistName" name='playlistName' type='text'/>
        <ul>
          {playlistTracks.map((track) => {
            return <Track track={track} key={track.id} addOrRemove='remove' onClick={(e) => handleRemove(track)}/>
          })}
        </ul>
        <button type='submit'>Save to Spotify</button>
      </form>
    </div>
  )
}