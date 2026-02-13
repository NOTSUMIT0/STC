import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, HandThumbUpIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const MockPost = ({ title, author, time, tags, upvotes, comments, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-content/5 hover:border-primary/20 transition-all duration-300 mb-4"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="avatar placeholder">
        <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
          <span className="text-xs"><UserCircleIcon className="w-8 h-8 text-base-content/50" /></span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-base-content/90">{author}</span>
        <span className="text-xs text-base-content/50">{time}</span>
      </div>
    </div>
    <h3 className="font-bold text-lg mb-2 text-primary">{title}</h3>
    <div className="flex gap-2 mb-4">
      {tags.map((tag: string) => (
        <span key={tag} className="badge badge-sm badge-outline opacity-70">#{tag}</span>
      ))}
    </div>
    <div className="flex gap-4 text-base-content/60 text-sm">
      <div className="flex items-center gap-1">
        <HandThumbUpIcon className="w-4 h-4" /> <span>{upvotes}</span>
      </div>
      <div className="flex items-center gap-1">
        <ChatBubbleLeftRightIcon className="w-4 h-4" /> <span>{comments} Comments</span>
      </div>
    </div>
  </motion.div>
);

const CommunityHighlight = () => {
  return (
    <div className="py-24 bg-base-200/30 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Text Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Conversation</span>
            </h2>
            <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
              Connect with a global network of students. Share your projects, ask for help, and collaborate on the next big thing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="btn btn-primary btn-lg shadow-xl shadow-primary/20 hover:shadow-primary/40">
                Join Community
              </Link>
              <Link to="/login" className="btn btn-ghost btn-lg">
                Explore Discussions <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-12 flex gap-8">
              <div>
                <h4 className="text-3xl font-bold text-base-content">500+</h4>
                <p className="text-sm text-base-content/50 uppercase tracking-widest font-semibold">Active Threads</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-base-content">24/7</h4>
                <p className="text-sm text-base-content/50 uppercase tracking-widest font-semibold">Peer Support</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Visual Content - Mock Feed */}
        <div className="relative">
          {/* Floating Elements Background */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-secondary/10 rounded-full blur-[80px]"></div>

          <MockPost
            title="Best resources to learn React in 2026?"
            author="Ritesh Sharma"
            time="2 hours ago"
            tags={['Frontend', 'React', 'Help']}
            upvotes={42}
            comments={12}
            delay={0.1}
          />
          <MockPost
            title="Looking for a teammate for a hackathon 🚀"
            author="Manpreet Singh"
            time="5 hours ago"
            tags={['Collaboration', 'Hackathon']}
            upvotes={28}
            comments={8}
            delay={0.2}
          />
          <MockPost
            title="My journey becoming a self-taught developer"
            author="Rachit Tanwar"
            time="1 day ago"
            tags={['Career', 'Motivation']}
            upvotes={156}
            comments={45}
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityHighlight;
