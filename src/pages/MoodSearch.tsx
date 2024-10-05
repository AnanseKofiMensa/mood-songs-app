import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MoodSearch() {
  const [mood, setMood] = useState<string>(''); // User's mood input
  const [recommendations, setRecommendations] = useState<any[]>([]); // Store Spotify songs
  const [playlistId, setPlaylistId] = useState<string | null>(null); // Store the created playlist ID
  const [loading, setLoading] = useState<boolean>(false); // Loading state for API requests
  const [playlistCreated, setPlaylistCreated] = useState<boolean>(false);

  const spotifyToken = window.localStorage.getItem('token'); // Spotify access token from login

  const handleMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMood(e.target.value);
  };

  // Fetch song recommendations from ChatGPT
  const getChatGPTRecommendations = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that provides music recommendations.',
            },
            {
              role: 'user',
              content: `Suggest me a list of 10 songs that match the mood: "${mood}".`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // OpenAI API Key
          },
        }
      );

      // Parse the response from ChatGPT
      const recommendationsText = response.data.choices[0].message.content.trim();
      const songTitles = recommendationsText.split('\n').filter(Boolean); // Get song titles

      // Search for each song on Spotify and get its data
      const spotifySongs = await Promise.all(
        songTitles.map(async (title) => {
          const spotifyResponse = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(title)}&type=track&limit=1`,
            {
              headers: {
                Authorization: `Bearer ${spotifyToken}`,
              },
            }
          );
          return spotifyResponse.data.tracks.items[0]; // Return the first match
        })
      );

      setRecommendations(spotifySongs); // Set Spotify songs in state
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Create a playlist on Spotify
  const createPlaylist = async () => {
    if (!spotifyToken || mood.trim() === '') return;

    try {
      const response = await axios.post(
        'https://api.spotify.com/v1/me/playlists',
        {
          name: `${mood} Playlist`,
          description: `Playlist generated for mood: ${mood}`,
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );
      setPlaylistId(response.data.id); // Store the created playlist ID
      setPlaylistCreated(true);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  // Add a song to the playlist
  const addSongToPlaylist = async (trackUri: string) => {
    if (!spotifyToken || !playlistId) return;

    try {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: [trackUri] },
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
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
          onChange={handleMoodChange}
        />
        <button onClick={getChatGPTRecommendations}>
          {loading ? 'Loading...' : 'Get Song Recommendations'}
        </button>
      </div>

      {!playlistId && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={createPlaylist}>
            {playlistCreated ? 'Playlist Created!' : 'Create Playlist Based on Mood'}
          </button>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h3>Recommended Songs for Mood "{mood}"</h3>
          <ul>
            {recommendations.map((song, index) => (
              <li key={song.id}>
                <div className="song-info">
                  <img src={song.album.images[0]?.url} alt={song.name} />
                  <div className="song-details">
                    <strong>{song.name}</strong> by {song.artists.map((artist: any) => artist.name).join(', ')}
                  </div>
                </div>
                {playlistId && (
                  <button onClick={() => addSongToPlaylist(song.uri)}>
                    Add to Playlist
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MoodSearch;
