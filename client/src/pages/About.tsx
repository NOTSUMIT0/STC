import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import profileImg from '../assets/profile.jpg';

const About = () => {
  return (
    <div className="min-h-screen bg-base-300 pt-20 pb-10 px-6 font-sans">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          About <span className="text-primary">StudentPlatform</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl text-base-content/70 leading-relaxed"
        >
          We are dedicated to revolutionizing the way students learn, collaborate, and grow.
          Our mission is to provide a comprehensive ecosystem that bridges the gap between
          structured learning and community support.
        </motion.p>
      </div>

      {/* What We Do Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6">Empowering Your Journey</h2>
          <div className="space-y-6 text-lg text-base-content/80">
            <p>
              <strong className="text-secondary">Curated Roadmaps:</strong> Whether you're aspiring to be a Full Stack Developer,
              AI Engineer, or Data Scientist, our interactive roadmaps guide you step-by-step.
            </p>
            <p>
              <strong className="text-accent">Verified Resources:</strong> Stop wasting time filtering through low-quality tutorials.
              Get access to hand-picked articles, videos, and books.
            </p>
            <p>
              <strong className="text-primary">Collaborative Community:</strong> Connect with peers, share knowledge, and solve problems together
              in our vibrant student community.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-[50px] opacity-20 animate-pulse"></div>
          <div className="relative bg-base-100 p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex flex-col gap-4">
              <div className="h-4 bg-base-300 rounded w-3/4"></div>
              <div className="h-4 bg-base-300 rounded w-full"></div>
              <div className="h-32 bg-base-300 rounded w-full mt-4"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                <div className="h-10 flex-1 bg-base-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About Me Section */}
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card bg-base-100 shadow-xl border border-primary/20 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
          <div className="card-body p-10">
            <h2 className="text-3xl font-bold mb-8">Meet the Creator</h2>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-2xl">
                  <img src={profileImg} alt="Sumit" />
                </div>
              </div>

              <div className="text-left flex-1">
                <h3 className="text-2xl font-bold text-primary mb-2">Sumit</h3>
                <p className="text-base-content/60 mb-4 font-mono">@NOTSUMIT0</p>
                <p className="mb-6 leading-relaxed">
                  Passionate Full Stack Developer and UI/UX enthusiast. Building tools to help the next generation of developers
                  learn faster and build better. Always exploring new technologies and pushing the boundaries of web design.
                </p>

                <div className="flex gap-4 flex-wrap">
                  <a href="https://github.com/NOTSUMIT0" target="_blank" rel="noopener noreferrer" className="btn btn-primary gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
                    <i className="fa-brands fa-github text-xl"></i> GitHub
                  </a>
                  <a href="mailto:kumarsumeet683@gmail.com" className="btn btn-secondary gap-2 shadow-lg shadow-secondary/30 hover:shadow-secondary/50 hover:scale-105 transition-all duration-300">
                    <i className="fa-solid fa-envelope text-xl"></i> Email Me
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-center mt-20">
        <Link to="/" className="btn btn-ghost hover:bg-base-200">← Back to Home</Link>
      </div>
    </div>
  );
};

export default About;
