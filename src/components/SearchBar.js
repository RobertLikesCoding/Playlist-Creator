import React, { useState } from 'react';
import styles from '../styles/SearchBar.module.css';
import SearchResult from './SearchResult'
import { searchForArtist } from '../utils/spotifyApiCalls';

export default function SearchBar({setSearchQuery, searchQuery, setTopTracks}) {
  const [artists, setArtists] = useState([]);

  async function handleSearch({target}) {
    const query = target.value;
    if (query) {
      setSearchQuery(query);
      if (searchQuery) {
        const results = await searchForArtist(searchQuery);
        setArtists(results);
      }
    } else {
      setSearchQuery("")
      setArtists([]);
    }
  };

  return (
    <div className={styles.searchBar}>
      <input id="searchBar" type="text" placeholder="Search for artist..." value={searchQuery} onChange={handleSearch} />
      <SearchResult artists={artists} setTopTracks={setTopTracks}/>
    </div>
  );
}