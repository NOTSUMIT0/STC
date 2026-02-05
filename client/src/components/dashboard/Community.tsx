import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  BookOpenIcon, // For Upvote "Book"
  ChatBubbleLeftIcon,
  ShareIcon,
  PhotoIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { BookOpenIcon as BookOpenSolidIcon } from '@heroicons/react/24/solid';

// Types
interface CommunityType {
  _id: string;
  name: string;
  description: string;
  icon: string;
  members: string[]; // User IDs
}

interface PostType {
  _id: string;
  type: 'text' | 'poll' | 'image';
  title: string;
  content?: string;
  image?: string;
  community?: CommunityType; // Populated or ID
  options?: { text: string; votes: number }[];
  author: {
    username: string;
    avatarSeed: string;
  };
  likes: number; // Upvotes
  createdAt: string;
}

const Community = () => {
  // State
  const [activeCommunity, setActiveCommunity] = useState<CommunityType | null>(null); // null = Home (All)
  const [communities, setCommunities] = useState<CommunityType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  // Form State (New Post)
  const [postType, setPostType] = useState<'text' | 'poll' | 'image'>('text');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Form State (New Community)
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const user = JSON.parse(localStorage.getItem('user') || '{"username": "Guest", "avatarSeed": "Guest", "_id": "dummy_id"}');

  // --- Effects ---

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeCommunity]); // Refetch when community changes

  // --- API Calls ---

  const fetchCommunities = async () => {
    try {
      const res = await fetch(`${API_URL}/api/communities`);
      if (res.ok) {
        const data = await res.json();
        setCommunities(data);
      }
    } catch (err) {
      console.error("Failed to fetch communities", err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/posts`;
      if (activeCommunity) {
        url += `?communityId=${activeCommunity._id}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async () => {
    if (!newCommName) return alert('Name is required');

    try {
      const res = await fetch(`${API_URL}/api/communities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCommName,
          description: newCommDesc,
          userId: user._id || 'dummy_id_for_now' // TODO: Real Auth
        }),
      });

      if (res.ok) {
        setIsCommunityModalOpen(false);
        setNewCommName('');
        setNewCommDesc('');
        fetchCommunities();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create community');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async () => {
    if (!postTitle) return alert('Title is required');

    const formData = new FormData();
    formData.append('type', postType);
    formData.append('title', postTitle);
    formData.append('authorName', user.username);
    formData.append('authorAvatar', user.avatarSeed);

    if (activeCommunity) {
      formData.append('communityId', activeCommunity._id);
    }

    if (postType === 'text') {
      formData.append('content', postContent);
    } else if (postType === 'image' && postImage) {
      formData.append('image', postImage);
      formData.append('content', postContent); // Optional caption
    } else if (postType === 'poll') {
      const validOptions = pollOptions.filter(o => o.trim()).map(text => ({ text, votes: 0 }));
      formData.append('options', JSON.stringify(validOptions));
    }

    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        body: formData, // Auto sets multipart/form-data
      });

      if (res.ok) {
        setIsPostModalOpen(false);
        // Reset form
        setPostTitle('');
        setPostContent('');
        setPostImage(null);
        setPollOptions(['', '']);
        fetchPosts();
      } else {
        alert('Failed to create post');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistic Update
      setPosts(posts.map(p => p._id === id ? { ...p, likes: p.likes + 1 } : p));
      await fetch(`${API_URL}/api/posts/${id}/like`, { method: 'PUT' });
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

  // --- Render Helpers ---

  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden">

      {/* LEFT SIDEBAR - Communities */}
      <div className="w-16 md:w-64 flex-shrink-0 border-r border-white/5 bg-base-200/50 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="font-bold text-gray-400 uppercase text-xs tracking-wider">Communities</h2>
          <button onClick={() => setIsCommunityModalOpen(true)} className="btn btn-ghost btn-xs btn-circle hover:bg-primary hover:text-white" title="Create Community">
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          <button
            onClick={() => setActiveCommunity(null)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${!activeCommunity ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-gray-300'}`}
          >
            <Squares2X2Icon className="w-6 h-6" />
            <span className="font-medium truncate">Home</span>
          </button>

          <div className="divider my-2 opacity-50"></div>

          {communities.map(comm => (
            <button
              key={comm._id}
              onClick={() => setActiveCommunity(comm)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all group ${activeCommunity?._id === comm._id ? 'bg-base-100 border border-primary/50 text-white' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-8 h-8 ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
                  <span className="text-xs">{comm.name.substring(0, 2).toUpperCase()}</span>
                </div>
              </div>
              <span className="font-medium truncate text-sm">{comm.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CENTER - Feed */}
      <div className="flex-1 overflow-y-auto bg-base-300 scrollbar-hide relative">
        <div className="max-w-3xl mx-auto p-4 md:p-6 pb-20">

          {/* Header Area */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {activeCommunity ? (
                <>
                  <span className="text-primary">c/</span>{activeCommunity.name}
                </>
              ) : 'Home Feed'}
            </h1>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="btn btn-primary btn-sm gap-2"
            >
              <PlusIcon className="w-4 h-4" /> Create Post
            </button>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="flex justify-center p-20"><span className="loading loading-dots loading-lg text-primary"></span></div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <div className="text-4xl mb-4">🏜️</div>
              <p>Such empty. Why not start a discussion?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post._id} className="card bg-base-100 border border-white/5 hover:border-white/10 transition-all shadow-xl group">
                  <div className="flex">
                    {/* Vote Sidebar */}
                    <div className="w-12 bg-base-200/50 flex flex-col items-center p-2 gap-1 rounded-l-2xl border-r border-white/5">
                      <button onClick={(e) => handleUpvote(post._id, e)} className="p-1 hover:text-primary transition-colors hover:bg-primary/10 rounded">
                        <BookOpenIcon className="w-6 h-6" />
                      </button>
                      <span className="font-bold text-sm">{post.likes}</span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      {/* Meta Header */}
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                        {post.community && !activeCommunity && (
                          <span className="font-bold text-gray-300 hover:underline cursor-pointer">c/{post.community.name}</span>
                        )}
                        <span>• Posted by u/{post.author.username}</span>
                        <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors cursor-pointer">{post.title}</h3>

                      {post.type === 'text' && (
                        <p className="text-gray-300 whitespace-pre-wrap mb-4 line-clamp-4">{post.content}</p>
                      )}

                      {post.type === 'image' && post.image && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/5 bg-black/50">
                          <img src={`${API_URL}${post.image}`} alt={post.title} className="w-full max-h-[500px] object-contain" />
                        </div>
                      )}

                      {post.type === 'poll' && post.options && (
                        <div className="space-y-2 mb-4 bg-base-200/30 p-4 rounded-xl">
                          {post.options.map((option, idx) => {
                            const totalVotes = post.options!.reduce((a, b) => a + b.votes, 0);
                            const percent = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                            return (
                              <div key={idx} onClick={() => handleVote(post._id, idx)} className="relative h-10 bg-base-300 rounded overflow-hidden cursor-pointer hover:bg-base-200 transition-colors border border-white/5">
                                <div className="absolute top-0 bottom-0 left-0 bg-primary/20 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                <div className="absolute inset-0 flex items-center justify-between px-4 z-10 text-sm font-medium">
                                  <span>{option.text}</span>
                                  <span>{percent}%</span>
                                </div>
                              </div>
                            );
                          })}
                          <div className="text-xs opacity-50 text-right">{post.options.reduce((a, b) => a + b.votes, 0)} votes</div>
                        </div>
                      )}

                      {/* Action Footer */}
                      <div className="flex gap-4 text-gray-400 text-sm font-medium">
                        <button className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors">
                          <ChatBubbleLeftIcon className="w-5 h-5" /> Comments
                        </button>
                        <button className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors">
                          <ShareIcon className="w-5 h-5" /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - Info */}
      <div className="w-80 hidden lg:block p-6 border-l border-white/5 bg-base-200/30">
        {activeCommunity ? (
          <div className="card bg-base-100 border border-white/5 shadow-xl sticky top-6">
            <div className="bg-primary h-12 w-full rounded-t-2xl opacity-80"></div>
            <div className="px-4 pb-4">
              <div className="avatar -mt-6 mb-3">
                <div className="w-16 rounded-xl border-4 border-base-100 bg-base-200 text-3xl flex items-center justify-center">
                  {activeCommunity.name.substring(0, 1).toUpperCase()}
                </div>
              </div>
              <h2 className="font-bold text-xl">c/{activeCommunity.name}</h2>
              <p className="text-sm text-gray-400 mt-2 mb-4">{activeCommunity.description || 'No description provided.'}</p>

              <div className="divider my-2"></div>

              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">Members</span>
                <span className="font-bold">{activeCommunity.members?.length || 1}</span>
              </div>

              <button className="btn btn-primary btn-sm w-full btn-outline">Joined</button>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 border border-white/5 shadow-xl sticky top-6">
            <div className="card-body p-4">
              <h3 className="font-bold text-gray-400 uppercase text-xs mb-4">Trending Communities</h3>
              <ul className="space-y-4">
                {communities.slice(0, 5).map(c => (
                  <li key={c._id} className="flex justify-between items-center group cursor-pointer" onClick={() => setActiveCommunity(c)}>
                    <div className="flex items-center gap-2">
                      <div className="avatar placeholder">
                        <div className="w-8 bg-neutral text-neutral-content rounded-full">
                          <span className="text-xs">{c.name[0]}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium group-hover:underline">c/{c.name}</div>
                    </div>
                    <button className="btn btn-xs btn-primary">Join</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Create Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-2xl bg-[#1e2124] shadow-2xl border border-white/10 animate-pop-in">
            <div className="card-body p-0">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">Create a Post</h3>
                <button onClick={() => setIsPostModalOpen(false)}><XMarkIcon className="w-6 h-6 text-gray-400 hover:text-white" /></button>
              </div>

              <div className="p-6">
                {/* Community Selector (Simplified) */}
                <div className="mb-4">
                  <select
                    className="select select-bordered w-full md:w-1/2 bg-[#2b2d31]"
                    value={activeCommunity ? activeCommunity._id : ''}
                    disabled={!!activeCommunity}
                    onChange={(e) => {
                      const comm = communities.find(c => c._id === e.target.value);
                      if (comm) setActiveCommunity(comm);
                    }}
                  >
                    <option value="" disabled>Choose a community</option>
                    {communities.map(c => <option key={c._id} value={c._id}>c/{c.name}</option>)}
                  </select>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4 border-b border-white/5">
                  <button onClick={() => setPostType('text')} className={`pb-2 px-4 border-b-2 transition-colors ${postType === 'text' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>Post</button>
                  <button onClick={() => setPostType('image')} className={`pb-2 px-4 border-b-2 transition-colors flex items-center gap-2 ${postType === 'image' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}><PhotoIcon className="w-5 h-5" /> Image</button>
                  <button onClick={() => setPostType('poll')} className={`pb-2 px-4 border-b-2 transition-colors flex items-center gap-2 ${postType === 'poll' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}><Squares2X2Icon className="w-5 h-5" /> Poll</button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className="input input-bordered w-full bg-[#2b2d31]"
                    value={postTitle}
                    onChange={e => setPostTitle(e.target.value)}
                    maxLength={300}
                  />

                  {postType === 'text' && (
                    <textarea
                      className="textarea textarea-bordered h-40 w-full bg-[#2b2d31]"
                      placeholder="Text (optional)"
                      value={postContent}
                      onChange={e => setPostContent(e.target.value)}
                    ></textarea>
                  )}

                  {postType === 'image' && (
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors relative">
                      {postImage ? (
                        <div className="relative">
                          <img src={URL.createObjectURL(postImage)} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                          <button onClick={() => setPostImage(null)} className="absolute top-2 right-2 btn btn-circle btn-xs btn-error">✕</button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <PhotoIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                          <span className="text-gray-400">Drag and drop or click to upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) setPostImage(e.target.files[0]) }} />
                        </label>
                      )}
                    </div>
                  )}

                  {postType === 'poll' && (
                    <div className="space-y-2">
                      {pollOptions.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          placeholder={`Option ${i + 1}`}
                          className="input input-bordered w-full input-sm bg-[#2b2d31]"
                          value={opt}
                          onChange={e => {
                            const newOpts = [...pollOptions];
                            newOpts[i] = e.target.value;
                            setPollOptions(newOpts);
                          }}
                        />
                      ))}
                      <button onClick={() => setPollOptions([...pollOptions, ''])} className="btn btn-ghost btn-xs text-primary">+ Add Option</button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button className="btn btn-ghost" onClick={() => setIsPostModalOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleCreatePost}>Post</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Community Modal */}
      {isCommunityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md bg-[#1e2124] shadow-2xl border border-white/10 animate-pop-in">
            <div className="card-body">
              <h3 className="font-bold text-lg text-white mb-4">Create a Community</h3>
              <p className="text-sm text-gray-400 mb-4">Communities are spaces where people share interests.</p>

              <div className="form-control mb-4">
                <label className="label"><span className="label-text">Name</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">c/</span>
                  <input type="text" className="input input-bordered w-full pl-8" placeholder="community_name" value={newCommName} onChange={e => setNewCommName(e.target.value)} />
                </div>
                <label className="label"><span className="label-text-alt">{21 - newCommName.length} characters remaining</span></label>
              </div>

              <div className="form-control mb-6">
                <label className="label"><span className="label-text">Description</span></label>
                <textarea className="textarea textarea-bordered" placeholder="What is this community about?" value={newCommDesc} onChange={e => setNewCommDesc(e.target.value)}></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <button className="btn btn-ghost" onClick={() => setIsCommunityModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreateCommunity}>Create Community</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Community;
