import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { KeycloakProvider } from './context/KeycloakContext';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import InnovatorProfile from './pages/InnovatorProfile';
import InnovationRegistration from './pages/InnovationRegistration';
import InnovationDetail from './pages/InnovationDetail';
import About from './pages/About';
import Payment from "./pages/Payment.jsx";
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import InvestorProfile from './pages/InvestorProfile';
import InvestorLogin from './pages/InvestorLogin';

function App() {
  return (
    <KeycloakProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/innovator-profile" element={<InnovatorProfile />} />
          <Route path="/investor-profile" element={<InvestorProfile />} />
          <Route path="/investor-login" element={<InvestorLogin />} />
          <Route path="/innovation-registration" element={<InnovationRegistration />} />
          <Route path="/innovation-detail" element={<InnovationDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
}

export default App;