import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  BookOpenIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  PhotoIcon,
  Squares2X2Icon,
  TrashIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Types
interface CommunityType {
  _id: string;
  name: string;
  description: string;
  icon: string;
  members: string[];
  rules?: string;
  privacy?: 'public' | 'restricted' | 'private';
}

interface CommentType {
  _id: string;
  content: string;
  author: { username: string; avatarSeed: string };
  parentComment?: string | null;
  likes: number;
  createdAt: string;
  replies?: CommentType[];
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
    _id?: string; // Important for edit checks
  };
  likes: string[]; // Array of user IDs
  createdAt: string;
}

const Community = () => {
  // Global State
  const [activeCommunity, setActiveCommunity] = useState<CommunityType | null>(null);
  const [communities, setCommunities] = useState<CommunityType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'hot' | 'new' | 'top'>('hot'); // hot default

  // UI State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // Forms
  const [postType, setPostType] = useState<'text' | 'poll' | 'image'>('text');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Community Form (Expanded)
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommRules, setNewCommRules] = useState('');
  const [newCommStep, setNewCommStep] = useState(1); // 1: Info, 2: Rules/Type

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const user = JSON.parse(localStorage.getItem('user') || '{"username": "Guest", "avatarSeed": "Guest", "_id": "dummy_id"}');

  useEffect(() => { fetchCommunities(); }, []);
  // Fetch posts when dependencies change
  useEffect(() => { fetchPosts(); }, [activeCommunity, filterMode]);

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
      if (res.ok) {
        let data: PostType[] = await res.json();

        // Client-side Sort (as backend might not have complex sorts yet)
        if (filterMode === 'hot') {
          // Hot: Ratio of likes to age, simplified as just likes for now or random
          data.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        } else if (filterMode === 'new') {
          data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (filterMode === 'top') {
          data.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        }

        setPosts(data);
      }
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

    // Determine Community ID
    const targetCommId = activeCommunity ? activeCommunity._id : (communities.length > 0 ? communities[0]._id : null); // Fallback logic or block
    if (!targetCommId) return alert("Please join a community to post!");

    formData.append('communityId', targetCommId);

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

  const handleCreateCommunity = async () => {
    if (!newCommName) return alert('Name is required');

    try {
      const res = await fetch(`${API_URL}/api/communities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCommName,
          description: newCommDesc,
          rules: newCommRules,
          userId: user._id || 'dummy_id_for_now'
        }),
      });

      if (res.ok) {
        setIsCommunityModalOpen(false);
        setNewCommName(''); setNewCommDesc(''); setNewCommRules(''); setNewCommStep(1);
        fetchCommunities();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create community');
      }
    } catch (err) { console.error(err); }
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistic logic: Toggle ID in array
      const post = posts.find(p => p._id === id);
      if (!post) return;

      const userId = user._id || 'dummy_id';
      const alreadyLiked = post.likes.includes(userId);
      const newLikes = alreadyLiked
        ? post.likes.filter(uid => uid !== userId)
        : [...post.likes, userId];

      setPosts(posts.map(p => p._id === id ? { ...p, likes: newLikes } : p));

      await fetch(`${API_URL}/api/posts/${id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (err) { console.error(err); }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleJoinLeave = async (commId: string, action: 'join' | 'leave') => {
    try {
      await fetch(`${API_URL}/api/communities/${commId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id || 'dummy_id_for_now' })
      });
      fetchCommunities();
      const updated = communities.find(c => c._id === commId);
      if (activeCommunity?._id === commId && updated) setActiveCommunity(updated);
    } catch (err) { console.error(err); }
  };

  const toggleComments = (postId: string) => {
    const newSet = new Set(expandedComments);
    if (newSet.has(postId)) newSet.delete(postId);
    else newSet.add(postId);
    setExpandedComments(newSet);
  };

  // --- Inner Components ---

  const CommentSection = ({ postId }: { postId: string }) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [mainReply, setMainReply] = useState(''); // Text for box at top
    const [replyMap, setReplyMap] = useState<{ [key: string]: string }>({}); // Map id -> content for nested
    const [replyingToId, setReplyingToId] = useState<string | null>(null); // Which comment is being replied to
    const [loadingComments, setLoadingComments] = useState(true);

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/comments/${postId}`);
        if (res.ok) {
          const flat = await res.json();
          const map = new Map(); const roots: CommentType[] = [];
          flat.forEach((c: any) => { c.replies = []; map.set(c._id, c); });
          flat.forEach((c: any) => {
            if (c.parentComment) map.get(c.parentComment)?.replies?.push(c);
            else roots.push(c);
          });
          setComments(roots);
        }
      } finally { setLoadingComments(false); }
    };

    useEffect(() => { load(); }, [postId]);

    const postComment = async (parentId: string | null = null, content: string) => {
      if (!content.trim()) return;
      try {
        const res = await fetch(`${API_URL}/api/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId,
            content,
            parentCommentId: parentId,
            authorName: user.username,
            authorAvatar: user.avatarSeed
          })
        });
        if (res.ok) {
          if (parentId) {
            setReplyMap({ ...replyMap, [parentId]: '' });
            setReplyingToId(null);
          } else {
            setMainReply('');
          }
          load(); // Refresh tree
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
              <button onClick={() => setReplyingToId(replyingToId === comment._id ? null : comment._id)} className="hover:text-primary">Reply</button>
            </div>

            {replyingToId === comment._id && (
              <div className="mt-2 flex gap-2 animate-fade-in">
                <input
                  autoFocus
                  className="input input-xs input-bordered w-full max-w-xs bg-base-300"
                  placeholder="Write a reply..."
                  value={replyMap[comment._id] || ''}
                  onChange={e => setReplyMap({ ...replyMap, [comment._id]: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && postComment(comment._id, replyMap[comment._id])}
                />
                <button onClick={() => postComment(comment._id, replyMap[comment._id])} className="btn btn-xs btn-primary">Send</button>
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
      <div className="mt-4 pt-4 border-t border-white/5 bg-base-200/20 p-4 rounded-xl">
        <h4 className="text-sm font-bold text-gray-400 mb-4">Comments</h4>
        {/* Main Comment Input */}
        <div className="flex gap-3 mb-6">
          <div className="avatar w-8 h-8 rounded-full overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`} alt="me" />
          </div>
          <div className="flex-1 relative">
            <textarea
              className="textarea textarea-bordered w-full bg-base-300 min-h-[60px] text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="What are your thoughts?"
              value={mainReply}
              onChange={e => setMainReply(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button onClick={() => postComment(null, mainReply)} disabled={!mainReply.trim()} className="btn btn-sm btn-primary rounded-full px-6">Comment</button>
            </div>
          </div>
        </div>
        {loadingComments ? (
          <div className="text-center py-4 text-xs text-gray-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-500">No comments yet.</div>
        ) : (
          <div className="space-y-1">
            {comments.map(c => <CommentNode key={c._id} comment={c} />)}
          </div>
        )}
      </div>
    );
  };

  const isUserMember = (comm: CommunityType | undefined): boolean => {
    if (!comm) return false;
    return comm.members?.includes(user._id || 'dummy_id');
  };

  // Determine which posts to show in "strict" Home view
  const visiblePosts = activeCommunity
    ? posts
    : posts.filter(p => !p.community || (p.community && isUserMember(p.community as CommunityType))); // Only show posts from joined communities on Home

  return (
    <div className="flex min-h-screen bg-base-300 justify-center w-full">
      <div className="w-full max-w-[1600px] flex">

        {/* LEFT NAV */}
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
              <button key={c._id} onClick={() => setActiveCommunity(c)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${activeCommunity?._id === c._id ? 'bg-base-100 border-l-4 border-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`} className="w-6 h-6 rounded-full" alt="icon" />
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CENTER FEED */}
        <div className="flex-1 min-w-0 border-r border-white/5 bg-base-300">
          {activeCommunity && (
            <div className="h-40 bg-gradient-to-r from-blue-900 to-primary/30 relative mb-4">
              <div className="absolute -bottom-6 left-8 flex items-end gap-4">
                <div className="w-24 h-24 rounded-2xl bg-base-100 p-1 shadow-xl">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeCommunity.name}`} className="w-full h-full rounded-xl bg-base-200" alt="icon" />
                </div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-white flex items-center gap-4">
                    {activeCommunity.name}
                    {!isUserMember(activeCommunity)
                      ? <button className="btn btn-sm btn-primary" onClick={() => handleJoinLeave(activeCommunity._id, 'join')}>Join</button>
                      : <button className="btn btn-sm btn-outline" onClick={() => handleJoinLeave(activeCommunity._id, 'leave')}>Joined</button>
                    }
                  </h1>
                  <p className="text-sm text-gray-200 opacity-80 mt-1">{activeCommunity.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 md:p-8 max-w-4xl mx-auto md:pt-10">
            {/* Post Creator / Join Prompt */}
            {(activeCommunity ? isUserMember(activeCommunity) : true) ? (
              <div className="bg-base-100 mb-6 rounded-xl border border-white/5 p-4 flex gap-4 items-center shadow-lg hover:border-white/10 transition-all cursor-pointer" onClick={() => setIsPostModalOpen(true)}>
                <div className="avatar w-10 h-10 rounded-full overflow-hidden border border-white/10">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`} alt="me" />
                </div>
                <input type="text" placeholder="Create a post..." className="input bg-base-200 w-full focus:outline-none pointer-events-none" readOnly />
                <PhotoIcon className="w-6 h-6 text-gray-500" />
              </div>
            ) : (
              <div className="alert bg-base-100 border-primary/20 text-primary mb-6 shadow-lg">
                <ExclamationTriangleIcon className="w-6 h-6" />
                <span className="font-bold">Join c/{activeCommunity?.name} to start posting!</span>
                <button className="btn btn-sm btn-primary ml-auto" onClick={() => handleJoinLeave(activeCommunity!._id, 'join')}>Join Now</button>
              </div>
            )}

            {/* Filters */}
            <div className="flex gap-4 mb-4 text-sm font-bold text-gray-500 border-b border-white/5 pb-2">
              <button onClick={() => setFilterMode('hot')} className={`hover:text-gray-200 px-2 transition-colors ${filterMode === 'hot' ? 'text-primary border-b-2 border-primary' : ''}`}>Hot</button>
              <button onClick={() => setFilterMode('new')} className={`hover:text-gray-200 px-2 transition-colors ${filterMode === 'new' ? 'text-primary border-b-2 border-primary' : ''}`}>New</button>
              <button onClick={() => setFilterMode('top')} className={`hover:text-gray-200 px-2 transition-colors ${filterMode === 'top' ? 'text-primary border-b-2 border-primary' : ''}`}>Top</button>
            </div>

            {/* Feed Content */}
            {loading ? (
              <div className="flex justify-center py-20"><span className="loading loading-bars loading-lg text-primary"></span></div>
            ) : visiblePosts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-6xl mb-4">🕸️</div>
                <p>No posts here yet. {activeCommunity ? 'Be the first to post!' : 'Join some communities to see your feed!'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visiblePosts.map(post => {
                  const isLiked = post.likes && post.likes.includes(user._id || 'dummy_id');
                  return (
                    <div key={post._id} className="bg-base-100 rounded-xl border border-white/5 shadow-md hover:border-white/10 transition-all overflow-hidden group">
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {post.community && (
                              <button className="font-bold text-gray-200 hover:underline flex items-center gap-1" onClick={(e) => { e.stopPropagation(); setActiveCommunity(post.community!); }}>
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.community.name}`} className="w-4 h-4 rounded-full" />
                                c/{post.community.name}
                              </button>
                            )}
                            <span>• Posted by u/{post.author.username}</span>
                            <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>

                          {/* Edit/Delete if Author */}
                          {/* Note: In real app use verified ID from token, here relying on local ID roughly */}
                          {(post.author._id === user._id || post.author.username === user.username) && (
                            <div className="dropdown dropdown-end">
                              <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle"><Squares2X2Icon className="w-4 h-4" /></label>
                              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-32 border border-white/10">
                                <li><a className="text-error" onClick={() => handleDeletePost(post._id)}><TrashIcon className="w-4 h-4" /> Delete</a></li>
                              </ul>
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-100 mb-2 leading-tight">{post.title}</h3>
                        {post.type === 'text' && <div className="text-sm text-gray-300/90 whitespace-pre-wrap">{post.content}</div>}
                        {post.type === 'image' && post.image && (
                          <div className="mt-3 rounded-lg overflow-hidden bg-black/50 border border-white/5 flex justify-center">
                            <img src={`${API_URL}${post.image}`} className="max-h-[500px] object-contain" alt="Content" />
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="bg-base-200/30 px-4 py-2 flex items-center gap-2 border-t border-white/5">
                        <button className={`btn btn-ghost btn-sm gap-2 rounded-full ${isLiked ? 'text-primary' : 'hover:bg-white/5'}`} onClick={(e) => handleUpvote(post._id, e)}>
                          <BookOpenIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                          <span className="font-bold">{post.likes?.length || 0}</span>
                        </button>
                        <button onClick={() => toggleComments(post._id)} className="btn btn-ghost btn-sm gap-2 rounded-full hover:bg-white/5">
                          <ChatBubbleLeftIcon className="w-5 h-5" /> Comments
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Copied!'))} className="btn btn-ghost btn-sm gap-2 rounded-full hover:bg-white/5 ml-auto">
                          <ShareIcon className="w-5 h-5" /> Share
                        </button>
                      </div>
                      {expandedComments.has(post._id) && <CommentSection postId={post._id} />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[300px] hidden xl:flex flex-col gap-6 p-6 sticky top-20 h-fit">
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
                    {!isUserMember(c) && <button className="btn btn-xs btn-primary rounded-full" onClick={(e) => { e.stopPropagation(); handleJoinLeave(c._id, 'join'); }}>Join</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* Create Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-2xl bg-[#1e2124] shadow-2xl border border-white/10">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-lg text-white">Create a Post</h3>
              <button onClick={() => setIsPostModalOpen(false)}><XMarkIcon className="w-6 h-6 text-gray-400 hover:text-white" /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 text-sm text-gray-400">
                Posting to: <span className="font-bold text-white">c/{activeCommunity?.name || '...'}</span>
                {!activeCommunity && <span className="text-error ml-2">(Please select a community context first)</span>}
              </div>
              <div className="space-y-4">
                <input className="input input-bordered w-full bg-[#2b2d31]" placeholder="Title" value={postTitle} onChange={e => setPostTitle(e.target.value)} />
                <textarea className="textarea textarea-bordered h-40 w-full bg-[#2b2d31]" placeholder="Text (optional)" value={postContent} onChange={e => setPostContent(e.target.value)}></textarea>
                <div className="flex justify-end gap-2 pt-4">
                  <button className="btn btn-ghost" onClick={() => setIsPostModalOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleCreatePost}>Post</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Create Community Modal */}
      {isCommunityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg bg-[#1e2124] shadow-2xl border border-white/10">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">Create a Community</h3>

              {newCommStep === 1 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Name</label>
                    <div className="relative"><span className="absolute left-3 top-3 text-gray-500">c/</span><input className="input input-bordered w-full pl-8" placeholder="community_name" value={newCommName} onChange={e => setNewCommName(e.target.value)} /></div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Description</label>
                    <textarea className="textarea textarea-bordered w-full" placeholder="What is this community about?" value={newCommDesc} onChange={e => setNewCommDesc(e.target.value)}></textarea>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="btn btn-ghost" onClick={() => setIsCommunityModalOpen(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => setNewCommStep(2)}>Next: Rules</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Community Rules</label>
                    <textarea className="textarea textarea-bordered w-full h-32" placeholder="1. Be respectful..." value={newCommRules} onChange={e => setNewCommRules(e.target.value)}></textarea>
                  </div>
                  <div className="alert alert-warning text-xs">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span>By creating a community, you agree to be the moderator.</span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="btn btn-ghost" onClick={() => setNewCommStep(1)}>Back</button>
                    <button className="btn btn-primary" onClick={handleCreateCommunity}>Create Community</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
