const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

// Authorization

export async function redirectToAuthCodeFlow() {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:3000");
  params.append("scope", "user-read-private playlist-modify-public");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
}

// Getting Access Token

export async function getAccessToken() {
  //if there already is a AT refresh it
  let localAccessToken = localStorage.getItem('access_token');
  if (localAccessToken) {
    if (isTokenExpired()) {
      localAccessToken = await getRefreshToken();
    }
    return localAccessToken;
  }

  const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      await redirectToAuthCodeFlow();
      return false;
    }

  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000");
  params.append("code_verifier", verifier);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });
    if (!response.ok) {
      console.error("Failed to get access token:", response);
      return null;
    }
    const data = await response.json();
    // removing the auth code from the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    const updatedUrl = url.search ? url.href : url.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);

    setValuesToLocalStorage(data);
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}

function isTokenExpired() {
  const expirationTime = parseInt(localStorage.getItem("expires_in"), 10);
  return Date.now() > expirationTime;
}

async function getRefreshToken() {
  try {
    console.log("refreshing")
    const refreshToken = localStorage.getItem("refresh_token");
    console.log(refreshToken)

    if (!refreshToken) {
      await redirectToAuthCodeFlow();
      return;
    }
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

    setValuesToLocalStorage(data);
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

function setValuesToLocalStorage(data) {
  const expiresIn = data.expires_in;
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem("expires_in", expirationTime.toString());
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
}