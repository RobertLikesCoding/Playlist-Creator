import { redirectToAuthCodeFlow, getAccessToken, getRefreshToken } from "./spotifyAuthorization";

const clientId = "9176b7ef419541fea4e1b9e3aef00813";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export default async function createPlaylist(playlistName, trackUris) {
  console.log(trackUris);

  try {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken || isTokenExpired()) {
      await getRefreshToken(clientId);
      if (!code) {
        await redirectToAuthCodeFlow(clientId);
        return;
      }
      accessToken = await getAccessToken(clientId, code);
      if (!accessToken) {
        await redirectToAuthCodeFlow(clientId);
        return;
      }
    }

    const profile = await fetchProfile(accessToken);
    if (!profile.id) {
      throw new Error("Failed to fetch user profile.");
    }

    const userId = profile.id;
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

    const playlistData = await response.json();
    const playlistId = playlistData.id
    addTracksToPlaylist(playlistId, accessToken, trackUris)

  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchProfile(token) {
  const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { "Authorization": "Bearer " + token }
  })
  return await response.json();
}

function isTokenExpired() {
  const expirationTime = parseInt(localStorage.getItem("token_expires_at"), 10);
  return Date.now() > expirationTime;
}

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