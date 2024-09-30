import React, {useState, useEffect, useRef} from 'react';
import './styles/variables.css';
import './styles/App.css';
import SearchBar from './components/SearchBar';
import Tracklist from './components/Tracklist';
import Playlist from './components/Playlist';
import NavBar from './components/NavBar';
import { fetchAccessTokenForSearching, fetchUser, validateAccessToken } from './utils/spotifyApiCalls';
import { getAccessToken } from './utils/spotifyAuthorization';

function App() {
  const [topTracks, setTopTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [currentTrackPlaying, setCurrentTrackPlaying] = useState(null);
  const [userData, setUserData] = useState('');
  const audio = useRef(null);

  useEffect(() => {
    restoreSession();
    loginAfterAuthorization()
    initializeApp();
  }, []);

  async function initializeApp() {
    await fetchAccessTokenForSearching();
    const localAccessToken = localStorage.getItem('access_token');
      if (!localAccessToken) {
        return;
      }

    const validatedToken = await validateAccessToken(localAccessToken);
    await getUserData(validatedToken);
  };

  async function loginAfterAuthorization() {
    const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await getAccessToken(code);
      }
  }

  async function getUserData(validatedAccessToken) {
    const user = await fetchUser(validatedAccessToken);
    setUserData(user);
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

  return (
    <div className="App">
      <NavBar userData={userData}/>
      <header className="App-header">
        <h1>Search for an Artist
        to start creating a playlist</h1>
        <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setTopTracks={setTopTracks}
        />
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
