import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './i18n/config'; // Initialize i18n
import { AuthProvider } from './context/AuthContext';
import { SkillsProvider } from './context/SkillsContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LearnSkill from './pages/LearnSkill';
import SkillDetail from './pages/SkillDetail';
import CreateRoadmap from './pages/CreateRoadmap';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Feed from './pages/Feed';
import Friends from './pages/Friends';
import Leaderboard from './pages/Leaderboard';
import RoadmapView from './pages/RoadmapView';
import DevLogin from './pages/DevLogin';
import Analytics from './pages/Analytics';
import { resetProgressKeepGuitarOnly } from './utils/skillProgress';
import './App.css';

const RESET_KEEP_GUITAR_FLAG = 'ascent-reset-keep-guitar-done';

function App() {
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    if (localStorage.getItem(RESET_KEEP_GUITAR_FLAG)) return;
    resetProgressKeepGuitarOnly();
    localStorage.setItem(RESET_KEEP_GUITAR_FLAG, '1');
  }, []);

  return (
    <AuthProvider>
      <SkillsProvider>
        <ThemeProvider>
          <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dev-login" element={<DevLogin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="create" element={<CreateRoadmap />} />
                <Route path="learn-skill" element={<LearnSkill />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/:userId" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="feed" element={<Feed />} />
                <Route path="friends" element={<Friends />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
              <Route
                path="/skill/:skillId"
                element={
                  <ProtectedRoute>
                    <SkillDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap/:id"
                element={
                  <ProtectedRoute>
                    <RoadmapView />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          </Router>
        </ThemeProvider>
      </SkillsProvider>
    </AuthProvider>
  );
}

export default App;
