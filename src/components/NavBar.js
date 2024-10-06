import React, { useState, useEffect } from 'react';
import styles from '../styles/NavBar.module.css';

export default function NavBar({ userData }) {
  const [modalContent, setModalContent] = useState([]);

  useEffect(() => {
    if (!userData) {
      const loginModal = (
        <>
          <i className="fa-solid fa-hand-peace"></i>
          <p id="explain">I build this project to try the Spotify API and practice my React skills.
            There is no real 'log in' feature, because it would require me to ask Spotify to extend my
            access permission.</p>
            <p>What you can do:</p>
            <ul>
              <li>Search for artists</li>
              <li>Preview Tracks</li>
              <li>Add them to the Playlist Box</li>
              <li>Click Save</li>
            </ul>
          <div className={styles.btnLogin} onClick={handleClose}>
            <span id={styles.login}>Lets go!</span>
          </div>
        </>
      );
      setModalContent([loginModal, false]);
    } else {
      setModalContent([]);
    }
  }, [userData]);

  // async function handleLogin() {
  //   localStorage.clear();
  //   await redirectToAuthCodeFlow();
  //   return;
  // }

  function handleClose() {
    setModalContent(null);
  }

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