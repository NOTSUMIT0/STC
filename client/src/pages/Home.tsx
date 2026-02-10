import { Link } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import FeatureSection from '../components/landing/FeatureSection';
import Stats from '../components/landing/Stats';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import { useState, useEffect } from 'react';

const Home = ({ user }: { user: any }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-base-300 flex flex-col font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <div className={`navbar fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-base-100/80 backdrop-blur-md shadow-lg border-b border-base-content/5' : 'bg-transparent'}`}>
        <div className="flex-1 px-4">
          <a className="text-2xl font-black tracking-tighter text-base-content cursor-pointer hover:text-primary transition-colors">
            Student<span className="text-primary">Platform</span>
          </a>
        </div>
        <div className="flex-none flex items-center gap-4 px-4">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5">
              Dashboard ({user.username})
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold hover:text-primary transition-colors hidden md:block">Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main>
        <Hero />
        <Stats />
        <FeatureSection />
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
