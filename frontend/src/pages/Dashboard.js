import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <motion.div
          className="welcome-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Hello, {user?.username || user?.email}!</h2>
          <p>Your skill roadmap journey starts here.</p>
          <div className="user-info">
            <p>
              <strong>Username:</strong> {user?.username}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {user?.roles?.join(', ')}
            </p>
            <p>
              <strong>Member since:</strong>{' '}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="coming-soon-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Coming Soon</h3>
          <ul>
            <li>Browse skill roadmaps</li>
            <li>Track your progress</li>
            <li>Create custom roadmaps</li>
            <li>Collaborate with others</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
