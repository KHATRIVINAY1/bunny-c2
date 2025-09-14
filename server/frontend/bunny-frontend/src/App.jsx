import React from 'react'
import { useState,useEffect } from 'react'
import Layout from './components/Layout'
import { Route, Routes, BrowserRouter, Navigate  } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PageNotFound from './pages/PageNotFound'
import Clients from './pages/Clients'
import axios from 'axios';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      handleLogin("user");
      setLoading(false);
    }
    setLoading(false);
    
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

   const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

 return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public route - login page */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
            } 
          />
          
          {/* Protected routes - wrap with Layout */}
          <Route 
            path="/" 
            element={
              user ? <Layout logout={logout} user={user} /> : <Navigate to="/login" replace />
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>    
    </>
  )
}

export default App