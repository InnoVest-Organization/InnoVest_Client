import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from '../App'
import InnovatorSignUp from '../pages/InnovatorSignUp'

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<InnovatorSignUp />} />
      </Routes>
    </Router>
  )
}

export default AppRouter