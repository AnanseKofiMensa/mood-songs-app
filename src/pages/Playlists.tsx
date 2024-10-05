import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSpotify } from 'react-icons/fa';

function Playlists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Store error messages
  const spotifyToken = window.localStorage.getItem('token'); // Get the token from localStorage

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!spotifyToken) {
        setErrorMessage('Spotify token is missing.');
        return;
      }

      try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${spotifyToken}`, // Pass token in Authorization header
          },
        });

        // Check if playlists were fetched successfully
        if (response.data && response.data.items) {
          setPlaylists(response.data.items);
        } else {
          setErrorMessage('No playlists found or unable to fetch playlists.');
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setErrorMessage('Failed to fetch playlists. Please try again.');
      }
    };

    fetchPlaylists();
  }, [spotifyToken]);

  return (
    <div className="page-container">
      <h2>Your Playlists <FaSpotify style={{ fontSize: '20px', color: '#1db954' }} /></h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Show error message */}
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <div className="playlist-info">
              <img
                src={playlist.images[0]?.url || 'https://via.placeholder.com/50'}
                alt={playlist.name}
                className="playlist-image"
              />
              <Link to={`/playlist/${playlist.id}`}>{playlist.name}</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
