import React, {useState, useEffect, useRef} from 'react';
import './styles/App.css';
import SearchBar from './components/SearchBar';
import Tracklist from './components/Tracklist';
import Playlist from './components/Playlist';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [topTracks, setTopTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [currentTrackPlaying, setCurrentTrackPlaying] = useState(null);
  const audio = useRef(null);

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
      console.error('Error:', error);
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

  const handlePlayPreview = (trackPreviewUrl) => {
    if (audio.current) {
      audio.current.pause();
      audio.current = null;
      setCurrentTrackPlaying(null)
    }

    if (trackPreviewUrl !== currentTrackPlaying) {
      setCurrentTrackPlaying(trackPreviewUrl)
    }
  }

  function stopAllAudio() {
    const audioElements = document.querySelectorAll('audio');

    audioElements.forEach((preview) => {
      preview.pause();
      preview.currentTime = 0;
    })
  }

  useEffect(() => {
    if (currentTrackPlaying === null) {
      audio.current = null;
    } else {
      audio.current = new Audio(currentTrackPlaying);
      audio.current.play();
    }
  }, [currentTrackPlaying]);

  function saveSession(playlistTracks, topTracks) {
    const session = {
      "searchQuery": searchQuery,
      "playlistName": playlistName,
      "playlistTracks": JSON.stringify(playlistTracks),
      "topTracks": JSON.stringify(topTracks)
    }

    localStorage.setItem("session", JSON.stringify(session));
  }

  function restoreSession() {
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) {
      return null;
    }

    setTopTracks(JSON.parse(session.topTracks));
    setPlaylistTracks(JSON.parse(session.playlistTracks));
    setSearchQuery(session.searchQuery);
    setPlaylistName(session.playlistName);
    localStorage.removeItem('session')
  };

  useEffect(() => {
    restoreSession();
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Create your Playlist</h1>
      </header>
      <SearchBar onSearch={searchForArtist} onArtistSelect={fetchArtistTopTracks} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <div className='container'>
        <Tracklist
          topTracks={topTracks}
          handleAdd={handleAdd}
          currentTrackPlaying={currentTrackPlaying}
          handlePlayPreview={handlePlayPreview}
          />
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
