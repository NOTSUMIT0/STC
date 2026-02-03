const Settings = () => {
  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h2 className="text-3xl font-bold mb-8">Settings</h2>

      <div className="space-y-6">
        <div className="card bg-base-100 border border-white/5 p-6">
          <h3 className="font-bold text-lg mb-4">Profile Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Username</label>
              <input type="text" value="Alex Student" className="input input-bordered" readOnly />
            </div>
            <div className="form-control">
              <label className="label">Email</label>
              <input type="text" value="alex@example.com" className="input input-bordered" readOnly />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-white/5 p-6">
          <h3 className="font-bold text-lg mb-4">Preferences</h3>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Email Notifications</span>
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Public Profile</span>
              <input type="checkbox" className="toggle toggle-secondary" defaultChecked />
            </label>
          </div>
        </div>

        <button className="btn btn-error btn-outline">Log Out</button>
      </div>
    </div>
  );
};

export default Settings;
