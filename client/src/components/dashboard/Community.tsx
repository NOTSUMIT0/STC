import { useState, useEffect, useRef } from 'react';
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
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  FlagIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Types
interface CommunityType {
  _id: string;
  name: string;
  description: string;
  icon: string;
  banner?: string;
  members: string[];
  rules?: string;
  privacy?: 'public' | 'restricted' | 'private';
  createdAt: string;
  creator: string;
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
    _id?: string;
  };
  likes: string[];
  createdAt: string;
}

const Community = () => {
  // Global State
  const [activeCommunity, setActiveCommunity] = useState<CommunityType | null>(null);
  const [communities, setCommunities] = useState<CommunityType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'hot' | 'new' | 'top'>('hot');

  // UI State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false); // Used for CREATE
  const [isEditCommModalOpen, setIsEditCommModalOpen] = useState(false);   // Used for EDIT

  // Edit Post State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // Create Post Forms
  const [postType, setPostType] = useState<'text' | 'poll' | 'image'>('text');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Create Community Form
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommRules, setNewCommRules] = useState('');
  const [newCommIcon, setNewCommIcon] = useState<File | null>(null);
  const [newCommBanner, setNewCommBanner] = useState<File | null>(null);
  const [newCommStep, setNewCommStep] = useState(1);

  // Edit Community Form
  const [editCommDesc, setEditCommDesc] = useState('');
  const [editCommRules, setEditCommRules] = useState('');
  const [editCommPrivacy, setEditCommPrivacy] = useState('');
  const [editCommIcon, setEditCommIcon] = useState<File | null>(null);
  const [editCommBanner, setEditCommBanner] = useState<File | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // FIX: Use a valid 24-char ObjectId for dummy user
  const rawUser = JSON.parse(localStorage.getItem('user') || '{}');
  const user = {
    ...rawUser,
    username: rawUser.username || "Guest",
    avatarSeed: rawUser.avatarSeed || "Guest",
    _id: rawUser._id || "507f1f77bcf86cd799439011"
  };

  useEffect(() => { fetchCommunities(); }, []);
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
        if (filterMode === 'hot') data.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        else if (filterMode === 'new') data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        else if (filterMode === 'top') data.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
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

    const targetCommId = activeCommunity ? activeCommunity._id : (communities.length > 0 ? communities[0]._id : null);
    if (!targetCommId) return alert("Select a community!");
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

    const formData = new FormData();
    formData.append('name', newCommName);
    formData.append('description', newCommDesc);
    formData.append('rules', newCommRules);
    formData.append('userId', user._id);
    if (newCommIcon) formData.append('icon', newCommIcon);
    if (newCommBanner) formData.append('banner', newCommBanner);

    try {
      const res = await fetch(`${API_URL}/api/communities`, { method: 'POST', body: formData });
      if (res.ok) {
        setIsCommunityModalOpen(false);
        setNewCommName(''); setNewCommDesc(''); setNewCommRules(''); setNewCommIcon(null); setNewCommBanner(null); setNewCommStep(1);
        fetchCommunities();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create community');
      }
    } catch (err) { console.error(err); }
  };

  const handleEditCommunity = async () => {
    if (!activeCommunity) return;
    const formData = new FormData();
    formData.append('description', editCommDesc);
    formData.append('rules', editCommRules);
    formData.append('privacy', editCommPrivacy);
    if (editCommIcon) formData.append('icon', editCommIcon);
    if (editCommBanner) formData.append('banner', editCommBanner);

    try {
      const res = await fetch(`${API_URL}/api/communities/${activeCommunity._id}`, { method: 'PUT', body: formData });
      if (res.ok) {
        const updated = await res.json();
        setActiveCommunity(updated);
        setIsEditCommModalOpen(false);
        fetchCommunities(); // Update list
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteCommunity = async () => {
    if (!activeCommunity || !confirm("Type DELETE to confirm deletion of c/" + activeCommunity.name)) return;
    try {
      await fetch(`${API_URL}/api/communities/${activeCommunity._id}`, { method: 'DELETE' });
      setActiveCommunity(null);
      fetchCommunities();
      alert('Community deleted');
    } catch (err) { console.error(err); }
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const post = posts.find(p => p._id === id);
      if (!post) return;
      const userId = user._id;
      const alreadyLiked = post.likes.includes(userId);
      const newLikes = alreadyLiked ? post.likes.filter(uid => uid !== userId) : [...post.likes, userId];
      setPosts(posts.map(p => p._id === id ? { ...p, likes: newLikes } : p));
      await fetch(`${API_URL}/api/posts/${id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (err) { console.error(err); }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete post?")) return;
    try {
      await fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleUpdatePost = async () => {
    if (!editingPost || !editTitle) return;
    try {
      const res = await fetch(`${API_URL}/api/posts/${editingPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent })
      });
      if (res.ok) { setIsEditModalOpen(false); fetchPosts(); }
    } catch (err) { console.error(err); }
  };

  const handleJoinLeave = async (commId: string, action: 'join' | 'leave') => {
    try {
      await fetch(`${API_URL}/api/communities/${commId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      fetchCommunities();
      const updated = communities.find(c => c._id === commId);
      if (activeCommunity?._id === commId && updated) setActiveCommunity(updated);
    } catch (err) { console.error(err); }
  };

  const openCommEdit = () => {
    if (!activeCommunity) return;
    setEditCommDesc(activeCommunity.description || '');
    setEditCommRules(activeCommunity.rules || '');
    setEditCommPrivacy(activeCommunity.privacy || 'public');
    setIsEditCommModalOpen(true);
  };

  const toggleComments = (postId: string) => {
    const newSet = new Set(expandedComments);
    if (newSet.has(postId)) newSet.delete(postId); else newSet.add(postId);
    setExpandedComments(newSet);
  };

  // --- Comment Section ---
  const CommentSection = ({ postId }: { postId: string }) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [mainReply, setMainReply] = useState('');
    const [replyMap, setReplyMap] = useState<{ [key: string]: string }>({});
    const [replyingToId, setReplyingToId] = useState<string | null>(null);

    useEffect(() => {
      fetch(`${API_URL}/api/comments/${postId}`).then(r => r.json()).then(flat => {
        const map = new Map(); const roots: CommentType[] = [];
        flat.forEach((c: any) => { c.replies = []; map.set(c._id, c); });
        flat.forEach((c: any) => { if (c.parentComment) map.get(c.parentComment)?.replies?.push(c); else roots.push(c); });
        setComments(roots);
      });
    }, [postId]);

    const postComment = async (parentId: string | null = null, content: string) => {
      if (!content.trim()) return;
      await fetch(`${API_URL}/api/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId, content, parentCommentId: parentId, authorName: user.username, authorAvatar: user.avatarSeed }) });
      if (parentId) { setReplyMap({ ...replyMap, [parentId]: '' }); setReplyingToId(null); } else setMainReply('');
      const res = await fetch(`${API_URL}/api/comments/${postId}`);
      const flat = await res.json();
      const map = new Map(); const roots: CommentType[] = [];
      flat.forEach((c: any) => { c.replies = []; map.set(c._id, c); });
      flat.forEach((c: any) => { if (c.parentComment) map.get(c.parentComment)?.replies?.push(c); else roots.push(c); });
      setComments(roots);
    };

    const CommentNode = ({ comment }: { comment: CommentType }) => (
      <div className="pl-4 border-l-2 border-[#343536] mt-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-700">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.avatarSeed}`} className="w-full h-full" />
          </div>
          <span className="font-bold text-xs text-gray-300">{comment.author.username}</span>
          <span className="text-[10px] text-gray-500">• {new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-200 mb-2">{comment.content}</p>
        <div className="flex gap-4 text-xs font-bold text-gray-500">
          <button className="hover:text-white" onClick={() => setReplyingToId(replyingToId === comment._id ? null : comment._id)}>Reply</button>
        </div>
        {replyingToId === comment._id && (
          <div className="mt-2 flex gap-2">
            <input className="input input-xs w-full bg-[#272729]" placeholder="Reply..." value={replyMap[comment._id] || ''} onChange={e => setReplyMap({ ...replyMap, [comment._id]: e.target.value })} />
            <button className="btn btn-xs btn-primary" onClick={() => postComment(comment._id, replyMap[comment._id])}>Reply</button>
          </div>
        )}
        {comment.replies?.map(r => <CommentNode key={r._id} comment={r} />)}
      </div>
    );

    return (
      <div className="p-4 bg-[#161617] rounded-b border-x border-b border-[#343536] -mt-1 pt-6">
        <div className="flex gap-2 mb-6">
          <input className="input input-sm w-full bg-[#272729]" placeholder="What are your thoughts?" value={mainReply} onChange={e => setMainReply(e.target.value)} />
          <button className="btn btn-sm btn-primary" onClick={() => postComment(null, mainReply)}>Comment</button>
        </div>
        {comments.map(c => <CommentNode key={c._id} comment={c} />)}
      </div>
    );
  };

  const isUserMember = (comm: CommunityType | undefined) => comm?.members?.includes(user._id);
  const visiblePosts = activeCommunity ? posts : posts.filter(p => !p.community || (p.community && isUserMember(p.community as CommunityType)));
  const isMod = activeCommunity?.creator === user._id;

  return (
    <div className="flex min-h-screen bg-[#0E1113] text-gray-200 justify-center w-full font-sans">
      <div className="w-full max-w-[1600px] flex">

        {/* LEFT NAV (Simplified) */}
        <div className="w-[270px] hidden lg:flex flex-col border-r border-[#343536] bg-[#0E1113] sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pt-4">
          {/* Community List items... */}
          <div className="flex justify-between items-center mb-4 px-4"><span className="text-[10px] font-bold text-gray-500 tracking-widest">FEEDS</span></div>
          <button onClick={() => setActiveCommunity(null)} className={`flex items-center gap-3 px-6 py-2 transition-all ${!activeCommunity ? 'bg-[#272729] border-r-4 border-gray-200' : 'hover:bg-[#272729]'}`}><Squares2X2Icon className="w-5 h-5" /> Home</button>
          <div className="divider my-4 border-[#343536]"></div>
          <div className="flex justify-between items-center mb-2 px-4"><span className="text-[10px] font-bold text-gray-500 tracking-widest">COMMUNITIES</span><button onClick={() => setIsCommunityModalOpen(true)}><PlusIcon className="w-5 h-5 hover:bg-[#272729] rounded" /></button></div>
          {communities.map(c => (
            <button key={c._id} onClick={() => setActiveCommunity(c)} className={`flex items-center gap-3 px-6 py-2 transition-all w-full text-left ${activeCommunity?._id === c._id ? 'bg-[#272729] border-r-4 border-gray-200' : 'hover:bg-[#272729]'}`}>
              <img src={c.icon.startsWith('/') ? `${API_URL}${c.icon}` : `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`} className="w-6 h-6 rounded-full" />
              <span className="truncate text-sm">{c.name}</span>
            </button>
          ))}
        </div>

        {/* CENTER CONTENT */}
        <div className="flex-1 min-w-0 bg-[#0E1113]">
          {/* COMMUNITY HEADER */}
          {activeCommunity ? (
            <div className="mb-4">
              {/* Banner */}
              <div className="h-48 w-full bg-[#33a8ff] relative overflow-hidden">
                {activeCommunity.banner && <img src={`${API_URL}${activeCommunity.banner}`} className="w-full h-full object-cover" />}
              </div>
              {/* Header Bar */}
              <div className="bg-[#1A1A1B] px-4 pb-4">
                <div className="max-w-5xl mx-auto relative flex items-start">
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-full border-4 border-[#1A1A1B] bg-white -mt-10 overflow-hidden relative z-10">
                    <img src={activeCommunity.icon.startsWith('/') ? `${API_URL}${activeCommunity.icon}` : `https://api.dicebear.com/7.x/initials/svg?seed=${activeCommunity.name}`} className="w-full h-full object-cover" />
                  </div>

                  <div className="ml-4 mt-2 flex-1 flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                        {activeCommunity.name}
                        {isMod && <button onClick={openCommEdit} className="btn btn-ghost btn-xs btn-circle text-gray-400 hover:text-gray-200"><Cog6ToothIcon className="w-5 h-5" /></button>}
                      </h1>
                      <p className="text-sm text-gray-500">c/{activeCommunity.name}</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="btn btn-sm rounded-full btn-outline border-white text-white hover:bg-[#272729]" onClick={() => setIsPostModalOpen(true)}>Create Post</button>
                      {!isUserMember(activeCommunity)
                        ? <button className="btn btn-sm rounded-full btn-primary" onClick={() => handleJoinLeave(activeCommunity._id, 'join')}>Join</button>
                        : <button className="btn btn-sm rounded-full btn-outline hover:bg-error hover:border-error" onClick={() => handleJoinLeave(activeCommunity._id, 'leave')}>Joined</button>
                      }
                      {isMod && (
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="btn btn-sm btn-circle btn-ghost"><EllipsisHorizontalIcon className="w-6 h-6" /></label>
                          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-[#1A1A1B] border border-[#343536] rounded-md w-40">
                            <li><a onClick={handleDeleteCommunity} className="text-error"><TrashIcon className="w-4 h-4" /> Delete Community</a></li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8"><h2 className="text-2xl font-bold">Home Feed</h2><div className="divider"></div></div>
          )}

          <div className="px-4 md:px-8 max-w-5xl mx-auto flex gap-6">
            {/* FEED */}
            <div className="flex-1 space-y-4">
              {/* Create Post Input Trigger (Reddit Style) */}
              <div className="bg-[#1A1A1B] border border-[#343536] p-2 rounded flex items-center gap-2 cursor-pointer hover:border-gray-500 transition-colors" onClick={() => setIsPostModalOpen(true)}>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`} /></div>
                <input type="text" placeholder="Create Post" className="input input-sm flex-1 bg-[#272729] border border-[#343536] hover:bg-[#1A1A1B] focus:outline-none" readOnly />
                <PhotoIcon className="w-6 h-6 text-gray-500" />
              </div>

              {/* Filter Bar */}
              <div className="border border-[#343536] rounded bg-[#1A1A1B] p-2 flex gap-4 text-sm font-bold text-gray-500">
                <button onClick={() => setFilterMode('hot')} className={`hover:bg-[#272729] px-3 py-1 rounded-full ${filterMode === 'hot' ? 'text-gray-100 bg-[#272729]' : ''}`}>Hot</button>
                <button onClick={() => setFilterMode('new')} className={`hover:bg-[#272729] px-3 py-1 rounded-full ${filterMode === 'new' ? 'text-gray-100 bg-[#272729]' : ''}`}>New</button>
                <button onClick={() => setFilterMode('top')} className={`hover:bg-[#272729] px-3 py-1 rounded-full ${filterMode === 'top' ? 'text-gray-100 bg-[#272729]' : ''}`}>Top</button>
              </div>

              {/* Posts */}
              {loading ? <div className="text-center py-10">Loading...</div> : visiblePosts.map(post => (
                <div key={post._id} className="bg-[#1A1A1B] border border-[#343536] rounded hover:border-gray-500 transition-colors cursor-pointer" onClick={() => toggleComments(post._id)}>
                  <div className="flex">

                    {/* Content */}
                    <div className="p-3 flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          {post.community && !activeCommunity && <span className="font-bold text-gray-300 hover:underline">c/{post.community.name}</span>}
                          <span>• Posted by u/{post.author.username}</span>
                          <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        {post.author.username === user.username && (
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} onClick={e => e.stopPropagation()} className="btn btn-ghost btn-xs btn-circle"><EllipsisHorizontalIcon className="w-4 h-4" /></label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-[#1A1A1B] border border-[#343536] rounded w-32">
                              <li><a onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); setEditingPost(post); setEditTitle(post.title); setEditContent(post.content || ''); }}>Edit</a></li>
                              <li><a onClick={(e) => { e.stopPropagation(); handleDeletePost(post._id); }}>Delete</a></li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-100 mb-2">{post.title}</h3>
                      {post.type === 'text' && <div className="text-sm text-gray-300 mb-4">{post.content}</div>}
                      {post.type === 'image' && post.image && <div className="bg-black border border-[#343536] rounded overflow-hidden mb-4 max-h-[500px] flex justify-center"><img src={`${API_URL}${post.image}`} className="object-contain" /></div>}

                      {/* ACTION BAR (VOTE + COMMENTS + SHARE) */}
                      <div className="flex gap-2 text-gray-500 text-xs font-bold items-center">
                        {/* Vote */}
                        <div className="flex bg-[#272729] rounded-full overflow-hidden items-center">
                          <button onClick={(e) => handleUpvote(post._id, e)} className={`p-2 hover:bg-[#343536] ${post.likes?.includes(user._id) ? 'text-orange-500' : 'hover:text-orange-500'}`}><BookOpenIcon className="w-5 h-5" /></button>
                          <span className="px-1 text-gray-200">{post.likes?.length || 0}</span>
                          <button className="p-2 hover:bg-[#343536] hover:text-blue-500"><BookOpenIcon className="w-5 h-5 rotate-180" /></button>
                        </div>

                        <div className="flex items-center gap-2 hover:bg-[#272729] p-2 rounded-full cursor-pointer" onClick={() => toggleComments(post._id)}><ChatBubbleLeftIcon className="w-5 h-5" /> {expandedComments.has(post._id) ? 'Hide Comments' : 'Comments'}</div>
                        <div className="flex items-center gap-2 hover:bg-[#272729] p-2 rounded-full cursor-pointer" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.origin + "/post/" + post._id).then(() => alert("Link Copied!")); }}><ShareIcon className="w-5 h-5" /> Share</div>
                      </div>

                      {expandedComments.has(post._id) && <CommentSection postId={post._id} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDEBAR (Reddit-Style) */}
            <div className="w-[312px] hidden lg:block space-y-4">
              {activeCommunity ? (
                <>
                  {/* About Community Card */}
                  <div className="bg-[#1A1A1B] border border-[#343536] rounded">
                    <div className="bg-[#0079D3] px-3 py-2 rounded-t flex justify-between items-center"><h3 className="text-sm font-bold text-white">About Community</h3> {isMod && <Cog6ToothIcon className="w-4 h-4 text-white cursor-pointer" onClick={openCommEdit} />}</div>
                    <div className="p-3">
                      <div className="text-sm text-gray-300 mb-4">{activeCommunity.description}</div>
                      <div className="text-xs text-gray-500 border-b border-[#343536] pb-3 mb-3">Created {new Date(activeCommunity.createdAt).toLocaleDateString()}</div>
                      <div className="flex gap-4 text-sm font-medium mb-4">
                        <div><div className="text-gray-100">{activeCommunity.members.length}</div><div className="text-gray-500 text-xs">Members</div></div>
                        <div><div className="text-gray-100">12</div><div className="text-gray-500 text-xs">Online</div></div>
                      </div>
                      <button className="btn btn-primary btn-sm w-full rounded-full" onClick={() => setIsPostModalOpen(true)}>Create Post</button>
                    </div>
                  </div>

                  {/* Rules Card */}
                  <div className="bg-[#1A1A1B] border border-[#343536] rounded p-3">
                    <div className="text-xs font-bold text-gray-500 mb-2 uppercase border-b border-[#343536] pb-2">r/{activeCommunity.name} Rules</div>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">{activeCommunity.rules || "1. Be respectful\n2. No spam"}</div>
                  </div>
                </>
              ) : (
                /* Home Sidebar */
                <div className="bg-[#1A1A1B] border border-[#343536] rounded p-3">
                  <h3 className="text-sm font-bold border-b border-[#343536] pb-2 mb-2">Home</h3>
                  <p className="text-xs text-gray-400 mb-4">Your personal STC frontpage. Come here to check in with your favorite communities.</p>
                  <button className="btn btn-primary btn-sm w-full rounded-full mb-2" onClick={() => setIsPostModalOpen(true)}>Create Post</button>
                  <button className="btn btn-outline btn-sm w-full rounded-full" onClick={() => setIsCommunityModalOpen(true)}>Create Community</button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* --- MODALS (Create/Edit Community with Banner Upload) --- */}
      {(isCommunityModalOpen || isEditCommModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg bg-[#1A1A1B] border border-[#343536] shadow-2xl">
            <div className="p-4 border-b border-[#343536] flex justify-between">
              <h3 className="text-lg font-bold">{isEditCommModalOpen ? 'Mod Tools' : 'Create a Community'}</h3>
              <button onClick={() => { setIsCommunityModalOpen(false); setIsEditCommModalOpen(false); }}><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              {isEditCommModalOpen ? (
                <>
                  <label className="text-xs font-bold">Description</label>
                  <textarea className="textarea textarea-bordered w-full bg-[#272729]" value={editCommDesc} onChange={e => setEditCommDesc(e.target.value)} />
                  <label className="text-xs font-bold">Rules</label>
                  <textarea className="textarea textarea-bordered h-24 w-full bg-[#272729]" value={editCommRules} onChange={e => setEditCommRules(e.target.value)} />
                  <div>
                    <label className="text-xs font-bold block mb-1">Update Icon</label>
                    <input type="file" className="file-input file-input-bordered file-input-sm w-full bg-[#272729]" onChange={e => setEditCommIcon(e.target.files?.[0] || null)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Update Banner</label>
                    <input type="file" className="file-input file-input-bordered file-input-sm w-full bg-[#272729]" onChange={e => setEditCommBanner(e.target.files?.[0] || null)} />
                  </div>
                  <div className="flex justify-end gap-2 mt-4"><button className="btn btn-primary" onClick={handleEditCommunity}>Save Changes</button></div>
                </>
              ) : (
                <>
                  <label className="text-xs font-bold">Name</label>
                  <div className="relative"><span className="absolute left-3 top-3 text-gray-500">c/</span><input className="input input-bordered w-full pl-8 bg-[#272729]" value={newCommName} onChange={e => setNewCommName(e.target.value)} /></div>
                  <label className="text-xs font-bold">Description</label>
                  <textarea className="textarea textarea-bordered w-full bg-[#272729]" value={newCommDesc} onChange={e => setNewCommDesc(e.target.value)} />
                  <div>
                    <label className="text-xs font-bold block mb-1">Icon (Optional)</label>
                    <input type="file" className="file-input file-input-bordered file-input-sm w-full bg-[#272729]" onChange={e => setNewCommIcon(e.target.files?.[0] || null)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Banner (Optional)</label>
                    <input type="file" className="file-input file-input-bordered file-input-sm w-full bg-[#272729]" onChange={e => setNewCommBanner(e.target.files?.[0] || null)} />
                  </div>
                  <div className="flex justify-end gap-2 mt-4"><button className="btn btn-primary" onClick={handleCreateCommunity}>Create Community</button></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Re-use existing Create/Edit Post Modals (omitted for strictly updating new UI parts, but assume they exist) */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-xl bg-[#1A1A1B] border border-[#343536] text-gray-200">
            <div className="p-4 border-b border-[#343536] flex justify-between"><h3 className="font-bold">Create Post</h3><button onClick={() => setIsPostModalOpen(false)}><XMarkIcon className="w-5 h-5" /></button></div>
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                {activeCommunity ? <span className="badge badge-lg">c/{activeCommunity.name}</span> :
                  <select className="select select-sm bg-[#272729]" onChange={e => { const c = communities.find(x => x._id === e.target.value); if (c) setActiveCommunity(c); }}>
                    <option disabled selected>Select Community</option>
                    {communities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                }
              </div>

              {/* Post Type Tabs */}
              <div className="tabs tabs-boxed bg-[#1A1A1B] border border-[#343536] mb-4 p-1">
                <a className={`tab ${postType === 'text' ? 'tab-active bg-[#272729] text-white' : ''}`} onClick={() => setPostType('text')}>Text</a>
                <a className={`tab ${postType === 'image' ? 'tab-active bg-[#272729] text-white' : ''}`} onClick={() => setPostType('image')}>Image</a>
                <a className={`tab ${postType === 'poll' ? 'tab-active bg-[#272729] text-white' : ''}`} onClick={() => setPostType('poll')}>Poll</a>
              </div>

              <input className="input input-bordered w-full mb-2 bg-[#272729]" placeholder="Title" value={postTitle} onChange={e => setPostTitle(e.target.value)} />

              {postType === 'text' && (
                <textarea className="textarea textarea-bordered w-full h-32 bg-[#272729]" placeholder="Content" value={postContent} onChange={e => setPostContent(e.target.value)}></textarea>
              )}

              {postType === 'image' && (
                <div className="border-2 border-dashed border-[#343536] rounded-xl p-8 text-center hover:bg-[#272729] cursor-pointer transition-colors relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setPostImage(e.target.files?.[0] || null)} accept="image/*" />
                  {postImage ? (
                    <div className="text-primary font-bold">{postImage.name}</div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <PhotoIcon className="w-8 h-8" />
                      <span>Click to upload image</span>
                    </div>
                  )}
                </div>
              )}

              {postType === 'poll' && (
                <div className="space-y-2">
                  {pollOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      className="input input-bordered w-full bg-[#272729]"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={e => {
                        const newOpts = [...pollOptions];
                        newOpts[idx] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                    />
                  ))}
                  <button className="btn btn-xs btn-ghost text-primary" onClick={() => setPollOptions([...pollOptions, ''])}>+ Add Option</button>
                </div>
              )}

              <div className="mt-4 flex justify-end"><button className="btn btn-primary" onClick={handleCreatePost}>Post</button></div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-xl bg-[#1A1A1B] border border-[#343536] text-gray-200">
            <div className="p-4 border-b border-[#343536] flex justify-between"><h3 className="font-bold">Edit Post</h3><button onClick={() => setIsEditModalOpen(false)}><XMarkIcon className="w-5 h-5" /></button></div>
            <div className="p-4">
              <input className="input input-bordered w-full mb-2 bg-[#272729]" placeholder="Title" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              <textarea className="textarea textarea-bordered w-full h-32 bg-[#272729]" placeholder="Content" value={editContent} onChange={e => setEditContent(e.target.value)}></textarea>
              <div className="mt-4 flex justify-end"><button className="btn btn-primary" onClick={handleUpdatePost}>Save Changes</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
