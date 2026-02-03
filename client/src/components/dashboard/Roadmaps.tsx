import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const roadmaps = [
  { title: 'Frontend Developer', url: 'https://roadmap.sh/frontend', icon: '🎨', color: 'text-primary' },
  { title: 'Backend Developer', url: 'https://roadmap.sh/backend', icon: '⚙️', color: 'text-secondary' },
  { title: 'DevOps', url: 'https://roadmap.sh/devops', icon: '🚀', color: 'text-accent' },
  { title: 'Full Stack', url: 'https://roadmap.sh/full-stack', icon: '💻', color: 'text-info' },
  { title: 'AI & Data Scientist', url: 'https://roadmap.sh/ai-data-scientist', icon: '🧠', color: 'text-warning' },
  { title: 'Cyber Security', url: 'https://roadmap.sh/cyber-security', icon: '🛡️', color: 'text-error' },
];

const Roadmaps = () => {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Learning Roadmaps</h2>
      <p className="mb-8 text-gray-400">Follow these community-curated paths to master your skills. Powered by <a href="https://roadmap.sh" target="_blank" className="link link-primary">roadmap.sh</a>.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((map, idx) => (
          <a
            key={idx}
            href={map.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-base-100 shadow-xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/10 group"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <span className="text-4xl">{map.icon}</span>
                <ArrowTopRightOnSquareIcon className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
              </div>
              <h3 className={`card-title mt-4 ${map.color} group-hover:underline`}>{map.title}</h3>
              <p className="text-sm opacity-60">Step-by-step guide to becoming a {map.title}.</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
