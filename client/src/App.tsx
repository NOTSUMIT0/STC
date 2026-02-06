import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { useCheckAuth } from './hooks/queries/useAuth';

function App() {
  const { data: user, isLoading } = useCheckAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-base-300">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-base-300 text-base-content font-sans antialiased selection:bg-primary selection:text-primary-content">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard/*" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
