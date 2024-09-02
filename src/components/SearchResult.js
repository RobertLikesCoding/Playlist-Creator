import React, {useState} from 'react';
// import styles from '../styles/SearchResult.module.css';

export default function SearchResult({onArtistSelect, artists}) {

  async function handleArtistSelect(artist) {
    const artistURI = removeUriPrefix(artist.uri);
    await onArtistSelect(artistURI);
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