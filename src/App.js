import React, {useState, useEffect} from 'react';
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
  const [accessToken, setAccessToken] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const firstVisit = localStorage.getItem('firstVisit');
      if (!firstVisit) {
        const loginModal = (
          <>
            <i className="fa-solid fa-hand-peace"></i>
            <p id="explain">I build this project to try the Spotify API and practice my React skills.
              There is no real 'log in' feature, because it would require a permission by Spotify to extend my
              access permission beyond development mode.</p>
              <p>What you can do:</p>
              <ul>
                <li>Search for artists</li>
                <li>Look through their Tracks</li>
                <li>Add them to the Playlist Box</li>
                <li>Click Save (It's not really saving!)</li>

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

  return (
    <div className="App">
      <NavBar accessToken={accessToken}/>
      <div className="main" >
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
          modalStatus={modalContent}
          setModalContent={setModalContent}
          />
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
export { SearchBar, Tracklist };
