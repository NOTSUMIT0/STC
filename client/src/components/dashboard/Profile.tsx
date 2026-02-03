import { useState } from 'react';

const Profile = () => {
  const [hobbies, setHobbies] = useState<string[]>(['Coding', 'Reading']);
  const [inputHobby, setInputHobby] = useState('');

  const addHobby = (e: any) => {
    if (e.key === 'Enter' && inputHobby) {
      setHobbies([...hobbies, inputHobby]);
      setInputHobby('');
    }
  };

  return (
    <div className="animate-fade-in-up max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="md:col-span-1">
          <div className="card bg-base-100 border border-white/5 p-6 text-center sticky top-6">
            <div className="avatar px-10">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
              </div>
            </div>
            <h2 className="text-xl font-bold mt-4">Alex Student</h2>
            <p className="text-sm opacity-60">Computer Science Major</p>
            <button className="btn btn-sm btn-outline mt-6 w-full">Change Avatar</button>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:col-span-2">
          <div className="card bg-base-100 border border-white/5 p-6">
            <h3 className="font-bold text-lg mb-6 border-b border-white/5 pb-2">Edit Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">First Name</label>
                <input type="text" value="Alex" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">Last Name</label>
                <input type="text" value="Student" className="input input-bordered" />
              </div>
              <div className="form-control col-span-2">
                <label className="label">Bio</label>
                <textarea className="textarea textarea-bordered h-24" placeholder="Tell us about yourself..."></textarea>
              </div>
              <div className="form-control">
                <label className="label">Field of Study</label>
                <input type="text" className="input input-bordered" placeholder="e.g. Computer Science" />
              </div>
              <div className="form-control">
                <label className="label">University / College</label>
                <input type="text" className="input input-bordered" placeholder="e.g. MIT" />
              </div>

              <div className="form-control col-span-2">
                <label className="label">Hobbies & Interests <span className="text-xs opacity-50">(Press Enter to add)</span></label>
                <input
                  type="text"
                  className="input input-bordered mb-2"
                  placeholder="Type a hobby and press Enter..."
                  value={inputHobby}
                  onChange={(e) => setInputHobby(e.target.value)}
                  onKeyDown={addHobby}
                />
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((hobby, i) => (
                    <div key={i} className="badge badge-secondary gap-2">
                      {hobby}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current cursor-pointer" onClick={() => setHobbies(hobbies.filter((_, idx) => idx !== i))}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-actions justify-end mt-8">
              <button className="btn btn-primary">Save Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
