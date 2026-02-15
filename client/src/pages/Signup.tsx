import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/mutations/useAuth';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate: signup, isPending } = useSignup();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ username, email, password }, {
      onSuccess: (data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Account created successfully!');
        navigate('/dashboard');
      },
      onError: (error: any) => {
        console.error('Signup error:', error);
        toast.error(error.response?.data?.message || 'Signup failed');
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
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-secondary to-accent relative overflow-hidden items-center justify-center p-12 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Abstract Shapes */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Join the <span className="text-white">Future</span> of Learning</h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Unlock your potential with curated roadmaps, verified resources, and a supportive community.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-rocket text-lg"></i>
              </div>
              <div>
                <h4 className="font-bold">Accelerate Growth</h4>
                <p className="text-sm opacity-80">Learn faster with structured paths</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-code text-lg"></i>
              </div>
              <div>
                <h4 className="font-bold">Build Projects</h4>
                <p className="text-sm opacity-80">Apply what you learn immediately</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-base-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-base-content/60">Join thousands of students learning together.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <i className="fa-solid fa-user"></i>
                </div>
                <input
                  type="text"
                  placeholder="johndoe"
                  className="input input-bordered w-full pl-10 focus:input-secondary transition-all py-6"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  className="input input-bordered w-full pl-10 focus:input-secondary transition-all py-6"
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
                  placeholder="Create a strong password"
                  className="input input-bordered w-full pl-10 pr-10 focus:input-secondary transition-all py-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary/80 hover:text-secondary focus:outline-none transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button
              disabled={isPending}
              className="btn btn-secondary w-full btn-lg shadow-lg hover:shadow-secondary/30 transform hover:-translate-y-1 transition-all text-white"
            >
              {isPending ? <span className="loading loading-spinner"></span> : 'Sign Up'}
            </button>
          </form>

          <div className="divider my-8">OR</div>

          <p className="text-center">
            Already have an account? <Link to="/login" className="link link-secondary font-bold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
