import { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NotificationDropdown = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Fetch recent posts from joined communities
      const token = localStorage.getItem('token');
      if (!token) return [];
      const res = await axios.get(`${API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data; // Assuming API returns filtered posts based on user's communities
    },
    enabled: !!user // Only fetch if user logged in
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-white relative"
      >
        <BellIcon className="w-6 h-6" />
        {notifications && notifications.length > 0 && (
          <span className="badge badge-error badge-xs absolute top-1 right-1 animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-base-100 rounded-2xl shadow-2xl border border-white/5 overflow-hidden z-50 animate-fade-in-up origin-top-right">
          <div className="p-4 border-b border-white/5 bg-base-200/50 backdrop-blur-sm flex justify-between items-center">
            <h3 className="font-bold text-sm">Notifications</h3>
            <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading updates...</div>
            ) : notifications?.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center mb-3">
                  <BellIcon className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-sm font-medium">No new notifications</p>
                <p className="text-xs text-gray-500 mt-1">Join communities to see updates here.</p>
              </div>
            ) : (
              notifications?.slice(0, 5).map((post: any) => (
                <div key={post._id} className="p-4 border-b border-white/5 hover:bg-base-200 transition-colors cursor-pointer group">
                  <div className="flex gap-3">
                    <div className="avatar placeholder">
                      <div className="w-10 h-10 rounded-full bg-neutral-focus text-neutral-content ring-1 ring-white/10">
                        {post.community?.name ? (
                          <span className="text-xs">{post.community.name.substring(0, 2).toUpperCase()}</span>
                        ) : <span>STC</span>}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1 flex justify-between">
                        <span>{post.community?.name || 'Community'}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </p>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-1">{post.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{post.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 bg-base-200/50 text-center border-t border-white/5">
            <button className="btn btn-xs btn-ghost w-full">View All Activity</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
