import React, {useState} from 'react';
// import styles from '../styles/SearchResult.module.css';
import Tracklist from './Tracklist'

export default function SearchResult(props) {
  // const [selectedArtist, setSelectedArtist] = useState('');
  const [topTracks, setTopTracks] = useState([]);

  const fetchArtistTopTracks = async (uri) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/artists/${uri}/top-tracks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${props.accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to get artists top tracks');
      }
      const data = await response.json()
      setTopTracks(data.tracks)
    } catch (error) {
      console.log('Error:', error);
    }
    }

  async function handleArtistSelect(artist) {
    const artistURI = removeUriPrefix(artist.uri);
    await fetchArtistTopTracks(artistURI);
  }

  function removeUriPrefix(uri) {
    return uri.replace(/^spotify:artist:/, '');
  }

  return (
    <div className="dropdown">
      <ul>
        {props.artists.map((artist) => {
          return <li key={artist.id} onClick={() => handleArtistSelect(artist)}>{artist.name}</li>
        })}
      </ul>
      <Tracklist topTracks={topTracks} />
    </div>
  )
}