import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Community = () => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'polls'>('discussions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postType, setPostType] = useState<'text' | 'poll'>('text');

  return (
    <div className="animate-fade-in-up relative">
      <div className="flex justify-between items-center mb-6">
        <div className="tabs tabs-boxed bg-base-200">
          <a className={`tab ${activeTab === 'discussions' ? 'tab-active' : ''}`} onClick={() => setActiveTab('discussions')}>Discussions</a>
          <a className={`tab ${activeTab === 'polls' ? 'tab-active' : ''}`} onClick={() => setActiveTab('polls')}>Student Polls</a>
        </div>
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={() => { setPostType(activeTab === 'polls' ? 'poll' : 'text'); setIsModalOpen(true); }}
        >
          <span>+</span> Create {activeTab === 'polls' ? 'Poll' : 'Post'}
        </button>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-lg bg-base-100 shadow-2xl border border-white/10 animate-pop-in">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Create New {postType === 'poll' ? 'Poll' : 'Discussion'}</h3>
                <button onClick={() => setIsModalOpen(false)}><XMarkIcon className="w-6 h-6" /></button>
              </div>

              <div className="form-control mb-4">
                <label className="label">Title</label>
                <input type="text" placeholder="What's on your mind?" className="input input-bordered w-full" />
              </div>

              {postType === 'text' ? (
                <div className="form-control mb-4">
                  <label className="label">Content</label>
                  <textarea className="textarea textarea-bordered h-32" placeholder="Share your thoughts or ask a question..."></textarea>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  <label className="label">Poll Options</label>
                  <input type="text" placeholder="Option 1" className="input input-bordered w-full input-sm" />
                  <input type="text" placeholder="Option 2" className="input input-bordered w-full input-sm" />
                  <button className="btn btn-ghost btn-xs">+ Add Option</button>
                </div>
              )}

              <div className="card-actions justify-end">
                <button className="btn btn-primary w-full" onClick={() => setIsModalOpen(false)}>Post to Community</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="col-span-2 space-y-4">

          <div className="card-body">
            <div className="flex gap-4">
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                  <span>ME</span>
                </div>
              </div>
              <textarea className="textarea textarea-bordered w-full focus:border-primary" placeholder={`Ask for help, share resources, or ${activeTab === 'polls' ? 'create a poll' : 'start a discussion'}...`}></textarea>
            </div>
            <div className="card-actions justify-end mt-2">
              <button className="btn btn-ghost btn-sm">📎 Attach</button>
              <button className="btn btn-primary btn-sm rounded-full px-6">Post</button>
            </div>
          </div>

          {activeTab === 'discussions' ? (
            /* Discussion Posts */
            [1, 2, 3].map((post) => (
              <div key={post} className="card bg-base-100 shadow-lg border border-white/5 hover:border-primary/20 transition-colors">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="avatar"><div className="w-8 rounded-full bg-secondary"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post + 5}`} /></div></div>
                    <div>
                      <div className="font-bold text-sm">DevStudent_{post}</div>
                      <div className="text-xs text-gray-500">Full Stack • 2 hours ago</div>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-1">Help with React UseEffect?? 😭</h4>
                  <p className="text-sm text-base-content/80">I keep getting an infinite loop when fetching data. Here is my code snippet...</p>
                  <div className="flex gap-4 mt-4 text-gray-400 text-sm border-t border-white/5 pt-3">
                    <span className="cursor-pointer hover:text-primary flex items-center gap-1">❤️ 24 Likes</span>
                    <span className="cursor-pointer hover:text-primary flex items-center gap-1">💬 5 Comments</span>
                    <span className="cursor-pointer hover:text-primary flex items-center gap-1 ml-auto">↗️ Share</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Polls */
            [1, 2].map((poll) => (
              <div key={poll} className="card bg-base-100 shadow-lg border border-white/5">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="avatar"><div className="w-8 rounded-full bg-accent"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Poll${poll}`} /></div></div>
                    <div className="text-sm font-bold">Community Poll</div>
                  </div>
                  <h3 className="font-bold text-lg mb-4">Which framework should I learn in 2026?</h3>
                  <div className="space-y-2">
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-4 border border-white/10 rounded-lg p-3 hover:bg-base-200">
                        <input type="radio" name={`poll-${poll}`} className="radio radio-primary" />
                        <span className="label-text">React / Next.js</span>
                        <span className="ml-auto text-xs opacity-50">45%</span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-4 border border-white/10 rounded-lg p-3 hover:bg-base-200">
                        <input type="radio" name={`poll-${poll}`} className="radio radio-secondary" />
                        <span className="label-text">Vue / Nuxt</span>
                        <span className="ml-auto text-xs opacity-50">20%</span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-4 border border-white/10 rounded-lg p-3 hover:bg-base-200">
                        <input type="radio" name={`poll-${poll}`} className="radio radio-accent" />
                        <span className="label-text">SvelteKit</span>
                        <span className="ml-auto text-xs opacity-50">35%</span>
                      </label>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">1,240 votes • 2 days left</div>
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
