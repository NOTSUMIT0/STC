import { useState } from 'react';
import { KeyIcon, BellIcon, ShieldCheckIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'security' | 'preferences'>('preferences');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Settings</h2>
        <p className="text-gray-400 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 flex flex-col gap-2">
          <button
            onClick={() => { setActiveTab('preferences'); setMessage(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'preferences' ? 'bg-primary/20 text-primary border border-primary/20' : 'hover:bg-white/5 text-gray-400'
              }`}
          >
            <BellIcon className="w-5 h-5" /> Preferences
          </button>
          <button
            onClick={() => { setActiveTab('security'); setMessage(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'security' ? 'bg-primary/20 text-primary border border-primary/20' : 'hover:bg-white/5 text-gray-400'
              }`}
          >
            <ShieldCheckIcon className="w-5 h-5" /> Security
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {message && (
            <div role="alert" className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6 shadow-lg`}>
              {message.type === 'success' ? <CheckCircleIcon className="w-6 h-6" /> : <ExclamationCircleIcon className="w-6 h-6" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card bg-[#1e2124] border border-white/5 shadow-xl animate-scale-in">
              <div className="card-body p-8">
                <h3 className="card-title text-2xl mb-2 text-white">Password & Security</h3>
                <p className="text-sm text-gray-500 mb-8">Manage your password and security questions.</p>

                <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-lg">
                  <div className="form-control w-full">
                    <label className="label uppercase text-xs font-bold text-gray-500 mb-1">Current Password</label>
                    <div className="relative">
                      <KeyIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input input-bordered w-full pl-10 bg-[#16181b] border-white/5 focus:border-primary/50 text-white transition-all h-12"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="divider opacity-10 my-4"></div>

                  <div className="form-control w-full">
                    <label className="label uppercase text-xs font-bold text-gray-500 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input input-bordered w-full pl-4 bg-[#16181b] border-white/5 focus:border-primary/50 text-white transition-all h-12"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="form-control w-full">
                    <label className="label uppercase text-xs font-bold text-gray-500 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input input-bordered w-full pl-4 bg-[#16181b] border-white/5 focus:border-primary/50 text-white transition-all h-12"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="card-actions justify-start mt-8">
                    <button type="submit" className="btn btn-error btn-outline px-8" disabled={loading}>
                      {loading ? <span className="loading loading-spinner"></span> : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="card bg-[#1e2124] border border-white/5 shadow-xl animate-scale-in">
              <div className="card-body p-8">
                <h3 className="card-title text-2xl mb-8 text-white">Notification Preferences</h3>

                <div className="space-y-8 max-w-2xl">
                  <div className="form-control w-full">
                    <label className="label cursor-pointer justify-between items-center group hover:bg-white/5 p-4 rounded-xl transition-colors border border-transparent hover:border-white/5 w-full">
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="label-text font-bold text-lg text-gray-200">Email Notifications</span>
                        <span className="label-text-alt text-gray-500">Receive emails about new features and roadmaps</span>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary toggle-lg" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control w-full">
                    <label className="label cursor-pointer justify-between items-center group hover:bg-white/5 p-4 rounded-xl transition-colors border border-transparent hover:border-white/5 w-full">
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="label-text font-bold text-lg text-gray-200">Community Replies</span>
                        <span className="label-text-alt text-gray-500">Get notified when someone replies to your post</span>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary toggle-lg" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control w-full">
                    <label className="label cursor-pointer justify-between items-center group hover:bg-white/5 p-4 rounded-xl transition-colors border border-transparent hover:border-white/5 w-full">
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="label-text font-bold text-lg text-gray-200">Mentions</span>
                        <span className="label-text-alt text-gray-500">Get notified when you are mentioned @user</span>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary toggle-lg" defaultChecked />
                    </label>
                  </div>
                </div>

                <div className="divider opacity-10 my-8"></div>

                <h3 className="font-bold text-2xl text-white mb-6">Theme Settings</h3>
                <div className="grid grid-cols-2 gap-6 max-w-xl">
                  <button
                    onClick={() => {
                      localStorage.setItem('theme', 'sunset');
                      document.documentElement.setAttribute('data-theme', 'sunset');
                      window.location.reload();
                    }}
                    className="btn btn-neutral btn-block border-primary text-primary h-14 text-lg hover:bg-neutral/80"
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('theme', 'lemonade');
                      document.documentElement.setAttribute('data-theme', 'lemonade');
                      window.location.reload();
                    }}
                    className="btn btn-primary btn-block h-14 text-lg text-white"
                  >
                    Light
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
