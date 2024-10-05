// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Playlists from './pages/Playlists';
import EditPlaylist from './pages/EditPlaylist';
import MoodSearch from './pages/MoodSearch';
import './styles/App.css'; // Import global styles

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">View Playlists</Link>
            </li>
            <li>
              <Link to="/mood-search">Mood Search</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Playlists />} />
          <Route path="/playlist/:id" element={<EditPlaylist />} />
          <Route path="/mood-search" element={<MoodSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
