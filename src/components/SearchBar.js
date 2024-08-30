import React, {useState} from 'react';
import styles from '../styles/SearchBar.module.css';

export default function SearchBar() {
  const [search, setSearch] = useState('');

  // Fetching the access token
  fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'grant-type': 'client_credentials',
      'client-id': '9176b7ef419541fea4e1b9e3aef00813',
      'client-secret': '4c59a512f5064dbda406daf9d782afdf'
    })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch token');
      } else {
        return response.json();
      }}).then(data => {
        const accessToken = data.access_token;
        console.log(data);
      }).catch(error => {
        console.error(error);
      });

  function handleSearch(event) {
    setSearch(event.target.value);

  }

  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="Search for artist..." value={search} onChange={handleSearch} />
    </div>
  );
}