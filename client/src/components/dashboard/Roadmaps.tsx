import { useState } from 'react';
import { ArrowTopRightOnSquareIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const roadmaps = [
  // Roles
  { title: 'Frontend Developer', url: 'https://roadmap.sh/frontend', icon: '🎨', color: 'text-primary' },
  { title: 'Backend Developer', url: 'https://roadmap.sh/backend', icon: '⚙️', color: 'text-secondary' },
  { title: 'DevOps', url: 'https://roadmap.sh/devops', icon: '🚀', color: 'text-accent' },
  { title: 'Full Stack', url: 'https://roadmap.sh/full-stack', icon: '💻', color: 'text-info' },
  { title: 'Android', url: 'https://roadmap.sh/android', icon: '🤖', color: 'text-success' },
  { title: 'iOS', url: 'https://roadmap.sh/ios', icon: '🍎', color: 'text-gray-200' },
  { title: 'AI & Data Scientist', url: 'https://roadmap.sh/ai-data-scientist', icon: '🧠', color: 'text-warning' },
  { title: 'Blockchain', url: 'https://roadmap.sh/blockchain', icon: '🔗', color: 'text-orange-500' },
  { title: 'Cyber Security', url: 'https://roadmap.sh/cyber-security', icon: '🛡️', color: 'text-error' },
  { title: 'UX Design', url: 'https://roadmap.sh/ux-design', icon: '✨', color: 'text-purple-400' },
  { title: 'Game Developer', url: 'https://roadmap.sh/game-developer', icon: '🎮', color: 'text-red-400' },
  { title: 'Technical Writer', url: 'https://roadmap.sh/technical-writer', icon: '📝', color: 'text-gray-400' },

  // Languages
  { title: 'Python', url: 'https://roadmap.sh/python', icon: '🐍', color: 'text-yellow-400' },
  { title: 'Java', url: 'https://roadmap.sh/java', icon: '☕', color: 'text-orange-400' },
  { title: 'C++', url: 'https://roadmap.sh/cpp', icon: '➕', color: 'text-blue-500' },
  { title: 'Go', url: 'https://roadmap.sh/golang', icon: '🐹', color: 'text-cyan-400' },
  { title: 'Rust', url: 'https://roadmap.sh/rust', icon: '🦀', color: 'text-orange-600' },
  { title: 'JavaScript', url: 'https://roadmap.sh/javascript', icon: '📜', color: 'text-yellow-300' },
  { title: 'TypeScript', url: 'https://roadmap.sh/typescript', icon: '🔷', color: 'text-blue-600' },
  { title: 'SQL', url: 'https://roadmap.sh/sql', icon: '💾', color: 'text-pink-400' },

  // Skills / Tools
  { title: 'System Design', url: 'https://roadmap.sh/system-design', icon: '🏗️', color: 'text-indigo-400' },
  { title: 'React', url: 'https://roadmap.sh/react', icon: '⚛️', color: 'text-cyan-300' },
  { title: 'Vue', url: 'https://roadmap.sh/vue', icon: '🟢', color: 'text-emerald-400' },
  { title: 'Angular', url: 'https://roadmap.sh/angular', icon: '🅰️', color: 'text-red-500' },
  { title: 'Node.js', url: 'https://roadmap.sh/nodejs', icon: '🌿', color: 'text-green-500' },
  { title: 'PostgreSQL', url: 'https://roadmap.sh/postgresql', icon: '🐘', color: 'text-blue-400' },
  { title: 'MongoDB', url: 'https://roadmap.sh/mongodb', icon: '🍃', color: 'text-green-400' },
  { title: 'Docker', url: 'https://roadmap.sh/docker', icon: '🐳', color: 'text-blue-500' },
  { title: 'Kubernetes', url: 'https://roadmap.sh/kubernetes', icon: '☸️', color: 'text-blue-600' },
  { title: 'AWS', url: 'https://roadmap.sh/aws', icon: '☁️', color: 'text-yellow-600' },
];

const Roadmaps = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoadmaps = roadmaps.filter(map =>
    map.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up pb-20">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tight">
            Learning Roadmaps
          </h2>
          <p className="mt-2 text-gray-400 max-w-xl leading-relaxed">
            Curated paths to master new skills and accelerate your career.
            Powered by the community and <a href="https://roadmap.sh" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">roadmap.sh</a>.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search roadmaps..."
            className="input input-bordered w-full pl-10 bg-[#1e2124] border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-gray-600 transition-all rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredRoadmaps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRoadmaps.map((map, idx) => (
            <a
              key={idx}
              href={map.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-[#1e2124] rounded-2xl p-6 border border-white/5 hover:border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Hover Clean Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl filter drop-shadow-lg">{map.icon}</span>
                  <div className="p-2 rounded-full bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className={`text-xl font-bold mb-2 ${map.color} brightness-110 group-hover:brightness-125 transition-all`}>
                  {map.title}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 group-hover:text-gray-400 transition-colors">
                  Step-by-step guide to becoming a {map.title} developer in 2026.
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No roadmaps found</h3>
          <p className="text-gray-500">Try searching for a different skill or role.</p>
        </div>
      )}
    </div>
  );
};

export default Roadmaps;
