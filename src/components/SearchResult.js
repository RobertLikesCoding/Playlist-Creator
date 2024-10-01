import React from 'react';
import styles from '../styles/SearchResult.module.css';
import { fetchArtistTopTracks } from '../utils/spotifyApiCalls';

export default function SearchResult({artists, setTopTracks, setSearchQuery, setArtists}) {

  async function handleArtistSelect(artist) {
    const artistName = removeUriPrefix(artist.name);
    const topTracks = await fetchArtistTopTracks(artistName);
    setTopTracks(topTracks);
    setArtists([]);
  }

  function removeUriPrefix(uri) {
    return uri.replace(/^spotify:artist:/, '');
  }

  return (
    <div className={styles.dropDown}>
      <ul>
        {artists.map((artist) => {
          return <li key={artist.id} onClick={() => handleArtistSelect(artist)}>{artist.name}</li>
        })}
      </ul>
    </div>
  )
}