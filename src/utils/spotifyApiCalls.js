import { redirectToAuthCodeFlow, getAccessToken, getRefreshToken } from "./spotifyAuthorization";

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

export default async function createPlaylist(playlistName, trackUris) {
  try {
    let accessToken = localStorage.getItem('access_token');
    await validateAccessToken(accessToken);

    const userId = await fetchUserId(accessToken);
    const response = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
          name: playlistName,
          description: "New playlist description",
          public: true
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create playlist: ${errorData.error_description || errorData.error}`);
    }

    const data = await response.json();
    const playlistId = data.id
    await addTracksToPlaylist(playlistId, accessToken, trackUris)
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchUserId(token) {
  const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { "Authorization": "Bearer " + token }
  })
  const data = await response.json();
  if (!data.id) {
    throw new Error("Failed to fetch user profile.");
  }
  return data.id
}

async function validateAccessToken(accessToken) {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (isTokenExpired()) {
    await getRefreshToken(clientId);
  }
  if (!accessToken) {
    if (!code) {
      await redirectToAuthCodeFlow(clientId);
      restoreSession();
      return;
    }
    accessToken = await getAccessToken(clientId, code);

    if (!accessToken) {
      await redirectToAuthCodeFlow(clientId);
      return;
    }
  }
}

function isTokenExpired() {
  const expirationTime = parseInt(localStorage.getItem("token_expires_at"), 10);
  return Date.now() > expirationTime;
}

function restoreSession() {
  const searchBar = document.getElementById('searchBar');
  searchBar.value = sessionStorage.getItem("searchQuery");
  const playlistName = document.getElementById('playlistName');
  playlistName.value = sessionStorage.getItem("playlistName");

  const playlistTracks = sessionStorage.getItem("playlistTracks");
  const artistUri = sessionStorage.getItem("artistUri");
  

};

async function addTracksToPlaylist(playlistId, accessToken, trackUris) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "uris": trackUris
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to add tracks to playlist: ${errorData.error_description || errorData.error}`);
  }
}