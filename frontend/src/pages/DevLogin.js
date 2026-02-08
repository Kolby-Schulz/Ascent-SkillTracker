/**
 * DEV ONLY: Log in via URL hash (used by backend script loginAsUser.js --open).
 * Reads token and user from hash, writes to localStorage, then redirects to dashboard.
 * Route: /dev-login#token=...&user=...
 */
import React, { useEffect, useState } from 'react';

const DevLogin = () => {
  const [status, setStatus] = useState('Reading token…');

  useEffect(() => {
    try {
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const token = params.get('token');
      const userStr = params.get('user');

      if (!token || !userStr) {
        setStatus('Missing token or user in URL. Use the script with --open.');
        return;
      }

      const user = JSON.parse(decodeURIComponent(userStr));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setStatus('Logged in. Redirecting…');
      window.location.replace('/dashboard');
    } catch (e) {
      setStatus('Error: ' + (e.message || 'invalid payload'));
    }
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <p>{status}</p>
    </div>
  );
};

export default DevLogin;
