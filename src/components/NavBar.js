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
        <span>Hello, Michael!</span>
        <img src="https://www.profilebakery.com/wp-content/uploads/2024/05/Profile-picture-created-with-ai.jpeg" alt="portrait of user." />
      </div>
    </nav>
  )
}