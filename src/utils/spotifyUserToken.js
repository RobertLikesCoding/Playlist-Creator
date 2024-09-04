async function getUserAccessToken() {
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const codeVerifier = generateRandomString(64);

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const clientId = "9176b7ef419541fea4e1b9e3aef00813";
  const redirectUri = "http://localhost:3000";

  const scope = "user-read-private user-read-email";
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  // generated in the previous step
  window.localStorage.setItem("code_verifier", codeVerifier);

  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();

  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");

  // stored in the previous step
  let localVerifier = localStorage.getItem("code_verifier");

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: localVerifier,
    }),
  };

  try {
    const body = await fetch("https://accounts.spotify.com/api/token", payload);
    const response = await body.json();
    localStorage.setItem("access_token", response.access_token);
    console.log("Access token obtained:", response.access_token);
  } catch (error) {
    console.log("Error: ", error);
  }
}

export default async function createPlaylist(clientId) {
  try {
    let accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      accessToken = await getUserAccessToken();
    }

    const response = await fetch(
      `https://api.spotify.com/v1/users/${clientId}/playlists`,
      {
        method: "POST",
        headers: {
          header: "Content-Type: application/json",
          authorization: "Bearer " + accessToken,
        },
        body: {
          name: "New Playlist",
          description: "New playlist description",
          public: false,
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
