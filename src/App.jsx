import React from 'react';
import { KeycloakProvider } from './context/KeycloakContext';
import Home from './pages/Home';

function App() {
  return (
    <KeycloakProvider>
      <Home />
    </KeycloakProvider>
  );
}

export default App;