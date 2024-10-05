import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Playlists from './pages/Playlists';
import MoodSearch from './pages/MoodSearch';
import EditPlaylist from './pages/EditPlaylist';
import Navbar from './components/Navbar'; // Import the Navbar component
import './styles/App.css'; // Existing global styles

const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_SCOPES = [
  'playlist-read-private',       // Read private playlists
  'playlist-read-collaborative', // Read collaborative playlists
  'playlist-modify-public',      // Modify public playlists
  'playlist-modify-private',     // Modify private playlists
  'user-library-read',           // Access user library (saved tracks)
].join('%20');  // Join scopes with %20 for URL encoding

function App() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Step 1: Check if there's a token in localStorage or in the URL (OAuth redirect flow)
    const tokenFromStorage = window.localStorage.getItem('token');
    if (tokenFromStorage) {
      setSpotifyToken(tokenFromStorage); // Token already exists
      if (window.location.pathname === '/') {
        navigate('/playlists'); // Redirect to playlists page only if on the login page
      }
    } else {
      // Check if token is in the URL after OAuth login
      const hash = window.location.hash;
      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      if (token) {
        window.localStorage.setItem('token', token); // Store token in localStorage
        setSpotifyToken(token);
        if (window.location.pathname === '/') {
          navigate('/playlists'); // Redirect to playlists page only if on the login page
        }
      }
    }
  }, [navigate]);

  // Step 2: Login function to redirect to Spotify for authentication
  const loginToSpotify = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);

    const authUrl = `${SPOTIFY_AUTHORIZE_URL}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${SPOTIFY_SCOPES}`;
    window.location.href = authUrl; // Redirect to Spotify login
  };

  return (
    <div className="App">
      <Navbar /> {/* Include the Navbar component */}
      <Routes>
        {/* Step 3: Define a route for "/" that handles login */}
        <Route
          path="/"
          element={
            !spotifyToken ? (
              <div className="login-container">
                <h1>Login with Spotify</h1>
                <button onClick={loginToSpotify}>Login to Spotify</button>
              </div>
            ) : (
              <div>Redirecting...</div> // Simple loader while redirecting
            )
          }
        />

        {/* Other routes that require the token */}
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlist/:id" element={<EditPlaylist />} />
        <Route path="/mood-search" element={<MoodSearch />} />
        {/* Additional routes related to mood search */}
        <Route path="/mood-search/:mood" element={<MoodSearch />} />
      </Routes>
    </div>
  );
}

// Step 4: Wrap the App in BrowserRouter for React Router functionality
function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default WrappedApp;