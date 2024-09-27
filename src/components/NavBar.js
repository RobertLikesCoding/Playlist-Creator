import React from 'react';
import { redirectToAuthCodeFlow, getAccessToken } from '../utils/spotifyAuthorization';
import styles from '../styles/NavBar.module.css';

export default function NavBar({ userAvatar }) {

  async function handleLogin() {
    await redirectToAuthCodeFlow();
    return;
  }

  return (
    <nav>
      <span id={styles.logo}>Playlist Creator</span>
      <div className={styles.btnLogin}>
        <span onClick={handleLogin}>Login</span>
        <img src={userAvatar} alt={`Your avatar.`} />
      </div>
    </nav>
  )
}