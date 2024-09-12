import React, { useState } from 'react';
import styles from '../styles/SearchBar.module.css';
import SearchResult from './SearchResult'

export default function SearchBar({onSearch, onArtistSelect, setSearchQuery, searchQuery}) {
  const [artists, setArtists] = useState([]);


  async function handleSearch({target}) {
    const query = target.value;
    setSearchQuery(query);
    if (query) {
      const results = await onSearch(query);
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