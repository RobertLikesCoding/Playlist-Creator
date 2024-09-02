import React, {useState, useEffect} from 'react';
import './styles/App.css';
import SearchBar from './components/SearchBar';

function App() {
  const [accessToken, setAccessToken] = useState('');

  const fetchAccessToken = async () => {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': '9176b7ef419541fea4e1b9e3aef00813',
          'client_secret': '4c59a512f5064dbda406daf9d782afdf'
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Create your Playlist</h1>
      </header>
      <SearchBar accessToken={accessToken}/>
    </div>
  );
}

export default App;
