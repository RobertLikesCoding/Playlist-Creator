import { redirectToAuthCodeFlow, getAccessToken } from "./spotifyAuthorization";

const clientId = "9176b7ef419541fea4e1b9e3aef00813";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export default async function createPlaylist(playlistName) {
  try {
    // add expiration check
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      if (!code) {
        redirectToAuthCodeFlow(clientId);
        return;
      }
      accessToken = await getAccessToken(clientId, code);
    }
    const profile = await fetchProfile(accessToken);
    console.log(profile.id);
    const userId = profile.id;

    const response = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + accessToken,
        },
        body: {
          "name": playlistName,
          "description": "New playlist description",
          "public": false,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to process the request");
    }
    const playlistData = await response.json();
    console.log("Playlist created:", playlistData);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchProfile(token) {
  return fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => response.json());
}