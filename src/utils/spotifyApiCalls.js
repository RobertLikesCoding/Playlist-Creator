import { redirectToAuthCodeFlow, getAccessToken, getRefreshToken } from "./spotifyAuthorization";

export default async function createPlaylist(playlistName, trackUris) {
  try {
    let accessToken = localStorage.getItem('access_token');
    const validatedToken = await validateAccessToken(accessToken)
    if (!validatedToken) {
      console.error('Token validation failed.');
      return; // to stop executing if validation failed
    };

    const userId = await fetchUserId(validatedToken);
    const response = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + validatedToken,
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
    await addTracksToPlaylist(playlistId, validatedToken, trackUris)
    return true;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function validateAccessToken(accessToken) {
  const code = new URLSearchParams(window.location.search).get("code");

  if (!accessToken) {
    if (!code) {
      await redirectToAuthCodeFlow();
      return false;
    }
    accessToken = await getAccessToken(code);
    if (!accessToken) {
      await redirectToAuthCodeFlow();
      return false;
    }
  }

  if (isTokenExpired()) {
    accessToken = await getRefreshToken();
  }
  
  return accessToken;
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

function isTokenExpired() {
  const expirationTime = parseInt(localStorage.getItem("expires_in"), 10);
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