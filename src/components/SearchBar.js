import React, { useState } from 'react';
import styles from '../styles/SearchBar.module.css';

export default function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchForArtist = async (query) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${props.accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to load response');
      }
      const data = await response.json();
      const artists = data.artists
      artists.items.forEach((artist) => {
        console.log(artist.name);
      })
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function handleSearch({target}) {
    const query = target.value;
    setSearchQuery(query);

    if (query) {
      searchForArtist(query);
    }
  };

  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="Search for artist..." value={searchQuery} onChange={handleSearch} />
    </div>
  );
}