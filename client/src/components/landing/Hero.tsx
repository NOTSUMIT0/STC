import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero min-h-screen relative overflow-hidden bg-base-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-[100vw] h-[100vw] bg-primary/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-[100vw] h-[100vw] bg-secondary/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="hero-content text-center relative z-10 pt-20">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge badge-outline badge-primary mb-6 p-4 rounded-full text-sm font-semibold uppercase tracking-wider">
              🚀 The Ultimate Student Companion
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 text-6xl md:text-8xl font-black leading-tight tracking-tight"
          >
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Student Journey
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 text-xl md:text-2xl text-base-content/70 max-w-3xl mx-auto leading-relaxed"
          >
            Elevate your learning with curated <span className="text-primary font-bold">roadmaps</span>,
            verified <span className="text-secondary font-bold">resources</span>, and a powerful
            <span className="text-accent font-bold"> dashboard</span> designed for high achievers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <Link to="/signup" className="btn btn-primary btn-lg rounded-full px-12 text-lg hover:scale-105 transition-transform duration-300 shadow-xl shadow-primary/30">
              Get Started
            </Link>
          </motion.div>

          {/* Floaty Analytics Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 relative perspective-1000"
          >
            <div className="mockup-window border border-base-content/10 bg-base-200 shadow-2xl skew-y-1 transform transition-all duration-500 hover:skew-y-0">
              <div className="flex justify-center px-4 py-8 bg-base-100/50 backdrop-blur-sm"> {/* Reduced opacity for glass effect */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl text-left">
                  {/* Fake Widget 1 */}
                  <div className="card bg-base-100 shadow-sm p-4">
                    <div className="h-4 w-24 bg-base-300 rounded mb-2"></div>
                    <div className="h-20 bg-primary/10 rounded-lg animate-pulse"></div>
                  </div>
                  {/* Fake Widget 2 */}
                  <div className="card bg-base-100 shadow-sm p-4">
                    <div className="h-4 w-24 bg-base-300 rounded mb-2"></div>
                    <div className="h-20 bg-secondary/10 rounded-lg animate-pulse delay-75"></div>
                  </div>
                  {/* Fake Widget 3 */}
                  <div className="card bg-base-100 shadow-sm p-4">
                    <div className="h-4 w-24 bg-base-300 rounded mb-2"></div>
                    <div className="h-20 bg-accent/10 rounded-lg animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
