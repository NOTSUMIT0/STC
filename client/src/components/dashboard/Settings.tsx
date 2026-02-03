import { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('preferences');

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h2 className="text-3xl font-bold mb-8">Settings</h2>

      {/* Settings Tabs */}
      <div className="tabs tabs-boxed bg-base-200 mb-8 inline-block">
        <a className={`tab ${activeTab === 'preferences' ? 'tab-active' : ''}`} onClick={() => setActiveTab('preferences')}>Preferences</a>
        <a className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`} onClick={() => setActiveTab('security')}>Security</a>
      </div>

      {activeTab === 'preferences' && (
        <div className="card bg-base-100 border border-white/5 p-6">
          <h3 className="font-bold text-lg mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                <span className="label-text">Email me about new roadmaps</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                <span className="label-text">Email me when someone replies to my post</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card bg-base-100 border border-white/5 p-6">
          <h3 className="font-bold text-lg mb-4">Password & Security</h3>
          <div className="form-control max-w-xs mb-4">
            <label className="label">Current Password</label>
            <input type="password" placeholder="********" className="input input-bordered" />
          </div>
          <div className="form-control max-w-xs mb-4">
            <label className="label">New Password</label>
            <input type="password" placeholder="********" className="input input-bordered" />
          </div>
          <button className="btn btn-error btn-outline max-w-xs mt-4">Update Password</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
