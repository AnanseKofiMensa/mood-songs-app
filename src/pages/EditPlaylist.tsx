// src/pages/EditPlaylist.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Import Trash icon

function EditPlaylist() {
  const { id } = useParams(); // Get playlist ID from URL
  const [token, setToken] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<any | null>(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token');
    if (storedToken && id) {
      setToken(storedToken);
      fetchPlaylist(storedToken, id);
    }
  }, [id]);

  const fetchPlaylist = async (token: string, playlistId: string) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  const removeSong = async (trackUri: string) => {
    try {
      await axios.delete(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          tracks: [{ uri: trackUri }],
        },
      });
      // Update playlist by filtering out the removed track
      setPlaylist({
        ...playlist,
        tracks: {
          ...playlist.tracks,
          items: playlist.tracks.items.filter((item: any) => item.track.uri !== trackUri),
        },
      });
    } catch (error) {
      console.error('Error removing song:', error);
    }
  };

  return (
    <div>
      {playlist ? (
        <>
          <h2>{playlist.name}</h2>
          <ul>
            {playlist.tracks.items.map((item: any) => (
              <li key={item.track.id}>
                <div className="song-info">
                  <img src={item.track.album.images[0]?.url} alt={item.track.name} />
                  <div className="song-details">
                    <strong>{item.track.name}</strong> by {item.track.artists.map((artist: any) => artist.name).join(', ')}
                  </div>
                </div>
                <button onClick={() => removeSong(item.track.uri)}>
                  <FaTrash /> {/* Trash Icon */}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading playlist...</p>
      )}
    </div>
  );
}

export default EditPlaylist;
