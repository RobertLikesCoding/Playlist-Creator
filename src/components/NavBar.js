import React, { useEffect } from 'react';
import { redirectToAuthCodeFlow } from '../utils/spotifyAuthorization';
import styles from '../styles/NavBar.module.css';

export default function NavBar({ userData }) {
  useEffect(() => {
  }, [userData]);

  async function handleLogin() {
    localStorage.clear();
    await redirectToAuthCodeFlow();
    return;
  }


  return (
    <nav>
      <span id={styles.logo}>
        <i className="fa-brands fa-spotify"></i>
        Playlist Creator
      </span>
        { userData ? (
          <div className={styles.btnLogin}>
              <span>Hello, {userData.display_name}!</span>
              <img src={userData.images[0].url} alt={`Your avatar.`} />
          </div>
        ) : (
          <div className={styles.btnLogin} onClick={handleLogin}>
            <span id={styles.login}>Login</span>
            <i className="fa-regular fa-circle-user"></i>
          </div>
        )
      }
    </nav>
  )
}