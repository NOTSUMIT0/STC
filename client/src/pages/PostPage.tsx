import { useParams, useNavigate } from 'react-router-dom';
import { useFetchPost } from '../hooks/queries/useCommunity';
import { useLikePost } from '../hooks/mutations/useCommunity';
import { useFetchComments } from '../hooks/queries/useComments';
import { usePostComment, useLikeComment } from '../hooks/mutations/useComments';
import { useState, useMemo } from 'react';
import { BookOpenIcon, ChatBubbleLeftIcon, ShareIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Duplicate helper (should be in utils)
const getAvatarUrl = (user: any) => {
  if (user?.avatarType === 'upload' && user?.avatarValue) {
    if (user.avatarValue.startsWith('data:')) return user.avatarValue;
    const path = user.avatarValue.startsWith('/') ? user.avatarValue : `/${user.avatarValue}`;
    return `${API_URL}${path}`;
  }
  const seed = user?.avatarValue || user?.username || 'Felix';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

// Types (Duplicate - should be shared)
interface CommentType {
  _id: string;
  content: string;
  author: any;
  parentComment?: string | null;
  likes: string[];
  dislikes: string[];
  createdAt: string;
  replies?: CommentType[];
}

const CommentNode = ({
  comment,
  user,
  onVote,
  onReply,
  replyMap,
  setReplyMap,
  replyingToId,
  setReplyingToId
}: any) => {
  const isLiked = comment.likes?.includes(user._id);
  const isDisliked = comment.dislikes?.includes(user._id);
  const score = (comment.likes?.length || 0) - (comment.dislikes?.length || 0);

  return (
    <div className="pl-4 border-l-2 border-[#343536] mt-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-700">
          <img src={getAvatarUrl(comment.author)} className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-xs text-gray-300">{comment.author.username}</span>
        <span className="text-[10px] text-gray-500">• {new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-gray-200 mb-2">{comment.content}</p>
      <div className="flex gap-4 text-xs font-bold text-gray-500 items-center">
        <div className="flex bg-[#272729] rounded-full overflow-hidden items-center">
          <button className={`p-1 hover:bg-[#343536] ${isLiked ? 'text-orange-500' : 'hover:text-orange-500'}`} onClick={() => onVote(comment._id, 'upvote')}><BookOpenIcon className="w-4 h-4" /></button>
          <span className="px-1 text-gray-200">{score}</span>
          <button className={`p-1 hover:bg-[#343536] ${isDisliked ? 'text-blue-500' : 'hover:text-blue-500'}`} onClick={() => onVote(comment._id, 'downvote')}><BookOpenIcon className="w-4 h-4 rotate-180" /></button>
        </div>
        <button className="hover:text-white" onClick={() => setReplyingToId(replyingToId === comment._id ? null : comment._id)}>Reply</button>
      </div>
      {replyingToId === comment._id && (
        <div className="mt-2 flex gap-2">
          <input className="input input-xs w-full bg-[#272729]" placeholder="Reply..." value={replyMap[comment._id] || ''} onChange={e => setReplyMap({ ...replyMap, [comment._id]: e.target.value })} />
          <button className="btn btn-xs btn-primary" onClick={() => onReply(comment._id, replyMap[comment._id])}>Reply</button>
        </div>
      )}
      {comment.replies?.map((r: any) => (
        <CommentNode
          key={r._id}
          comment={r}
          user={user}
          onVote={onVote}
          onReply={onReply}
          replyMap={replyMap}
          setReplyMap={setReplyMap}
          replyingToId={replyingToId}
          setReplyingToId={setReplyingToId}
        />
      ))}
    </div>
  );
};

const CommentSection = ({ postId, user }: { postId: string, user: any }) => {
  const { data: rawComments = [] } = useFetchComments(postId);
  const [mainReply, setMainReply] = useState('');
  const [replyMap, setReplyMap] = useState<{ [key: string]: string }>({});
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const { mutate: postCommentMutation } = usePostComment();
  const { mutate: likeCommentMutation } = useLikeComment();

  const comments = useMemo(() => {
    if (!rawComments) return [];
    const map = new Map();
    const roots: CommentType[] = [];
    const flat = JSON.parse(JSON.stringify(rawComments));

    flat.forEach((c: any) => { c.replies = []; map.set(c._id, c); });
    flat.forEach((c: any) => { if (c.parentComment) map.get(c.parentComment)?.replies?.push(c); else roots.push(c); });
    return roots;
  }, [rawComments]);

  const postComment = (parentId: string | null = null, content: string) => {
    if (!content.trim()) return;
    postCommentMutation({ postId, content, parentCommentId: parentId }, {
      onSuccess: () => {
        if (parentId) { setReplyMap({ ...replyMap, [parentId]: '' }); setReplyingToId(null); } else setMainReply('');
      }
    });
  };

  const handleVote = (commentId: string, action: 'upvote' | 'downvote') => {
    likeCommentMutation({ commentId, userId: user._id, action });
  };

  return (
    <div className="p-4 bg-[#161617] rounded-b border border-[#343536] mt-4">
      <div className="flex gap-2 mb-6">
        <input className="input input-sm w-full bg-[#272729]" placeholder="What are your thoughts?" value={mainReply} onChange={e => setMainReply(e.target.value)} />
        <button className="btn btn-sm btn-primary" onClick={() => postComment(null, mainReply)}>Comment</button>
      </div>
      {comments.map(c => (
        <CommentNode
          key={c._id}
          comment={c}
          user={user}
          onVote={handleVote}
          onReply={postComment}
          replyMap={replyMap}
          setReplyMap={setReplyMap}
          replyingToId={replyingToId}
          setReplyingToId={setReplyingToId}
        />
      ))}
    </div>
  );
};

const PostPage = ({ user }: { user: any }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useFetchPost(id || null);
  const likePostMutation = useLikePost();

  if (isLoading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (error || !post) return <div className="text-center p-20 text-error">Post not found or failed to load.</div>;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    likePostMutation.mutate({ id: post._id, userId: user._id, action: 'upvote' });
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    likePostMutation.mutate({ id: post._id, userId: user._id, action: 'downvote' });
  };

  const isLiked = post.likes?.some((lid: any) => (typeof lid === 'string' ? lid : lid.toString()) === user._id);
  const isDisliked = post.dislikes?.some((lid: any) => (typeof lid === 'string' ? lid : lid.toString()) === user._id);
  const score = (post.likes?.length || 0) - (post.dislikes?.length || 0);

  return (
    <div className="min-h-screen bg-base-300 text-gray-200 pb-20">
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <button onClick={() => navigate('/dashboard')} className="btn btn-ghost btn-sm mb-4 gap-2 pl-0 hover:bg-transparent hover:text-white">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-[#1A1A1B] border border-[#343536] rounded">
          <div className="flex">
            {/* Vote Column */}
            <div className="w-12 bg-[#161617] flex flex-col items-center py-2 gap-1 border-r border-[#343536]">
              <button onClick={handleUpvote} className={`p-1 hover:bg-[#343536] rounded ${isLiked ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}><BookOpenIcon className="w-6 h-6" /></button>
              <span className="text-sm font-bold text-white">{score}</span>
              <button onClick={handleDownvote} className={`p-1 hover:bg-[#343536] rounded ${isDisliked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}><BookOpenIcon className="w-6 h-6 rotate-180" /></button>
            </div>

            <div className="p-3 flex-1 bg-[#1A1A1B]">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  {post.community && <span className="font-bold text-gray-300">c/{post.community.name}</span>}
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500">Posted by u/{post.author.username}</span>
                  <span className="text-gray-600">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h1 className="text-xl font-medium text-gray-100 mb-4">{post.title}</h1>
              {post.type === 'text' && <div className="text-sm text-gray-300 mb-6 whitespace-pre-wrap">{post.content}</div>}
              {post.type === 'image' && post.image && (
                <div className="bg-black border border-[#343536] rounded overflow-hidden mb-6 max-h-[600px] flex justify-center">
                  <img
                    src={post.image.startsWith('data:') ? post.image : (post.image.startsWith('http') ? post.image : `${API_URL}${post.image.startsWith('/') ? '' : '/'}${post.image}`)}
                    className="object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              )}

              <div className="flex gap-2 text-gray-500 text-xs font-bold items-center border-t border-[#343536] pt-2">
                <div className="flex items-center gap-2 hover:bg-[#272729] p-2 rounded-full cursor-pointer"><ChatBubbleLeftIcon className="w-5 h-5" /> {(post.likes?.length || 0) + (Math.floor(Math.random() * 5))} Comments</div>
                <div className="flex items-center gap-2 hover:bg-[#272729] p-2 rounded-full cursor-pointer" onClick={() => { navigator.clipboard.writeText(window.location.href).then(() => alert("Link Copied!")); }}><ShareIcon className="w-5 h-5" /> Share</div>
              </div>
            </div>
          </div>
        </div>

        <CommentSection postId={post._id} user={user} />
      </div>
    </div>
  );
};

export default PostPage;
