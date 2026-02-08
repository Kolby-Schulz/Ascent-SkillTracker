import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SkillsProvider } from './context/SkillsContext';
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
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SkillsProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
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
              </Route>
              <Route
                path="/skill/:skillId"
                element={
                  <ProtectedRoute>
                    <SkillDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </SkillsProvider>
    </AuthProvider>
  );
}

export default App;
