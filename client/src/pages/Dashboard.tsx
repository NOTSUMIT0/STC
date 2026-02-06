import { useState, useEffect } from 'react';
import Roadmaps from '../components/dashboard/Roadmaps';
import Resources from '../components/dashboard/Resources';
import Community from '../components/dashboard/Community';
import Settings from '../components/dashboard/Settings';
import Profile from '../components/dashboard/Profile';
import SupportModal from '../components/dashboard/SupportModal';
import TodoList from '../components/dashboard/TodoList';
import {
  HomeIcon,
  MapIcon,
  BookOpenIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userSeed = 'Felix';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Overview', icon: HomeIcon },
    { name: 'Roadmaps', icon: MapIcon },
    { name: 'Resources', icon: BookOpenIcon },
    { name: 'Community', icon: UserGroupIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Roadmaps': return <Roadmaps />;
      case 'Resources': return <Resources />;
      case 'Community': return <Community />;
      case 'Settings': return <Settings />;
      case 'Profile': return <Profile />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate-fade-in-up">
            {/* Left Col - Filters/Preview */}
            <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
              <div className="card bg-base-200 border-l-4 border-primary shadow-lg hover:shadow-primary/20 transition-all">
                <div className="card-body p-5">
                  <h3 className="uppercase text-xs font-bold text-gray-500 mb-2">My Progress</h3>
                  <div className="radial-progress text-primary font-bold text-xl" style={{ "--value": 70, "--size": "4rem" } as any}>70%</div>
                  <p className="text-xs mt-2 text-gray-400">DSA Course Completed</p>
                </div>
              </div>
              <div className="h-[400px]">
                <TodoList />
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
                <div className="mt-4">
                  <button onClick={() => setIsSupportModalOpen(true)} className="btn btn-sm btn-outline btn-primary w-full">Contact Support</button>
                </div>
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
            {/* Bottom Table */}
            <div className="col-span-4 card bg-base-100 shadow-xl overflow-x-auto">
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
        );
    }
  };

  return (
    <div className="min-h-screen bg-base-300 text-base-content font-sans">
      {/* Top Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-base-100/80 backdrop-blur-md shadow-lg' : 'bg-base-100'}`}>
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">STC</span>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Student Platform</span>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center bg-base-200/50 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === item.name
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-white relative">
              <BellIcon className="w-6 h-6" />
              <span className="badge badge-error badge-xs absolute top-1 right-1"></span>
            </button>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="avatar cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`} alt="Profile" />
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-200 rounded-box w-52 border border-white/5 mt-4">
                <li><a onClick={() => setActiveTab('Profile')} className="hover:bg-primary/20 hover:text-primary">👤 Profile</a></li>
                <li><a onClick={() => setActiveTab('Settings')} className="hover:bg-primary/20 hover:text-primary">⚙️ Settings</a></li>
                <div className="divider my-0 mb-1"></div>
                <li><a className="text-error hover:bg-error/20">Log Out</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Padding for Navbar */}
      <div className="pt-24 px-4 md:px-8 pb-10 max-w-[1800px] mx-auto">

        {/* Page Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-white mb-2">{activeTab === 'Overview' ? 'Dashboard' : activeTab}</h1>
          <p className="text-gray-400">
            {activeTab === 'Overview' && 'Welcome back, ready to learn something new?'}
            {activeTab === 'Roadmaps' && 'Structured paths to master new skills.'}
            {activeTab === 'Resources' && 'Curated library of learning materials.'}
            {activeTab === 'Community' && 'Connect, discuss, and grow with peers.'}
            {activeTab === 'Settings' && 'Manage your account and preferences.'}
            {activeTab === 'Profile' && 'View and edit your public profile.'}
          </p>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>

      <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
