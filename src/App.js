import React from 'react';
import './styles/App.css';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Create your Playlist</h1>
      </header>
      <SearchBar />
    </div>
  );
}

export default App;
