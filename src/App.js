import React, {useState, useEffect} from 'react';
import './styles/App.css';
import SearchBar from './components/SearchBar';
import Tracklist from './components/Tracklist';
import Playlist from './components/Playlist';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [topTracks, setTopTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Create your Playlist</h1>
      </header>
      <SearchBar onSearch={searchForArtist} onArtistSelect={fetchArtistTopTracks}/>
      <div className='container'>
        <Tracklist topTracks={topTracks} handleAdd={handleAdd}/>
        <Playlist playlistTracks={playlistTracks} setPlaylistTracks={setPlaylistTracks} handleRemove={handleRemove}/>
      </div>
    </div>
  );
}

export default App;
export { SearchBar, Tracklist };
