const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
// const redirectUrl = "https://rlc-playlist-creator.netlify.app/";

function isTokenExpired() {
  const expirationTime = parseInt(localStorage.getItem("expires_in"), 10);
  return Date.now() > expirationTime;
}

export async function checkTokenExpiry() {
  if (isTokenExpired()) {
    let accessToken = await getRefreshToken();
    return accessToken
  }
}

async function getRefreshToken() {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    // if (!refreshToken) {
    //   await redirectToAuthCodeFlow();
    //   return;
    // }
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    };
    const response = await fetch("https://accounts.spotify.com/api/token", payload);
    const data = await response.json();

    localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

