import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  BookOpenIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  PhotoIcon,
  Squares2X2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { BookOpenIcon as BookOpenSolidIcon } from '@heroicons/react/24/solid';

// Types
interface CommunityType {
  _id: string;
  name: string;
  description: string;
  icon: string;
  members: string[];
}

interface CommentType {
  _id: string;
  content: string;
  author: { username: string; avatarSeed: string };
  parentComment?: string | null;
  likes: number;
  createdAt: string;
  replies?: CommentType[]; // For UI nesting
}

interface PostType {
  _id: string;
  type: 'text' | 'poll' | 'image';
  title: string;
  content?: string;
  image?: string;
  community?: CommunityType;
  options?: { text: string; votes: number }[];
  author: {
    username: string;
    avatarSeed: string;
  };
  likes: number;
  createdAt: string;
  commentsCount?: number; // Optional metadata if we add it later
}

const Community = () => {
  // Global State
  const [activeCommunity, setActiveCommunity] = useState<CommunityType | null>(null);
  const [communities, setCommunities] = useState<CommunityType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set()); // Post IDs with open comments

  // Forms
  const [postType, setPostType] = useState<'text' | 'poll' | 'image'>('text');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const user = JSON.parse(localStorage.getItem('user') || '{"username": "Guest", "avatarSeed": "Guest", "_id": "dummy_id"}');

  useEffect(() => { fetchCommunities(); }, []);
  useEffect(() => { fetchPosts(); }, [activeCommunity]);

  // --- API Actions ---

  const fetchCommunities = async () => {
    try {
      const res = await fetch(`${API_URL}/api/communities`);
      if (res.ok) setCommunities(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/posts`;
      if (activeCommunity) url += `?communityId=${activeCommunity._id}`;
      const res = await fetch(url);
      if (res.ok) setPosts(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreatePost = async () => {
    if (!postTitle) return alert('Title is required');
    const formData = new FormData();
    formData.append('type', postType);
    formData.append('title', postTitle);
    formData.append('authorName', user.username);
    formData.append('authorAvatar', user.avatarSeed);
    if (activeCommunity) formData.append('communityId', activeCommunity._id);

    if (postType === 'text') formData.append('content', postContent);
    else if (postType === 'image' && postImage) {
      formData.append('image', postImage);
      formData.append('content', postContent);
    } else if (postType === 'poll') {
      const validOptions = pollOptions.filter(o => o.trim()).map(text => ({ text, votes: 0 }));
      formData.append('options', JSON.stringify(validOptions));
    }

    try {
      const res = await fetch(`${API_URL}/api/posts`, { method: 'POST', body: formData });
      if (res.ok) {
        setIsPostModalOpen(false);
        setPostTitle(''); setPostContent(''); setPostImage(null); setPollOptions(['', '']);
        fetchPosts();
      }
    } catch (err) { console.error(err); }
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

  const handleJoinLeave = async (commId: string, action: 'join' | 'leave') => {
    try {
      await fetch(`${API_URL}/api/communities/${commId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id || 'dummy_id_for_now' })
      });
      fetchCommunities();
      if (activeCommunity?._id === commId) {
        // Refresh active community state
        const updated = communities.find(c => c._id === commId);
        if (updated) setActiveCommunity(updated); // This might lag slightly, ideally refetch
      }
    } catch (err) { console.error(err); }
  };

  const toggleComments = (postId: string) => {
    const newSet = new Set(expandedComments);
    if (newSet.has(postId)) newSet.delete(postId);
    else newSet.add(postId);
    setExpandedComments(newSet);
  };

  // --- Sub-Components ---

  const CommentSection = ({ postId }: { postId: string }) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null); // Comment ID
    const [loadingComments, setLoadingComments] = useState(true);

    useEffect(() => {
      const fetchComments = async () => {
        try {
          const res = await fetch(`${API_URL}/api/comments/${postId}`);
          if (res.ok) {
            const flatComments = await res.json();
            // Build Tree
            const map = new Map();
            const roots: CommentType[] = [];
            flatComments.forEach((c: any) => {
              c.replies = [];
              map.set(c._id, c);
            });
            flatComments.forEach((c: any) => {
              if (c.parentComment) {
                map.get(c.parentComment)?.replies?.push(c);
              } else {
                roots.push(c);
              }
            });
            setComments(roots);
          }
        } finally { setLoadingComments(false); }
      };
      fetchComments();
    }, [postId]);

    const postComment = async (parentId: string | null = null) => {
      if (!replyContent.trim()) return;
      try {
        const res = await fetch(`${API_URL}/api/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId,
            content: replyContent,
            parentCommentId: parentId,
            authorName: user.username,
            authorAvatar: user.avatarSeed
          })
        });
        if (res.ok) {
          const newComment = await res.json();
          setReplyContent('');
          setReplyingTo(null);
          // Re-fetch logic duplicated for simplicity or trigger parent reload
          const refresh = await fetch(`${API_URL}/api/comments/${postId}`);
          if (refresh.ok) {
            const flat = await refresh.json();
            const map = new Map(); const roots: any[] = [];
            flat.forEach((c: any) => { c.replies = []; map.set(c._id, c); });
            flat.forEach((c: any) => {
              if (c.parentComment) map.get(c.parentComment)?.replies?.push(c);
              else roots.push(c);
            });
            setComments(roots);
          }
        }
      } catch (e) { console.error(e); }
    };

    const CommentNode = ({ comment, depth = 0 }: { comment: CommentType, depth?: number }) => (
      <div className={`mt-3 ${depth > 0 ? 'ml-4 pl-4 border-l border-white/10' : ''}`}>
        <div className="flex gap-2">
          <div className="avatar w-6 h-6 rounded-full overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.avatarSeed}`} alt="av" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span className="font-bold text-gray-200">{comment.author.username}</span>
              <span>• {new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
            <div className="flex gap-3 mt-2 text-xs text-gray-500 font-bold">
              <button className="hover:text-primary">Like ({comment.likes})</button>
              <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)} className="hover:text-primary">Reply</button>
            </div>

            {replyingTo === comment._id && (
              <div className="mt-2 flex gap-2">
                <input
                  autoFocus
                  className="input input-xs input-bordered w-full max-w-xs bg-base-300"
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && postComment(comment._id)}
                />
                <button onClick={() => postComment(comment._id)} className="btn btn-xs btn-primary">Send</button>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map(reply => <CommentNode key={reply._id} comment={reply} depth={depth + 1} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in-down bg-base-200/20 p-4 rounded-xl">
        <h4 className="text-sm font-bold text-gray-400 mb-4">Comments</h4>

        {/* New Comment Input */}
        <div className="flex gap-3 mb-6">
          <div className="avatar w-8 h-8 rounded-full overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`} alt="me" />
          </div>
          <div className="flex-1 relative">
            <textarea
              className="textarea textarea-bordered w-full bg-base-300 min-h-[60px] text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="What are your thoughts?"
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => postComment(null)}
                disabled={!replyContent.trim()}
                className="btn btn-sm btn-primary rounded-full px-6"
              >
                Comment
              </button>
            </div>
          </div>
        </div>

        {loadingComments ? (
          <div className="text-center py-4 text-xs text-gray-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-500">No comments yet. Be the first to share your thoughts!</div>
        ) : (
          <div className="space-y-1">
            {comments.map(c => <CommentNode key={c._id} comment={c} />)}
          </div>
        )}
      </div>
    );
  };

  const isUserMember = (comm: CommunityType | undefined) => {
    if (!comm) return false;
    // Mock check since members are just IDs - assumes user._id is in array.
    // In real app, user object would come from context/auth
    return comm.members?.includes(user._id || 'dummy_id_for_now');
  };

  return (
    <div className="flex min-h-screen bg-base-300 justify-center w-full">
      <div className="w-full max-w-[1600px] flex">

        {/* LEFT NAV (Fixed Width) */}
        <div className="w-[260px] hidden lg:flex flex-col border-r border-white/5 bg-base-200/50 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs font-bold text-gray-500 tracking-widest">FEEDS</span>
          </div>
          <button onClick={() => setActiveCommunity(null)} className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all ${!activeCommunity ? 'bg-primary/20 text-white font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <Squares2X2Icon className="w-5 h-5" /> <span>Home</span>
          </button>

          <div className="divider my-4"></div>

          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-bold text-gray-500 tracking-widest">COMMUNITIES</span>
            <button onClick={() => setIsCommunityModalOpen(true)} className="hover:text-white text-gray-500"><PlusIcon className="w-4 h-4" /></button>
          </div>

          <div className="space-y-1">
            {communities.map(c => (
              <button
                key={c._id}
                onClick={() => setActiveCommunity(c)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${activeCommunity?._id === c._id ? 'bg-base-100 border-l-4 border-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`} className="w-6 h-6 rounded-full" alt="icon" />
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CENTER FEED (Fluid) */}
        <div className="flex-1 min-w-0 border-r border-white/5 bg-base-300">
          {/* Banner if strict community */}
          {activeCommunity && (
            <div className="h-32 bg-gradient-to-r from-blue-900 to-primary/30 relative">
              <div className="absolute -bottom-6 left-8 flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl bg-base-100 p-1 shadow-xl">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeCommunity.name}`} className="w-full h-full rounded-xl bg-base-200" alt="icon" />
                </div>
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {activeCommunity.name}
                    {!isUserMember(activeCommunity) && <button className="btn btn-xs btn-primary ml-4" onClick={() => handleJoinLeave(activeCommunity._id, 'join')}>Join</button>}
                    {isUserMember(activeCommunity) && <button className="btn btn-xs btn-outline ml-4" onClick={() => handleJoinLeave(activeCommunity._id, 'leave')}>Joined</button>}
                  </h1>
                  <p className="text-sm text-gray-200 opacity-80">{activeCommunity.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 md:p-8 max-w-4xl mx-auto pt-10">
            {/* Post Input Trigger */}
            {(activeCommunity ? isUserMember(activeCommunity) : true) ? (
              <div className="bg-base-100 mb-6 rounded-xl border border-white/5 p-4 flex gap-4 items-center shadow-lg hover:border-white/10 transition-all cursor-pointer" onClick={() => setIsPostModalOpen(true)}>
                <div className="avatar w-10 h-10 rounded-full overflow-hidden border border-white/10">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`} alt="me" />
                </div>
                <input type="text" placeholder="Create a post..." className="input bg-base-200 w-full focus:outline-none pointer-events-none" readOnly />
                <PhotoIcon className="w-6 h-6 text-gray-500" />
                <Squares2X2Icon className="w-6 h-6 text-gray-500" />
              </div>
            ) : (
              <div className="alert alert-info bg-primary/10 border-primary/20 text-primary mb-6">
                <span className="font-bold">Join c/{activeCommunity?.name} to start posting and commenting!</span>
              </div>
            )}

            {/* Filter Tabs (Optional visual) */}
            <div className="flex gap-4 mb-4 text-sm font-bold text-gray-500 border-b border-white/5 pb-2">
              <button className="text-primary border-b-2 border-primary pb-2 px-2">Hot</button>
              <button className="hover:text-gray-300 px-2">New</button>
              <button className="hover:text-gray-300 px-2">Top</button>
            </div>

            {/* Feed */}
            {loading ? (
              <div className="flex justify-center py-20"><span className="loading loading-bars loading-lg text-primary"></span></div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-6xl mb-4">🕸️</div>
                <p>No posts here yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post._id} className="bg-base-100 rounded-xl border border-white/5 shadow-md hover:border-white/10 transition-all overflow-hidden group">
                    {/* Post Body */}
                    <div className="p-4">
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        {post.community && (
                          <button className="font-bold text-gray-200 hover:underline flex items-center gap-1" onClick={(e) => { e.stopPropagation(); setActiveCommunity(post.community!); }}>
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.community.name}`} className="w-4 h-4 rounded-full" />
                            c/{post.community.name}
                          </button>
                        )}
                        <span>• Posted by u/{post.author.username}</span>
                        <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-100 mb-2 leading-tight">{post.title}</h3>

                      {post.type === 'text' && <div className="text-sm text-gray-300/90 whitespace-pre-wrap leading-relaxed line-clamp-6">{post.content}</div>}

                      {post.type === 'image' && post.image && (
                        <div className="mt-3 rounded-lg overflow-hidden bg-black/50 border border-white/5 flex justify-center">
                          <img src={`${API_URL}${post.image}`} className="max-h-[500px] object-contain" alt="Content" />
                        </div>
                      )}

                      {post.type === 'poll' && post.options && (
                        <div className="mt-3 space-y-2 bg-base-200/50 p-4 rounded-lg">
                          {post.options.map((opt, i) => {
                            const total = post.options!.reduce((a, b) => a + b.votes, 0);
                            const pct = total === 0 ? 0 : Math.round((opt.votes / total) * 100);
                            return (
                              <div key={i} onClick={() => handleVote(post._id, i)} className="relative h-10 bg-base-300 rounded cursor-pointer overflow-hidden border border-white/5 hover:border-primary/30 transition-all">
                                <div className="absolute inset-0 bg-primary/10 transition-all duration-700 ease-out" style={{ width: `${pct}%` }}></div>
                                <div className="absolute inset-0 flex items-center justify-between px-4 text-sm font-medium z-10">
                                  <span>{opt.text}</span>
                                  <span className="text-xs opacity-70">{pct}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-base-200/30 px-4 py-2 flex items-center gap-2 border-t border-white/5">
                      <button className="btn btn-ghost btn-sm gap-2 rounded-full hover:bg-white/5" onClick={(e) => handleUpvote(post._id, e)}>
                        <BookOpenIcon className="w-5 h-5" />
                        <span className="font-bold">{post.likes} Upvotes</span>
                      </button>
                      <button onClick={() => toggleComments(post._id)} className="btn btn-ghost btn-sm gap-2 rounded-full hover:bg-white/5">
                        <ChatBubbleLeftIcon className="w-5 h-5" />
                        <span className="font-medium">Comments</span>
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'))}
                        className="btn btn-ghost btn-sm gap-2 rounded-full hover:bg-white/5 ml-auto"
                      >
                        <ShareIcon className="w-5 h-5" />
                        <span className="font-medium">Share</span>
                      </button>
                    </div>

                    {/* Comments Section (Collapsible) */}
                    {expandedComments.has(post._id) && (
                      <CommentSection postId={post._id} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR (Fixed) */}
        <div className="w-[300px] hidden xl:flex flex-col gap-6 p-6 sticky top-20 h-fit">

          {/* Recent Widget */}
          <div className="card bg-base-100 border border-white/5 shadow-xl">
            <div className="card-body p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Trending Communities</h3>
              <div className="space-y-3">
                {communities.slice(0, 5).map((c, i) => (
                  <div key={c._id} className="flex items-center justify-between group cursor-pointer" onClick={() => setActiveCommunity(c)}>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-bold w-4">{i + 1}</span>
                      <div className="avatar w-8 h-8 rounded-full border border-white/10 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold group-hover:underline">c/{c.name}</span>
                        <span className="text-[10px] text-gray-500">{c.members?.length || 1} members</span>
                      </div>
                    </div>
                    <button className="btn btn-xs btn-primary rounded-full">Join</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info / Footer */}
          <div className="card bg-base-100 border border-white/5 shadow-xl">
            <div className="card-body p-4">
              <div className="text-xs text-gray-500 leading-relaxed">
                <p className="mb-2">Home of the Student Tech Community.</p>
                <div className="flex flex-wrap gap-2 text-primary cursor-pointer hover:underline">
                  <span>User Agreement</span>
                  <span>Privacy Policy</span>
                </div>
                <p className="mt-4">© 2026 STC Platform.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* --- MODALS (Create Community / Post) --- */}
      {/* (Kept similar to previous, but ensured accessibility) */}
      {isCommunityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-base-100 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Create a Community</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Name</label>
                <input className="input input-bordered w-full" placeholder="e.g. webdev" value={newCommName} onChange={e => setNewCommName(e.target.value)} />
                <p className="text-xs text-gray-500 mt-1">c/{newCommName || '...'}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Description</label>
                <textarea className="textarea textarea-bordered w-full" placeholder="What is this community about?" value={newCommDesc} onChange={e => setNewCommDesc(e.target.value)}></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => setIsCommunityModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreateCommunity}>Create Community</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPostModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e2124] w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-pop-in">
            <div className="p-4 border-b border-white/10 flex justify-between items-center text-lg font-bold">
              <span>Create a Post</span>
              <button onClick={() => setIsPostModalOpen(false)}><XMarkIcon className="w-6 h-6 text-gray-400 hover:text-white" /></button>
            </div>
            <div className="p-6">
              {/* Community Selector */}
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
              <div className="flex gap-2 mb-4">
                {['text', 'image', 'poll'].map(t => (
                  <button
                    key={t}
                    onClick={() => setPostType(t as any)}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${postType === t ? 'bg-base-100 text-white shadow' : 'text-gray-500 hover:bg-base-100/50'}`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <input className="input input-bordered w-full bg-[#2b2d31]" placeholder="Title" value={postTitle} onChange={e => setPostTitle(e.target.value)} />

                {postType === 'text' && <textarea className="textarea textarea-bordered w-full bg-[#2b2d31] h-32" placeholder="Text (optional)" value={postContent} onChange={e => setPostContent(e.target.value)} />}

                {postType === 'image' && (
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:bg-white/5 relative">
                    {postImage ? (
                      <>
                        <img src={URL.createObjectURL(postImage)} className="h-40 mx-auto rounded" />
                        <button onClick={(e) => { e.stopPropagation(); setPostImage(null); }} className="btn btn-xs btn-circle btn-error absolute top-2 right-2">x</button>
                      </>
                    ) : (
                      <label className="block w-full h-full">
                        <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && setPostImage(e.target.files[0])} />
                        <PhotoIcon className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                        <span className="text-gray-400 text-sm">Upload Image</span>
                      </label>
                    )}
                  </div>
                )}

                {postType === 'poll' && (
                  <div className="space-y-2">
                    {pollOptions.map((opt, i) => (
                      <input key={i} className="input input-bordered w-full input-sm bg-[#2b2d31]" placeholder={`Option ${i + 1}`} value={opt} onChange={e => { const n = [...pollOptions]; n[i] = e.target.value; setPollOptions(n); }} />
                    ))}
                    <button onClick={() => setPollOptions([...pollOptions, ''])} className="btn btn-ghost btn-xs text-primary">+ Add Option</button>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button className="btn btn-primary px-8 rounded-full" onClick={handleCreatePost}>Post</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
