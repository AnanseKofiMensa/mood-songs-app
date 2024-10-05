# Spotify Recommender App

This app helps you create mood based playlists on Spotify.

To run this app, first create a `.env` file with the following content:

```
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

Get the `your_client_id` by going to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and creating a new app.

This will generate a new clientId and clientSecret for you.
Just make sure to add a callback url as `http://localhost:5173/callback`.

Then run:

`npm install`

`npm run dev`

