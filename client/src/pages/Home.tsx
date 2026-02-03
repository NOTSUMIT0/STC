import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-base-300 flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* Navbar */}
      <div className="navbar bg-base-100/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-white/5 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            StudentPlatform
          </a>
        </div>
        <div className="flex-none gap-4 px-4">
          <Link to="/login" className="text-sm font-semibold hover:text-primary transition-colors">Login</Link>
          <Link to="/signup" className="btn btn-primary btn-sm rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero min-h-screen relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        <div className="hero-content text-center relative z-10 pt-20">
          <div className="max-w-4xl">
            <div className="badge badge-outline badge-secondary mb-6 p-4 rounded-full animate-bounce">
              ✨ The Ultimate Student Companion
            </div>
            <h1 className="mb-6 text-6xl md:text-7xl font-bold leading-tight">
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-pulse">Studies</span> <br />
              with <span className="italic relative inline-block">
                <span className="relative z-10">Clarity</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-secondary/50 -rotate-2 -z-0"></span>
              </span>
            </h1>
            <p className="mb-10 text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              Unlock your potential with curated <span className="font-bold text-accent">Roadmaps</span>,
              verified <span className="font-bold text-accent">Resources</span>, and a powerful
              <span className="font-bold text-accent"> Dashboard</span> designed to streamline your learning journey.
            </p>
            <div className="flex gap-6 justify-center items-center">
              <Link to="/signup" className="btn btn-primary btn-lg rounded-full px-10 shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-110">
                Start Learning Now
              </Link>
              <button className="btn btn-ghost btn-lg rounded-full group">
                Explore Features <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Detail Section */}
      <div className="py-24 px-6 bg-base-200/50 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-base-content/60">Comprehensive tools tailored for modern learners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="card bg-base-100 shadow-2xl border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 group">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🗺️</span>
              </div>
              <h3 className="card-title text-2xl group-hover:text-primary transition-colors">Curated Roadmaps</h3>
              <p className="text-base-content/70 mt-2">
                Step-by-step guides for Frontend, Backend, DSA, and System Design. Never get lost in tutorials again.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-100 shadow-2xl border border-white/5 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2 group">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="card-title text-2xl group-hover:text-secondary transition-colors">Premium Resources</h3>
              <p className="text-base-content/70 mt-2">
                Access a library of verified books, articles, and cheat sheets hand-picked by industry experts.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-100 shadow-2xl border border-white/5 hover:border-accent/30 transition-all duration-500 hover:-translate-y-2 group">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="card-title text-2xl group-hover:text-accent transition-colors">Study Dashboard</h3>
              <p className="text-base-content/70 mt-2">
                Track your progress, set daily goals, and visualize your learning streaks with our advanced analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-100 text-base-content border-t border-white/5">
        <div className="max-w-2xl">
          <div className="mb-6">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StudentPlatform
            </span>
          </div>
          <p className="font-serif italic text-lg text-base-content/60 mb-8 leading-relaxed">
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
          </p>
          <div className="grid grid-flow-col gap-6 text-2xl">
            <a className="hover:text-primary transition-colors cursor-pointer"><i className="fa-brands fa-twitter"></i> 🐦</a>
            <a className="hover:text-primary transition-colors cursor-pointer"><i className="fa-brands fa-github"></i> 🐙</a>
            <a className="hover:text-primary transition-colors cursor-pointer"><i className="fa-brands fa-linkedin"></i> 💼</a>
          </div>
        </div>
        <div className="text-xs text-base-content/40 mt-10">
          <p>Copyright © 2026 - All right reserved by StudentPlatform Industries Ltd</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
