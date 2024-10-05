import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the Navbar CSS

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/playlists">Playlists</Link>
        </li>
        <li>
          <Link to="/mood-search">Mood Search</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;