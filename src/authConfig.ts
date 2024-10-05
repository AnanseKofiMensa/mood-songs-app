export const authConfig = {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
    scopes: ['user-read-private', 'playlist-modify-private', 'playlist-read-private'],
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
    userinfoEndpoint: 'https://api.spotify.com/v1/me',
  };
