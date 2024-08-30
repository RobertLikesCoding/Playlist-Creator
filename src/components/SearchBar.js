import React, {useState} from 'react';
import styles from '../styles/SearchBar.module.css';

export default function SearchBar() {
  const [search, setSearch] = useState('');

  function handleSearch(event) {
    setSearch(event.target.value);
  }

  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="Search for artist..." value={search} onChange={handleSearch} />
    </div>
  );
}