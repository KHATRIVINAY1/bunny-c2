import React from 'react'
import { useState } from 'react'
import Layout from './components/Layout'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PageNotFound from './pages/PageNotFound'
import Clients from './pages/Clients'
function App() {

  return (
    <>
   <BrowserRouter>
      <Routes>
        {/* Wrap routes that need Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
        </Route>
        {/* Catch-all route for 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>    
    </>
  )
}

export default App
