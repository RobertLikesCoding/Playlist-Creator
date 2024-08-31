import React, {useState} from 'react';
import styles from '../styles/SearchResult.module.css';

export default function SearchResult(props) {
  const [selectedArtist, setSelectedArtist] = useState('');

  function handleArtistSelect(artist) {
    // send fetch to find artists top tracks
  }

  return (
    <div className="dropdown">
      <ul>
        {props.artists.map((artist) => {
          return <li key={artist.id} onClick={() => handleArtistSelect(artist)}>{artist.name}</li>
        })}
      </ul>
    </div>
  )
}