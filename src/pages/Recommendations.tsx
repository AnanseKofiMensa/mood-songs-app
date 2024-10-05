import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function Recommendations() {
  const [songRecommendations, setSongRecommendations] = useState<any[]>([]);
  const [playlistCreated, setPlaylistCreated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const mood = searchParams.get('mood');

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token');
    if (storedToken && mood) {
      setToken(storedToken);
      fetchSongRecommendations(storedToken, mood);
    }
  }, [mood]);

  const fetchSongRecommendations = async (token: string, mood: string) => {
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

  const createMoodPlaylist = async () => {
    if (!token || songRecommendations.length === 0) return;

    try {
      // Step 1: Create a new playlist
      const response = await axios.post(
        'https://api.spotify.com/v1/me/playlists',
        {
          name: `${mood} Playlist`,
          description: `A playlist based on your mood: ${mood}`,
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const playlistId = response.data.id;

      // Step 2: Add songs to the newly created playlist
      const trackUris = songRecommendations.map((song) => song.uri);
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: trackUris,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlaylistCreated(true);
      console.log(`Playlist "${mood} Playlist" created successfully!`);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <div>
      <h2>Song Recommendations for "{mood}"</h2>
      <ul>
        {songRecommendations.map((song) => (
          <li key={song.id}>
            {song.name} by {song.artists.map(artist => artist.name).join(', ')}
          </li>
        ))}
      </ul>
      <button onClick={createMoodPlaylist}>Create Playlist Based on Mood</button>
      {playlistCreated && <p>Playlist created successfully!</p>}
    </div>
  );
}

export default Recommendations;
