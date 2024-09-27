import React, { useState } from 'react';
import styles from '../styles/SearchBar.module.css';
import SearchResult from './SearchResult'
import { searchForArtist } from '../utils/spotifyApiCalls';

export default function SearchBar({onArtistSelect, setSearchQuery, searchQuery, accessToken}) {
  const [artists, setArtists] = useState([]);

  async function handleSearch({target}) {
    const query = target.value;
    setSearchQuery(query);
    if (searchQuery) {
      const results = await searchForArtist(accessToken, searchQuery);
      setArtists(results);
    } else {
      setArtists([]);
    }

  };

  return (
    <div className={styles.searchBar}>
      <input id="searchBar" type="text" placeholder="Search for artist..." value={searchQuery} onChange={handleSearch} />
      <SearchResult artists={artists} onArtistSelect={onArtistSelect}/>
    </div>
  );
}