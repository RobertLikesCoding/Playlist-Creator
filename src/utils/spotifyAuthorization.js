// Authorization

export async function redirectToAuthCodeFlow(clientId) {
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

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
}

// Getting Access Tokens

export async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");

  // Check if the verifier is available
  if (!verifier) {
    console.error("Verifier is missing. Redirecting to authorization flow again.");
    redirectToAuthCodeFlow(clientId); // Redirect to authenticate again
    return null;
  }

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
    const data = await response.json();
    if (!response.ok) {
      console.error("Failed to get access token:", data);
      return null;
    }

    const expiresIn = data.expires_in;
    const expirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem("access_token", data.access_token);
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }
    localStorage.setItem("token_expires_at", expirationTime.toString());

    return data.accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
}

export async function getRefreshToken(clientId) {
  const refreshToken = localStorage.getItem("refresh_token");
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

  localStorage.setItem("access_token", data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem("refresh_token", data.refreshToken);
  }
}