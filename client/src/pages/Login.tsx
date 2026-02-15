import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/mutations/useAuth';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate: login, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, {
      onSuccess: (data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.username}!`);
        navigate('/dashboard');
      },
      onError: (error: any) => {
        console.error('Login error:', error);
        toast.error(error.response?.data?.message || 'Login failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-base-100 font-sans">
      {/* Left Side - Context & Visuals */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-accent relative overflow-hidden items-center justify-center p-12 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Abstract Shapes */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome Back to <span className="text-white">StudentPlatform</span></h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Continue your journey of learning and collaboration. Pick up right where you left off.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-lg"></i>
              </div>
              <div>
                <h4 className="font-bold">Track Your Progress</h4>
                <p className="text-sm opacity-80">See how far you've come</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-users text-lg"></i>
              </div>
              <div>
                <h4 className="font-bold">Join the Community</h4>
                <p className="text-sm opacity-80">Connect with thousands of students</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-base-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-base-content/60">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all py-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered w-full pl-10 pr-10 focus:input-primary transition-all py-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary/80 hover:text-primary focus:outline-none transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              <label className="label">
                <span className="label-text-alt"></span>
                <a href="#" className="label-text-alt link link-primary hover:underline">Forgot password?</a>
              </label>
            </div>

            <button
              disabled={isPending}
              className="btn btn-primary w-full btn-lg shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1 transition-all"
            >
              {isPending ? <span className="loading loading-spinner"></span> : 'Sign In'}
            </button>
          </form>

          <div className="divider my-8">OR</div>

          <p className="text-center">
            New to StudentPlatform? <Link to="/signup" className="link link-primary font-bold">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
