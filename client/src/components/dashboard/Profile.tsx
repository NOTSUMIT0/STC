import { useState, useEffect, useRef } from 'react';
import { useUpdateProfile } from '../../hooks/mutations/useAuth';

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Zack', 'Midnight', 'Bandit', 'Bella', 'Buster', 'Coco', 'Daisy', 'Ginger'];
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
  const [avatarType, setAvatarType] = useState<'seed' | 'upload'>('seed');
  const [avatarValue, setAvatarValue] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfileMutation = useUpdateProfile();

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
      setAvatarType(user.avatarType || 'seed');
      setAvatarValue(user.avatarValue || user.username || 'Felix'); // Default to username seed if migrated

      // Init preview
      if (user.avatarType === 'upload' && user.avatarValue) {
        if (user.avatarValue.startsWith('data:')) {
          setPreviewUrl(user.avatarValue);
        } else {
          const path = user.avatarValue.startsWith('/') ? user.avatarValue : `/${user.avatarValue}`;
          setPreviewUrl(`${API_URL}${path}`);
        }
      } else {
        const seed = user.avatarValue || user.username || 'Felix';
        setPreviewUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
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

  const handleAvatarSelect = (seed: string) => {
    setAvatarType('seed');
    setAvatarValue(seed);
    setPreviewUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
    // Clear file input if any
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarType('upload');
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      // We don't set avatarValue string here, we use the file ref during submit
    }
  };

  const handleSubmit = () => {
    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('bio', formData.bio);
    data.append('fieldOfStudy', formData.fieldOfStudy);
    data.append('university', formData.university);
    data.append('hobbies', JSON.stringify(hobbies));
    data.append('avatarType', avatarType);

    if (avatarType === 'seed') {
      data.append('avatarValue', avatarValue);
    } else if (avatarType === 'upload' && fileInputRef.current?.files?.[0]) {
      // New file upload
      data.append('avatar', fileInputRef.current.files[0]);
    } else {
      // Keep existing upload (if user didn't change it but is in upload mode)
      // We can send the existing path map, OR backend handles "if no file and type upload, keep existing"
      // Our backend logic: "If file uploaded... else if avatarValue && type seed"
      // So if we are in 'upload' mode but no NEW file, we technically want to keep old value.
      // But if we switched from seed -> upload -> back to old upload... tricky without re-selecting.
      // Current UI: If type is upload and no new file, we rely on backend not overwriting if field missing?
      // Backend: `if (req.file) ... else if (avatarValue && type=='seed')`
      // So if we send type='upload' and NO file, backend does nothing to avatarValue. Good.
    }

    updateProfileMutation.mutate(data);
  };

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-[#1A1A1B] border border-white/5 shadow-xl overflow-hidden sticky top-6">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
            <div className="px-6 pb-6 text-center -mt-12">
              <div className="avatar indicator mx-auto">
                <span className="indicator-item badge badge-primary font-bold">Pro</span>
                <div className="w-28 rounded-full ring-4 ring-[#1A1A1B] bg-base-300">
                  <img src={previewUrl} alt="Avatar" className="object-cover" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-4 text-white">
                {formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : user.username}
              </h2>
              <p className="text-sm text-primary font-medium">{formData.fieldOfStudy || 'Student'}</p>
              <p className="text-xs text-gray-500 mt-1">{formData.university}</p>

              <div className="divider my-4"></div>

              <div className="text-left text-sm text-gray-400 italic">
                "{formData.bio || 'No bio yet...'}"
              </div>
            </div>
          </div>

          {/* Avatar Selector Panel */}
          <div className="card bg-[#1A1A1B] border border-white/5 shadow-xl p-4">
            <h3 className="font-bold text-gray-200 mb-4 text-sm uppercase tracking-wider">Customize Avatar</h3>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Choose a preset:</p>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_SEEDS.map(seed => (
                  <button
                    key={seed}
                    onClick={() => handleAvatarSelect(seed)}
                    className={`rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${avatarType === 'seed' && avatarValue === seed ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} className="w-full bg-gray-800" />
                  </button>
                ))}
              </div>
            </div>

            <div className="divider text-xs text-gray-600">OR</div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-xs text-gray-500">Upload your own picture</span>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="file-input file-input-bordered file-input-primary file-input-sm w-full"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="card bg-[#1A1A1B] border border-white/5 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="font-bold text-xl text-white">Edit Profile</h3>
                  <p className="text-xs text-gray-500">Update your personal information</p>
                </div>
                <button
                  onClick={handleSubmit}
                  className={`btn btn-primary px-8 ${updateProfileMutation.isPending ? 'loading' : ''}`}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase text-gray-500">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input input-bordered focus:input-primary bg-[#0f0f10]" placeholder="e.g. Alex" />
                </div>
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase text-gray-500">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input input-bordered focus:input-primary bg-[#0f0f10]" placeholder="e.g. Student" />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label text-xs font-semibold uppercase text-gray-500">Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="textarea textarea-bordered h-32 focus:textarea-primary bg-[#0f0f10] leading-relaxed" placeholder="Tell the community about yourself..."></textarea>
                  <label className="label">
                    <span className="label-text-alt text-gray-600">Markdown supported</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase text-gray-500">Field of Study</label>
                  <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} className="input input-bordered focus:input-primary bg-[#0f0f10]" placeholder="e.g. Computer Science" />
                </div>
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase text-gray-500">University / College</label>
                  <input type="text" name="university" value={formData.university} onChange={handleChange} className="input input-bordered focus:input-primary bg-[#0f0f10]" placeholder="e.g. Stanford University" />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label text-xs font-semibold uppercase text-gray-500">Hobbies & Interests</label>
                  <div className="p-3 border border-[#343536] rounded-lg bg-[#0f0f10] min-h-[3rem] flex flex-wrap gap-2 focus-within:border-primary transition-colors">
                    {hobbies.map((hobby, i) => (
                      <span key={i} className="badge badge-secondary gap-1 pr-1 pl-3 py-3">
                        {hobby}
                        <button onClick={() => removeHobby(i)} className="btn btn-ghost btn-xs btn-circle text-white/70 hover:bg-black/20"><XMarkIcon className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="bg-transparent outline-none flex-1 min-w-[120px] text-sm"
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

// Simple Icon component helper since we removed imports to make replacing easier
const XMarkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export default Profile;

