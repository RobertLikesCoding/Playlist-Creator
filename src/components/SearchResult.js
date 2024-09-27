import React from 'react';
import styles from '../styles/SearchResult.module.css';
import { fetchArtistTopTracks } from '../utils/spotifyApiCalls';

export default function SearchResult({onArtistSelect, artists, setTopTracks}) {

  async function handleArtistSelect(artist) {
    const artistURI = removeUriPrefix(artist.uri);
    const topTracks = await fetchArtistTopTracks(artistURI);
    setTopTracks(topTracks);
  }

  function removeUriPrefix(uri) {
    return uri.replace(/^spotify:artist:/, '');
  }

  return (
    <div className="dropdown">
      <ul>
        {artists.map((artist) => {
          return <li key={artist.id} onClick={() => handleArtistSelect(artist)}>{artist.name}</li>
        })}
      </ul>
    </div>
  )
}