// src/pages/MoodSearch.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMusic, FaPlus } from 'react-icons/fa'; // Import Music and Plus icons

function MoodSearch() {
  const [token, setToken] = useState<string | null>(null);
  const [mood, setMood] = useState<string>('');
  const [songRecommendations, setSongRecommendations] = useState<any[]>([]);
  const [playlistId, setPlaylistId] = useState<string | null>(null); // Store the created playlist ID
  const [playlistCreated, setPlaylistCreated] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const searchSongs = async () => {
    if (!token || mood.trim() === '') return;

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSongRecommendations(response.data.tracks.items);
    } catch (error) {
      console.error('Error fetching song recommendations:', error);
    }
  };

  const createPlaylist = async () => {
    if (!token || mood.trim() === '') return;

    try {
      // Create a new playlist
      const response = await axios.post(
        'https://api.spotify.com/v1/me/playlists',
        {
          name: `${mood} Playlist`,
          description: `Playlist generated for mood: ${mood}`,
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlaylistId(response.data.id); // Store the created playlist ID
      setPlaylistCreated(true);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const addSongToPlaylist = async (trackUri: string) => {
    if (!token || !playlistId) {
      console.error('No playlist to add songs to!');
      return;
    }

    try {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: [trackUri] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      alert('Song added to playlist!');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  return (
    <div>
      <h2>Search for Songs by Mood</h2>
      <div>
        <input
          type="text"
          placeholder="Enter your mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <button onClick={searchSongs}>
          <FaMusic /> Search Songs
        </button>
      </div>

      {/* Create Playlist Button */}
      {!playlistId && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={createPlaylist}>
            <FaPlus /> Create Playlist Based on Mood
          </button>
        </div>
      )}

      {playlistCreated && <p>Playlist created successfully!</p>}

      <h3>Song Recommendations</h3>
      <ul>
        {songRecommendations.map((song) => (
          <li key={song.id}>
            <div className="song-info">
              <img src={song.album.images[0]?.url} alt={song.name} />
              <div className="song-details">
                <strong>{song.name}</strong> by {song.artists.map((artist: any) => artist.name).join(', ')}
              </div>
            </div>
            {playlistId && (
              <button onClick={() => addSongToPlaylist(song.uri)}>
                <FaPlus /> Add
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodSearch;
