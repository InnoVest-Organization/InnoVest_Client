import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { KeycloakProvider } from './context/KeycloakContext';
import Home from './pages/Home';
import InnovatorProfile from './pages/InnovatorProfile';
import InnovationRegistration from './pages/InnovationRegistration';

function App() {
  return (
    <KeycloakProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/innovator-profile" element={<InnovatorProfile />} />
          <Route path="/innovation-registration" element={<InnovationRegistration />} />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
}

export default App;