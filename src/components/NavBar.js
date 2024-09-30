import React, { useEffect } from 'react';
import { redirectToAuthCodeFlow } from '../utils/spotifyAuthorization';
import styles from '../styles/NavBar.module.css';

export default function NavBar({ userData }) {
  useEffect(() => {
    // You can add any side effects here if needed
  }, [userData]);

  async function handleLogin() {
    await redirectToAuthCodeFlow();
    return;
  }


  return (
    <nav>
      <span id={styles.logo}>Playlist Creator</span>
        { userData ? (
          <div className={styles.btnLogin}>
              <span>Hey there, {userData.display_name}!</span>
              <img src={userData.images[0].url} alt={`Your avatar.`} />
          </div>
        ) : (
          <div className={styles.btnLogin}>
            <span onClick={handleLogin} id={styles.login}>Login</span>
          </div>
        )
      }
    </nav>
  )
}