import React, {useState, useEffect, useRef} from 'react';
import './styles/App.css';
import SearchBar from './components/SearchBar';
import Tracklist from './components/Tracklist';
import Playlist from './components/Playlist';
import NavBar from './components/NavBar';
import { fetchAccessTokenForSearching, fetchUser, validateAccessToken } from './utils/spotifyApiCalls';
import { getAccessToken } from './utils/spotifyAuthorization';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [topTracks, setTopTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [currentTrackPlaying, setCurrentTrackPlaying] = useState(null);
  const [userAvatar, setUserAvatar] = useState('');
  const audio = useRef(null);

  async function initializeApp() {
    const token = await fetchAccessTokenForSearching();
    setAccessToken(token);
    const localAccessToken = localStorage.getItem('access_token');
      if (!localAccessToken) {
        return;
      }

    const validatedToken = await validateAccessToken(localAccessToken);
    await getUserAvatar(validatedToken);
  };

  async function loginAfterAuthorization() {
    const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await getAccessToken(code);
      }
  }

  async function getUserAvatar(validatedAccessToken) {
    const user = await fetchUser(validatedAccessToken);
    setUserAvatar(user.images[0].url);
  }

  useEffect(() => {
    initializeApp();
    loginAfterAuthorization()
  }, []);



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
    if (playlistTracks.some(t => t.id === track.id)) {
      alert('Track already added');
    }
    setPlaylistTracks((prevPlaylistTracks) => {
      if (!prevPlaylistTracks.some((t) => t.id === track.id)) {
        return [track, ...prevPlaylistTracks];
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
      setCurrentTrackPlaying(null);
    }

    if (trackPreviewUrl !== currentTrackPlaying) {
      setCurrentTrackPlaying(trackPreviewUrl)
    }
  }

  // function stopAllAudio() {
  //   const audioElements = document.querySelectorAll('audio');

  //   audioElements.forEach((preview) => {
  //     preview.pause();
  //     preview.currentTime = 0;
  //   })
  // }

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
      <NavBar userAvatar={userAvatar}/>
      <header className="App-header">
        <h1>Search for an Artist or Track name
        to start creating a playlist</h1>
        <SearchBar onArtistSelect={fetchArtistTopTracks} accessToken={accessToken} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      </header>
      <main>
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
          setPlaylistName={setPlaylistName}
          handlePlayPreview={handlePlayPreview}
          currentTrackPlaying={currentTrackPlaying}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
export { SearchBar, Tracklist };
