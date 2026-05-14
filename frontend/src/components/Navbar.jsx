import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h1>📦 Stock Dashboard</h1>
      {user && (
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/transactions">Transactions</Link>
          <span style={{ marginLeft: 20 }}>👤 {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      )}
    </div>
  );
};

export default Navbar;

