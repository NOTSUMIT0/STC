import { useState } from 'react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="drawer lg:drawer-open bg-base-300 text-base-content min-h-screen font-sans">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-start">
        {/* Navbar for Mobile */}
        <div className="w-full navbar bg-base-100 lg:hidden shadow-md">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-xl font-bold text-primary">StudentPlatform</div>
        </div>

        {/* Main Content Area */}
        <div className="w-full p-6 lg:p-10 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, Student</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-square btn-ghost btn-sm bg-base-200"><span className="text-lg">🔔</span></button>
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                  <span className="text-xs">UI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Mimicking the Screenshot Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Left Col - Filters/Preview */}
            <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
              <div className="card bg-base-200 border-l-4 border-primary shadow-lg hover:shadow-primary/20 transition-all">
                <div className="card-body p-5">
                  <h3 className="uppercase text-xs font-bold text-gray-500 mb-2">My Progress</h3>
                  <div className="radial-progress text-primary font-bold text-xl" style={{ "--value": 70 } as any}>70%</div>
                  <p className="text-xs mt-2 text-gray-400">DSA Course Completed</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-4">
                  <h3 className="font-bold text-sm mb-3">Today's Tasks</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 p-2 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-primary" />
                      <span className="text-xs">Solve 2 LeetCode problems</span>
                    </li>
                    <li className="flex items-center gap-2 p-2 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-secondary" />
                      <span className="text-xs">Read System Design Ch.4</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Middle Col - Charts/Main */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
              <div className="card bg-base-100 shadow-xl h-64">
                <div className="card-body relative overflow-hidden">
                  <h3 className="card-title text-sm opacity-70">Study Activity</h3>
                  <div className="flex items-end justify-between h-full w-full gap-2 mt-4 px-2">
                    {[40, 70, 30, 85, 50, 65, 90, 45, 60, 75, 55, 80].map((h, i) => (
                      <div key={i} className={`w-full bg-gradient-to-t ${i % 2 === 0 ? 'from-primary to-primary/50' : 'from-secondary to-secondary/50'} rounded-t-sm transition-all hover:opacity-80`} style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card bg-green-900/20 border border-green-500/30">
                  <div className="card-body p-4">
                    <div className="badge badge-success gap-2">Verified</div>
                    <p className="mt-2 text-sm">Email verification completed.</p>
                  </div>
                </div>
                <div className="card bg-blue-900/20 border border-blue-500/30">
                  <div className="card-body p-4">
                    <div className="badge badge-info gap-2">New</div>
                    <p className="mt-2 text-sm">9 New Resources Added.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col - Profile/Extra */}
            <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
              <div className="card bg-gradient-to-br from-neutral to-base-100 shadow-xl text-center p-6">
                <div className="avatar mx-auto mb-4">
                  <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                  </div>
                </div>
                <h3 className="font-bold text-lg">Alex Student</h3>
                <p className="text-xs text-primary">Pro Member</p>
              </div>

              <div className="card bg-base-100 shadow-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-sm">Roadmaps</span>
                  <button className="btn btn-xs btn-ghost">View All</button>
                </div>
                <div className="space-y-3">
                  {['Frontend', 'Backend', 'DevOps'].map((r) => (
                    <div key={r} className="flex justify-between items-center text-xs p-2 hover:bg-base-200 rounded transition-colors cursor-pointer">
                      <span>{r}</span>
                      <span className="badge badge-xs badge-primary">Create</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Table */}
          <div className="card bg-base-100 shadow-xl overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Difficulty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { topic: 'Binary Trees', status: 'In Progress', diff: 'Medium', color: 'badge-warning' },
                  { topic: 'Graph Traversal', status: 'Completed', diff: 'Hard', color: 'badge-success' },
                  { topic: 'Dynamic Programming', status: 'Pending', diff: 'Hard', color: 'badge-error' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-base-200">
                    <td className="font-bold">{row.topic}</td>
                    <td><div className={`badge ${row.color} badge-sm`}>{row.status}</div></td>
                    <td>{row.diff}</td>
                    <td><button className="btn btn-xs btn-ghost">Start</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content flex flex-col justify-between">
          <div>
            <div className="mb-8 px-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">StudyOS</span>
            </div>
            <li className="mb-1"><a className={`${activeTab === 'Overview' ? 'active bg-gradient-to-r from-primary to-primary/50 text-white' : ''}`} onClick={() => setActiveTab('Overview')}>Dashboard</a></li>
            <li className="mb-1"><a className={`${activeTab === 'Roadmaps' ? 'active bg-gradient-to-r from-primary to-primary/50 text-white' : ''}`} onClick={() => setActiveTab('Roadmaps')}>Roadmaps</a></li>
            <li className="mb-1"><a className={`${activeTab === 'Resources' ? 'active bg-gradient-to-r from-primary to-primary/50 text-white' : ''}`} onClick={() => setActiveTab('Resources')}>Resources</a></li>
            <li className="mb-1"><a className={`${activeTab === 'Community' ? 'active bg-gradient-to-r from-primary to-primary/50 text-white' : ''}`} onClick={() => setActiveTab('Community')}>Community</a></li>
            <li className="mb-1"><a className={`${activeTab === 'Settings' ? 'active bg-gradient-to-r from-primary to-primary/50 text-white' : ''}`} onClick={() => setActiveTab('Settings')}>Settings</a></li>
          </div>
          <div className="p-4 bg-base-100 rounded-xl bg-opacity-50">
            <p className="text-xs opacity-70 mb-2">Need Help?</p>
            <button className="btn btn-sm btn-outline w-full">Contact Support</button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
