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

  function handleClick({target}) {
    target.value = "";
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <div className={styles.search}>
          <input type="text" placeholder="Search for artist..." value={searchQuery} onChange={handleSearch} onClick={handleClick}/>
          <i className="fa fa-search"></i>
        </div>
        <SearchResult
        setArtists={setArtists}
        artists={artists}
        setTopTracks={setTopTracks}
        setSearchQuery={setSearchQuery}
        />
      </div>
    </>
  );
}