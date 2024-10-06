import React from 'react';
import styles from '../styles/NavBar.module.css';

export default function NavBar() {

  return (
    <nav>
      <span id={styles.logo}>
        <i className="fa-brands fa-spotify"></i>
        Playlist Creator
      </span>
          <div className={styles.avatar}>
            <span>Hello, Robert!</span>
            <i className="fa-regular fa-circle-user"></i>
          </div>
    </nav>
  )
}