import React, {useState, useEffect} from 'react';
import './styles/App.css';
import SearchBar from './components/SearchBar';
import Tracklist from './components/Tracklist';
import Playlist from './components/Playlist';
import { saveSession } from './utils/spotifyApiCalls.js'
import { restoreSession } from './utils/spotifyApiCalls.js'

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [topTracks, setTopTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [artistUri, setArtistUri] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('');

  const fetchAccessToken = async () => {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': process.env.REACT_APP_SPOTIFY_CLIENT_ID,
          'client_secret': process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }
      const data = await response.json();
      setAccessToken(data.access_token);
    } catch (error) {
      console.error('Error:', error);
      }
  }
  useEffect(() => {
    fetchAccessToken();
  }, []);

  const searchForArtist = async (query) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to load response');
      }
      const data = await response.json();
      return data.artists.items;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const fetchArtistTopTracks = async (uri) => {
    try {
      setArtistUri(uri);
      const response = await fetch(`https://api.spotify.com/v1/artists/${uri}/top-tracks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to get artists top tracks');
      }
      const data = await response.json()
      setTopTracks(data.tracks);
    } catch (error) {
      console.log('Error:', error);
    }
  }
  const handleAdd = (track) => {
    setPlaylistTracks((prevPlaylistTracks) => {
      if (!prevPlaylistTracks.some((t) => t.id === track.id)) {
        return [...prevPlaylistTracks, track];
      }
      return prevPlaylistTracks;
    });
  };

  const handleRemove = (track) => {
    setPlaylistTracks((prevPlaylistTracks) => {
      return prevPlaylistTracks.filter((t) => t.id !== track.id);
    });
  };

  function saveSession(playlistTracks, topTracks) {
    const searchQuery = document.getElementById('searchBar').value;
    const playlistName = document.getElementById('playlistName').value;
    const session = {
      "searchQuery": searchQuery,
      "playlistName": playlistName,
      "playlistTracks": JSON.stringify(playlistTracks),
      "topTracks": JSON.stringify(topTracks)
    }
    console.log("Session: ", session);

    localStorage.setItem("session", JSON.stringify(session));
  }

  function restoreSession() {
    console.log('looking for session');
    const session = JSON.parse(localStorage.getItem("session"));
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!session) {
      console.log("Currently no session saved");
      return;
    }
    if (code) {
      console.log("Code found now during restore: ", code);
    }

    console.log('restoring session');

    setSearchQuery(session.searchQuery);
    const topTracks = session.topTracks;
    setTopTracks(JSON.parse(topTracks));
    const playlistTracks = session.playlistTracks;
    setPlaylistTracks(JSON.parse(playlistTracks));
    const playlistNameInput = document.getElementById("playlistName");
    playlistNameInput.value = session.playlistName;

    localStorage.removeItem('session')
    console.log('removed session from localStorage')
  };
  useEffect(() => {
    restoreSession();
  },[])

  function resetSession() {

  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Create your Playlist</h1>
      </header>
      <SearchBar onSearch={searchForArtist} onArtistSelect={fetchArtistTopTracks} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <div className='container'>
        <Tracklist topTracks={topTracks} handleAdd={handleAdd}/>
        <Playlist
        playlistTracks={playlistTracks}
        setPlaylistTracks={setPlaylistTracks}
        handleRemove={handleRemove}
        saveSession={() => saveSession(playlistTracks, topTracks)}
        restoreSession={() => restoreSession()}
        setTopTracks={setTopTracks}
        setSearchQuery={setSearchQuery}
        playlistName={playlistName}
        setPlaylistName={setPlaylistName}/>
      </div>
    </div>
  );
}

export default App;
export { SearchBar, Tracklist };
