import React, { useEffect } from 'react';
import { redirectToAuthCodeFlow } from '../utils/spotifyAuthorization';
import styles from '../styles/NavBar.module.css';

export default function NavBar({ userData }) {
  useEffect(() => {
  }, [userData]);

  async function handleLogin() {
    await redirectToAuthCodeFlow();
    return;
  }


  return (
    <nav>
      <span id={styles.logo}>
        <i class="fa-solid fa-music"></i>
        Playlist Creator
      </span>
        { userData ? (
          <div className={styles.btnNavbar}>
              <span>Hey there, {userData.display_name}!</span>
              <img src={userData.images[0].url} alt={`Your avatar.`} />
          </div>
        ) : (
          <div className={styles.btnNavbar}>
            <span onClick={handleLogin} id={styles.login}>Login</span>
            <i className="fa-regular fa-circle-user"></i>
          </div>
        )
      }
    </nav>
  )
}