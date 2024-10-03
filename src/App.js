import React, {useState, useEffect, useRef} from 'react';
import './styles/variables.css';
import './styles/App.css';
import SearchBar from './components/SearchBar';
import Tracklist from './components/Tracklist';
import Playlist from './components/Playlist';
import NavBar from './components/NavBar';
import Notifier from './components/Notifier';
import Footer from './components/Footer';
import { fetchAccessTokenForSearching, fetchUser } from './utils/spotifyApiCalls';
import { getAccessToken, checkTokenExpiry } from './utils/spotifyAuthorization';

function App() {
  const [topTracks, setTopTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [currentTrackPlaying, setCurrentTrackPlaying] = useState(null);
  const [userData, setUserData] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const audio = useRef(null);

  useEffect(() => {
    if (currentTrackPlaying === null) {
      audio.current = null;
    } else {
      audio.current = new Audio(currentTrackPlaying);
      audio.current.play();
    }
  }, [currentTrackPlaying]);

  useEffect(() => {
    const initialize = async () => {
      restoreSession();
      await loginAfterAuthorization();
      await initializeApp();
    };

    initialize();
  }, []);

  async function loginAfterAuthorization() {
    const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await getAccessToken(code);
      }
  }

  async function initializeApp() {
    try {
      await fetchAccessTokenForSearching();
      let accessToken = localStorage.getItem('access_token');

      if (accessToken) {
        const newAccessToken = await checkTokenExpiry();
        if (newAccessToken) {
          await fetchUser(newAccessToken);
        }
        await fetchUser(accessToken);
      }
      const currentUser = JSON.parse(localStorage.getItem('current_user'));
      setUserData(currentUser);
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  }

  const handleAdd = (track) => {
    setPlaylistTracks((prevPlaylistTracks) => {
      if (!prevPlaylistTracks.some((t) => t.id === track.id)) {
        setTopTracks((prevTopTracks) => {
          return prevTopTracks.filter((t) => t.id !== track.id)
        })
        return [track, ...prevPlaylistTracks];
      }
    });
  };

  const handleRemove = (track) => {
    setPlaylistTracks((prevPlaylistTracks) => {
      if (!topTracks.some((t) => t.id === track)) {
        setTopTracks((prevTopTracks) => {
          return [track, ...prevTopTracks];
        })
      }
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
    setModalContent("Authorization Successfull! You can save now")
    localStorage.removeItem('session');
  };

  return (
    <div className="App">
      <NavBar userData={userData}/>
      <main className="main" >
        <Notifier modalContent={modalContent} setModalContent={setModalContent}/>
        <section className="SearchBar">
          <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setTopTracks={setTopTracks}
          />
        </section>
        <div className="container">
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
          topTracks={topTracks}
          setTopTracks={setTopTracks}
          setSearchQuery={setSearchQuery}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          handlePlayPreview={handlePlayPreview}
          currentTrackPlaying={currentTrackPlaying}
          modalStatus={modalContent}
          setModalContent={setModalContent}
          />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
export { SearchBar, Tracklist };
