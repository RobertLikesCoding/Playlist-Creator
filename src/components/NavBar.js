import React from 'react';
import { redirectToAuthCodeFlow, getAccessToken } from '../utils/spotifyAuthorization';

export default function NavBar({ userAvatar }) {

  async function handleLogin() {
    // const verifier = await redirectToAuthCodeFlow();
    // await getAccessToken();
    // return;
  }

  return (
    <nav>
      <span className="logo">Playlist Creator</span>
      <div>
        <span onClick={handleLogin}>Login</span>
        <img src={userAvatar} alt={`Your avatar.`} />
      </div>
    </nav>
  )
}