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
    console.log(data);
    localStorage.setItem("access_token",data.access_token)
    localStorage.setItem("expires_in",data.expires_in)
  } catch (error) {
    console.error('Error:', error);
    }
}

export async function searchForArtist(query) {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=10`, {
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

export async function fetchArtistTopTracks(name) {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=track&limit=30`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to get artists top tracks');
    }
    const data = await response.json()
    return data.tracks.items
  } catch (error) {
    console.error('Error:', error);
  }
}

// function isTokenExpired() {
//   const expirationTime = parseInt(localStorage.getItem("expires_in"), 10);
//   return Date.now() < expirationTime;
// }
