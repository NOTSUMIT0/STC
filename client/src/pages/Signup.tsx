import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/mutations/useAuth';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { mutate: signup, isPending } = useSignup();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ username, email, password }, {
      onSuccess: (data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      },
      onError: (error: any) => {
        console.error('Signup error:', error);
        alert(error.response?.data?.message || 'Signup failed');
      }
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-base-300">
      <div className="card w-96 bg-base-100 shadow-xl border border-secondary/20 hover:border-secondary/50 transition-all duration-300">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Create Account</h2>
          <p className="text-sm text-base-content/70">Join the student community today</p>

          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="johndoe"
                className="input input-bordered input-secondary w-full bg-base-200 focus:bg-base-100 transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered input-secondary w-full bg-base-200 focus:bg-base-100 transition-colors"
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
                className="input input-bordered input-secondary w-full bg-base-200 focus:bg-base-100 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-secondary bg-gradient-to-r from-secondary to-accent border-none hover:shadow-lg hover:shadow-secondary/50 transition-all duration-300 text-secondary-content">
                Sign Up
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <p className="text-center text-sm">
            Already have an account? <Link to="/login" className="link link-secondary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
