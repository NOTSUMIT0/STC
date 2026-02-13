import { useState } from 'react';
import { ArrowTopRightOnSquareIcon, MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { roadmaps } from '../../data/roadmaps';
import { useAuth } from '../../hooks/queries/useAuth';
import api from '../../config/api';
import { toast } from 'react-toastify';

const Roadmaps = () => {
  const { data: user, refetch } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [pinning, setPinning] = useState<string | null>(null);

  const filteredRoadmaps = roadmaps.filter(map =>
    map.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTogglePin = async (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    if (pinning) return;

    try {
      setPinning(title);
      await api.put('/api/auth/roadmaps/pin', { title });
      await refetch();
      // toast.success(user?.pinnedRoadmaps?.includes(title) ? 'Roadmap unpinned' : 'Roadmap pinned');
    } catch (err) {
      console.error('Failed to toggle pin', err);
      toast.error('Failed to update pin');
    } finally {
      setPinning(null);
    }
  };

  const isPinned = (title: string) => user?.pinnedRoadmaps?.includes(title);

  return (
    <div className="animate-fade-in-up pb-20">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-base-content tracking-tight">
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
            className="input input-bordered w-full pl-10 bg-base-200 border-base-content/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-base-content placeholder:text-base-content/40 transition-all rounded-xl"
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
              className="group relative bg-base-200 rounded-2xl p-6 border border-base-content/5 hover:border-base-content/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Hover Clean Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl filter drop-shadow-lg">{map.icon}</span>
                  <div className="flex gap-2">
                    {/* Pin Button */}
                    <button
                      onClick={(e) => handleTogglePin(e, map.title)}
                      className={`p-2 rounded-full transition-all ${isPinned(map.title)
                          ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
                          : 'bg-base-100 text-base-content/30 hover:bg-base-100 hover:text-base-content'
                        }`}
                      title={isPinned(map.title) ? "Unpin Roadmap" : "Pin to Dashboard"}
                    >
                      {isPinned(map.title) ? (
                        <StarIconSolid className="w-5 h-5" />
                      ) : (
                        <StarIcon className="w-5 h-5" />
                      )}
                    </button>

                    <div className="p-2 rounded-full bg-base-100 text-base-content/40 group-hover:bg-base-100 group-hover:text-base-content transition-colors">
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </div>
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
