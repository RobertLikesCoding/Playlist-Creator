import React, { useState, useEffect } from 'react';
import { redirectToAuthCodeFlow } from '../utils/spotifyAuthorization';
import styles from '../styles/NavBar.module.css';
import Notifier from '../components/Notifier';

export default function NavBar({ userData }) {
  const [modalContent, setModalContent] = useState([]);

  useEffect(() => {
    if (!userData) {
      const loginModal = (
        <>
          <i className="fa-solid fa-hand-peace"></i>
          <p>To use this app, please login to Spotify. <br></br>Thank you!</p>
          <div className={styles.btnLogin} onClick={handleLogin}>
            <span id={styles.login}>Login to Spotify</span>
            <i className="fa-brands fa-spotify"></i>
          </div>
        </>
      );
      setModalContent([loginModal, false]);
    } else {
      setModalContent([]);
    }
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
          <div className={styles.avatar}>
              <span>Hello, {userData.display_name}!</span>
              <img src={userData.images[0].url} alt={`Your avatar.`} />
          </div>
        ) : (
          <Notifier modalContent={modalContent} />
        )
      }
    </nav>
  )
}