const Community = () => {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Student Community</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="col-span-2 space-y-4">
          <div className="card bg-base-100 shadow-lg border border-white/5">
            <div className="card-body">
              <div className="flex gap-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                    <span>ME</span>
                  </div>
                </div>
                <textarea className="textarea textarea-bordered w-full" placeholder="Ask a question or share your progress..."></textarea>
              </div>
              <div className="card-actions justify-end mt-2">
                <button className="btn btn-primary btn-sm">Post</button>
              </div>
            </div>
          </div>

          {[1, 2, 3].map((post) => (
            <div key={post} className="card bg-base-100 shadow-lg border border-white/5">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="avatar"><div className="w-8 rounded-full bg-primary"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post}`} /></div></div>
                  <div>
                    <div className="font-bold text-sm">User {post}</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <p className="text-sm">Does anyone have good resources for Graph Dynamic Programming? I'm stuck on LeetCode #1234.</p>
                <div className="flex gap-4 mt-4 text-gray-400 text-sm">
                  <span className="cursor-pointer hover:text-white">❤️ 5 Likes</span>
                  <span className="cursor-pointer hover:text-white">💬 2 Comments</span>
                </div>
              </div>
            </div>
          ))}
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
