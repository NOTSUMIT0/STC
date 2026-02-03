import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-base-300">
      <div className="card w-96 bg-base-100 shadow-xl border border-primary/20 hover:border-primary/50 transition-all duration-300">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-sm text-base-content/70">Login to access your student dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered input-primary w-full bg-base-200 focus:bg-base-100 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered input-primary w-full bg-base-200 focus:bg-base-100 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary bg-gradient-to-r from-primary to-secondary border-none hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 text-primary-content">
                Login
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <p className="text-center text-sm">
            Don't have an account? <Link to="/signup" className="link link-primary">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
