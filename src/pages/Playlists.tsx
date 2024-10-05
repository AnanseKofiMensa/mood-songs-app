// src/pages/Playlists.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSpotify } from 'react-icons/fa'; // Import Spotify icon

function Playlists() {
  const [token, setToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchPlaylists(storedToken);
    }
  }, []);

  const fetchPlaylists = async (token: string) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylists(response.data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  return (
    <div>
      <h2>Your Playlists <FaSpotify style={{ color: '#1db954' }} /></h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <div className="playlist-info">
              <img src={playlist.images[0]?.url || 'https://via.placeholder.com/50'} alt={playlist.name} />
              <Link to={`/playlist/${playlist.id}`}>{playlist.name}</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
