import React, {useState, useEffect, useRef} from 'react';
import './styles/variables.css';
import './styles/App.css';
import SearchBar from './components/SearchBar';
import Tracklist from './components/Tracklist';
import Playlist from './components/Playlist';
import NavBar from './components/NavBar';
import Notifier from './components/Notifier';
import Footer from './components/Footer';
import { fetchAccessTokenForSearching } from './utils/spotifyApiCalls';

function App() {
  const [topTracks, setTopTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [currentTrackPlaying, setCurrentTrackPlaying] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
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
      const firstVisit = localStorage.getItem('firstVisit');
      if (firstVisit === true) {
        const loginModal = (
          <>
            <i className="fa-solid fa-hand-peace"></i>
            <p id="explain">I build this project to try the Spotify API and practice my React skills.
              There is no real 'log in' feature, because it would require me to ask Spotify to extend my
              access permission beyond development mode.</p>
              <p>What you can do:</p>
              <ul>
                <li>Search for artists</li>
                <li>Preview Tracks</li>
                <li>Add them to the Playlist Box</li>
                <li>Click Save</li>
              </ul>
            <div className="btn" onClick={handleClose}>
              <span id="login">Lets go!</span>
            </div>
          </>
        );
        setModalContent([loginModal, false]);
        localStorage.setItem('firstVisit', false);
      }
      await initializeApp();
    };
    initialize();
  }, []);

  async function initializeApp() {
    try {
      await fetchAccessTokenForSearching();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  }

  function handleClose() {
    setModalContent(null);
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

  const stopAudio = () => {
    if (audio.current) {
      audio.current.pause();
      audio.current = null;
    }
  }

  return (
    <div className="App">
      <NavBar accessToken={accessToken}/>
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
          topTracks={topTracks}
          setTopTracks={setTopTracks}
          setSearchQuery={setSearchQuery}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          handlePlayPreview={handlePlayPreview}
          currentTrackPlaying={currentTrackPlaying}
          modalStatus={modalContent}
          setModalContent={setModalContent}
          setCurrentTrackPlaying={setCurrentTrackPlaying}
          stopAudio={stopAudio}
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
