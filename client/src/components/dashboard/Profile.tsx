import { useState, useEffect } from 'react';
import { useUpdateProfile } from '../../hooks/mutations/useAuth';

// Expanded Avatar Seeds
const AVATAR_SEEDS = [
  'Felix', 'Aneka', 'Zoe', 'Marc', 'Trouble', 'Willow', 'Bear', 'Bandit',
  'Mittens', 'Shadow', 'Tiger', 'Luna', 'Bella', 'Charlie', 'Max', 'Lucy',
  'Leo', 'Molly', 'Simba', 'Loki', 'Pepper', 'Jack', 'Oreo', 'Daisy'
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = ({ user }: { user: any }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    fieldOfStudy: '',
    university: '',
  });
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [inputHobby, setInputHobby] = useState('');

  // Avatar State
  const [avatarSeed, setAvatarSeed] = useState('Felix');

  const updateProfileMutation = useUpdateProfile();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        fieldOfStudy: user.fieldOfStudy || '',
        university: user.university || '',
      });
      setHobbies(user.hobbies || []);

      if (user.avatarType === 'seed' && user.avatarValue) {
        setAvatarSeed(user.avatarValue);
      } else if (user.username) {
        setAvatarSeed(user.username);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addHobby = (e: any) => {
    if (e.key === 'Enter' && inputHobby.trim()) {
      e.preventDefault();
      if (!hobbies.includes(inputHobby.trim())) {
        setHobbies([...hobbies, inputHobby.trim()]);
      }
      setInputHobby('');
    }
  };

  const removeHobby = (index: number) => {
    setHobbies(hobbies.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('bio', formData.bio);
    data.append('fieldOfStudy', formData.fieldOfStudy);
    data.append('university', formData.university);
    data.append('hobbies', JSON.stringify(hobbies));
    data.append('avatarType', 'seed');
    data.append('avatarValue', avatarSeed);

    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      },
      onError: () => {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    });
  };

  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Public Profile</h2>
          <p className="text-gray-400 mt-1">Customize how your profile looks to the community.</p>
        </div>

        {message && (
          <div className={`badge ${message.type === 'success' ? 'badge-success' : 'badge-error'} gap-2 px-4 py-3 h-auto`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar Preview & Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-[#1A1A1B] border border-white/5 shadow-xl">
            <div className="card-body items-center text-center">
              <span className="badge badge-primary font-bold mb-4">Preview</span>
              <div className="avatar mb-4">
                <div className="w-40 rounded-full ring-4 ring-primary ring-offset-4 ring-offset-[#1A1A1B] bg-[#2b2d31]">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} alt="avatar" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : (user?.username || 'User')}
              </h2>
              <p className="text-primary font-medium">{formData.fieldOfStudy || 'Student'}</p>
              <div className="divider my-2"></div>
              <p className="text-sm text-gray-400 italic line-clamp-3">"{formData.bio || 'Your bio will appear here...'}"</p>
            </div>
          </div>

          <div className="card bg-[#1A1A1B] border border-white/5 shadow-xl">
            <div className="card-body">
              <h3 className="font-bold text-gray-200 mb-4 uppercase text-xs tracking-wider">Choose Avatar</h3>
              <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => setAvatarSeed(seed)}
                    className={`avatar rounded-full p-1 border-2 transition-all hover:scale-110 ${avatarSeed === seed ? 'border-primary bg-primary/20' : 'border-transparent hover:border-white/20'}`}
                  >
                    <div className="w-full rounded-full bg-[#2b2d31]">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt={seed} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="card bg-[#1A1A1B] border border-white/5 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <h3 className="font-bold text-xl text-white">Edit Details</h3>
                <button
                  onClick={handleSubmit}
                  className={`btn btn-primary px-8 ${updateProfileMutation.isPending ? 'loading' : ''}`}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">

                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control hover:opacity-100 transition-opacity">
                    <label className="label text-xs font-bold uppercase text-gray-500 mb-1">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input input-bordered focus:input-primary bg-[#0f0f10] text-white" placeholder="e.g. Alex" />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase text-gray-500 mb-1">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input input-bordered focus:input-primary bg-[#0f0f10] text-white" placeholder="e.g. Student" />
                  </div>
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label text-xs font-bold uppercase text-gray-500 mb-1">Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="textarea textarea-bordered h-32 focus:textarea-primary bg-[#0f0f10] text-white leading-relaxed resize-none" placeholder="Tell the community about yourself..."></textarea>
                </div>

                {/* Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase text-gray-500 mb-1">Field of Study</label>
                    <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} className="input input-bordered focus:input-primary bg-[#0f0f10] text-white" placeholder="e.g. Computer Science" />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase text-gray-500 mb-1">University / College</label>
                    <input type="text" name="university" value={formData.university} onChange={handleChange} className="input input-bordered focus:input-primary bg-[#0f0f10] text-white" placeholder="e.g. Stanford University" />
                  </div>
                </div>

                {/* Hobbies */}
                <div className="form-control">
                  <label className="label text-xs font-bold uppercase text-gray-500 mb-1">Hobbies & Interests</label>
                  <div className="p-3 border border-[#343536] rounded-lg bg-[#0f0f10] min-h-[3rem] flex flex-wrap gap-2 focus-within:border-primary transition-all">
                    {hobbies.map((hobby, i) => (
                      <span key={i} className="badge badge-secondary gap-1 pr-1 pl-3 py-3">
                        {hobby}
                        <button onClick={() => removeHobby(i)} className="btn btn-ghost btn-xs btn-circle text-white/70 hover:bg-black/20"><XMarkIcon className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="bg-transparent outline-none flex-1 min-w-[120px] text-sm text-white placeholder:text-gray-600"
                      placeholder={hobbies.length === 0 ? "Type something and press Enter..." : "Add another..."}
                      value={inputHobby}
                      onChange={(e) => setInputHobby(e.target.value)}
                      onKeyDown={addHobby}
                    />
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-gray-600">Press Enter to add tags</span>
                  </label>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Icon component helper
const XMarkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export default Profile;
