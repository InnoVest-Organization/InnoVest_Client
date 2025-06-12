import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { KeycloakProvider } from './context/KeycloakContext';
import Home from './pages/Home';
import InnovatorProfile from './pages/InnovatorProfile';

function App() {
  return (
    <KeycloakProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/innovator-profile" element={<InnovatorProfile />} />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
}

export default App;