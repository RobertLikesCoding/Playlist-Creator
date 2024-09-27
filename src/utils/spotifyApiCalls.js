import { redirectToAuthCodeFlow, getAccessToken, getRefreshToken } from "./spotifyAuthorization";

export async function fetchAccessTokenForSearching() {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        'client_secret': process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch token');
    }
    const data = await response.json();
    localStorage.setItem("search_token",data.access_token)
  } catch (error) {
    console.error('Error:', error);
    }
}

export async function searchForArtist(query) {
  try {
    const accessToken = localStorage.getItem('search_token');
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to load response');
    }
    const data = await response.json();
    return data.artists.items;
  } catch (error) {
    console.error('Error:', error);
  }
};

export async function fetchArtistTopTracks(uri) {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch(`https://api.spotify.com/v1/artists/${uri}/top-tracks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to get artists top tracks');
    }
    const data = await response.json()
    return data.tracks
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function createPlaylist(playlistName, trackUris) {
  try {
    let accessToken = localStorage.getItem('access_token');
    console.log('check expiry')
    const validatedToken = await validateAccessToken(accessToken)
    if (!validatedToken) {
      console.error('Token validation failed.');
      return; // to stop executing if validation failed
    };

    const user = await fetchUser(validatedToken);

    const response = await fetch(
      `https://api.spotify.com/v1/users/${user.id}/playlists`,
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

export async function validateAccessToken(accessToken) {
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
    console.log('check expiry')
    accessToken = await getRefreshToken();
  }

  return accessToken;
}

export async function fetchUser(token) {
  const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { "Authorization": "Bearer " + token }
  })
  const data = await response.json();
  if (!data.id) {
    // await redirectToAuthCodeFlow();
    throw new Error("Failed to fetch user profile.");
  }
  return data;
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