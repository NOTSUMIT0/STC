import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PollOption {
  text: string;
  votes: number;
  _id: string;
}

interface Post {
  _id: string;
  type: 'text' | 'poll';
  title: string;
  content?: string;
  options?: PollOption[];
  author: {
    username: string;
    avatarSeed: string;
  };
  likes: number;
  createdAt: string;
}

const Community = () => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'polls'>('discussions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postType, setPostType] = useState<'text' | 'poll'>('text');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const API_URL = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem('user') || '{"username": "Guest", "avatarSeed": "Guest"}');

  useEffect(() => {
    fetchPosts();
    // Simple polling for "real-time" updates every 5 seconds
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleCreatePost = async () => {
    if (!title) return alert('Title is required');

    const newPost = {
      type: postType,
      title,
      content: postType === 'text' ? content : undefined,
      options: postType === 'poll' ? pollOptions.filter(o => o.trim()).map(text => ({ text })) : undefined,
      author: {
        username: user.username || 'Anonymous',
        avatarSeed: user.username || 'Felix',
      }
    };

    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle('');
        setContent('');
        setPollOptions(['', '']);
        fetchPosts(); // Refresh immediately
      } else {
        alert('Failed to create post');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`${API_URL}/api/posts/${id}/like`, { method: 'PUT' });
      // Optimistic update could go here, but polling handles it for now
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = async (postId: string, optionIndex: number) => {
    try {
      await fetch(`${API_URL}/api/posts/${postId}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex }),
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const filteredPosts = posts.filter(p => activeTab === 'discussions' ? p.type === 'text' : p.type === 'poll');

  return (
    <div className="animate-fade-in-up relative">
      <div className="flex justify-between items-center mb-6">
        <div className="tabs tabs-boxed bg-base-200">
          <a className={`tab ${activeTab === 'discussions' ? 'tab-active' : ''}`} onClick={() => setActiveTab('discussions')}>Discussions</a>
          <a className={`tab ${activeTab === 'polls' ? 'tab-active' : ''}`} onClick={() => setActiveTab('polls')}>Student Polls</a>
        </div>
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={() => { setPostType('text'); setIsModalOpen(true); }}
        >
          <span>+</span> Create {activeTab === 'polls' ? 'Poll' : 'Post'}
        </button>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="card w-full max-w-lg bg-[#1e2124] shadow-2xl border border-white/5 animate-pop-in">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-white">Create Post</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Post Type Switcher */}
              <div className="flex bg-[#2b2d31] p-1 rounded-lg mb-6">
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${postType === 'text' ? 'bg-[#40444b] text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setPostType('text')}
                >
                  Text Post
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${postType === 'poll' ? 'bg-[#40444b] text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setPostType('poll')}
                >
                  Poll
                </button>
              </div>

              <div className="form-control mb-4">
                <label className="label text-xs font-bold text-gray-300 uppercase">Title</label>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  className="input input-bordered w-full bg-[#2b2d31] border-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {postType === 'text' ? (
                <div className="form-control mb-4">
                  <label className="label text-xs font-bold text-gray-300 uppercase">Content</label>
                  <textarea
                    className="textarea textarea-bordered h-32 bg-[#2b2d31] border-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500"
                    placeholder="Share your thoughts or ask a question..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  <label className="label text-xs font-bold text-gray-300 uppercase">Poll Options</label>
                  <div className="space-y-2">
                    {pollOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          className="input input-bordered w-full input-sm bg-[#2b2d31] border-none text-white"
                          value={opt}
                          onChange={(e) => updatePollOption(idx, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <button onClick={addPollOption} className="btn btn-ghost btn-xs text-primary hover:bg-transparent hover:underline">+ Add Option</button>
                </div>
              )}

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary w-full" onClick={handleCreatePost}>Post</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="col-span-2 space-y-4">

          {/* Quick Post Box (Optional/Decorative for now) */}
          <div className="card-body bg-base-100 rounded-box shadow-sm mb-4">
            <div className="flex gap-4">
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                  <span>ME</span>
                </div>
              </div>
              <input
                onClick={() => setIsModalOpen(true)}
                className="input input-bordered w-full focus:border-primary cursor-pointer"
                placeholder={`Ask for help, share resources, or ${activeTab === 'polls' ? 'create a poll' : 'start a discussion'}...`}
                readOnly
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center p-10 opacity-50">No posts yet. Be the first!</div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post._id} className="card bg-base-100 shadow-lg border border-white/5 hover:border-primary/20 transition-colors">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="avatar"><div className="w-8 rounded-full bg-secondary"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.avatarSeed}`} /></div></div>
                    <div>
                      <div className="font-bold text-sm">{post.author.username}</div>
                      <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{post.title}</h4>

                  {post.type === 'text' && (
                    <p className="text-sm text-base-content/80 whitespace-pre-wrap">{post.content}</p>
                  )}

                  {post.type === 'poll' && post.options && (
                    <div className="space-y-2 mt-4">
                      {post.options.map((option, idx) => {
                        const totalVotes = post.options!.reduce((acc, curr) => acc + curr.votes, 0);
                        const percent = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                        return (
                          <div key={idx} className="form-control">
                            <label className="label cursor-pointer justify-start gap-4 border border-white/10 rounded-lg p-3 hover:bg-base-200 relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                              <input type="radio" name={`poll-${post._id}`} className="radio radio-primary z-10" onClick={() => handleVote(post._id, idx)} />
                              <span className="label-text z-10">{option.text}</span>
                              <span className="ml-auto text-xs opacity-50 z-10">{percent}% ({option.votes})</span>
                            </label>
                          </div>
                        );
                      })}
                      <div className="text-xs text-gray-400 mt-2">{post.options.reduce((a, b) => a + b.votes, 0)} votes</div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-4 text-gray-400 text-sm border-t border-white/5 pt-3">
                    <span className="cursor-pointer hover:text-primary flex items-center gap-1" onClick={(e) => handleLike(post._id, e)}>❤️ {post.likes} Likes</span>
                    <span className="cursor-pointer hover:text-primary flex items-center gap-1 ml-auto">↗️ Share</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card bg-base-100 p-4 border border-white/5">
            <h3 className="font-bold mb-4">Top Contributors</h3>
            <ul className="space-y-2">
              {['Alice', 'Bob', 'Charlie'].map(u => (
                <li key={u} className="flex items-center gap-2 text-sm">
                  <div className="badge badge-primary badge-xs"></div> {u}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
