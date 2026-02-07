import { useState, useEffect } from 'react';
import { DocumentTextIcon, LinkIcon, XMarkIcon, EllipsisVerticalIcon, GlobeAltIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface Resource {
  _id: string;
  title: string;
  type: 'link' | 'pdf' | 'video' | 'file';
  description: string;
  url: string;
  tags: string[];
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'link' | 'file'>('link');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch(`${API_URL}/api/resources`);
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error('Failed to fetch resources', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setTags('');
    setDescription('');
    setLinkUrl('');
    setFile(null);
    setEditMode(false);
    setCurrentId(null);
    setActiveTab('link');
  };

  const handleOpenModal = (resource?: Resource) => {
    if (resource) {
      setEditMode(true);
      setCurrentId(resource._id);
      setTitle(resource.title);
      setTags(resource.tags.join(', '));
      setDescription(resource.description || '');
      // Determine type based on existing data if possible, or default
      if (resource.url.startsWith('/uploads')) {
        setActiveTab('file');
      } else {
        setActiveTab('link');
        setLinkUrl(resource.url);
      }
    } else {
      resetForm();
    }
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await fetch(`${API_URL}/api/resources/${id}`, { method: 'DELETE' });
      fetchResources();
    } catch (err) {
      console.error('Failed to delete', err);
    }
    setOpenDropdownId(null);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('type', activeTab === 'file' ? 'file' : 'link');

    // Pass user ID if available (stubbed for now)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) formData.append('user', user.id);

    if (activeTab === 'link') {
      formData.append('url', linkUrl);
    } else if (file) {
      formData.append('file', file);
    }

    try {
      const method = editMode ? 'PUT' : 'POST';
      const url = editMode ? `${API_URL}/api/resources/${currentId}` : `${API_URL}/api/resources`;

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchResources();
        resetForm();
      } else {
        alert('Failed to save resource');
      }
    } catch (err) {
      console.error('Error saving resource', err);
    }
  };

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsViewModalOpen(true);
  };

  const openResourceLink = (url: string) => {
    const finalUrl = url.startsWith('/') ? `${API_URL}${url}` : url;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="animate-fade-in-up pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Library & Resources</h2>
          <p className="text-gray-400 text-sm mt-1">Manage and access your study materials</p>
        </div>
        <button
          className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20"
          onClick={() => handleOpenModal()}
        >
          <span>+</span> Add Resource
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {resources.length === 0 && (
            <div className="text-center py-10 text-gray-500 bg-base-100 rounded-xl border border-white/5">
              <p>No resources found. Add one to get started!</p>
            </div>
          )}
          {resources.map((item) => (
            <div key={item._id} className="group relative flex items-center justify-between p-4 bg-[#1e2124] rounded-xl border border-white/5 hover:border-white/10 hover:bg-[#25282c] transition-all duration-200 shadow-sm">
              <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => handleViewResource(item)}>
                <div className={`p-3 rounded-lg ${item.url.startsWith('/uploads') ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                  {item.url.startsWith('/uploads') ? <DocumentTextIcon className="w-6 h-6" /> : <LinkIcon className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-100 group-hover:text-white transition-colors">{item.title}</h3>
                  <div className="flex gap-2 mt-1">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="badge badge-ghost badge-xs text-gray-400 border-white/10 bg-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openResourceLink(item.url)}
                  className="btn btn-ghost btn-sm text-gray-400 hover:text-white hidden sm:flex"
                >
                  Access
                </button>

                <div className="relative">
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === item._id ? null : item._id)}
                    className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:bg-white/5"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>

                  {openDropdownId === item._id && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-[#2b2d31] rounded-lg shadow-xl border border-white/10 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg bg-[#1e2124] shadow-2xl border border-white/10 animate-pop-in">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-white">{editMode ? 'Edit Resource' : 'Add New Resource'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-lg">
                  <button
                    onClick={() => setActiveTab('link')}
                    className={`btn btn-sm border-none ${activeTab === 'link' ? 'bg-[#2b2d31] text-white shadow' : 'bg-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    <GlobeAltIcon className="w-4 h-4 mr-2" /> Link
                  </button>
                  <button
                    onClick={() => setActiveTab('file')}
                    className={`btn btn-sm border-none ${activeTab === 'file' ? 'bg-[#2b2d31] text-white shadow' : 'bg-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" /> Library / File
                  </button>
                </div>

                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Resource Name</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Advanced System Design"
                    className="input input-bordered w-full bg-[#2b2d31] border-white/5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. System Design, Backend"
                    className="input input-bordered w-full bg-[#2b2d31] border-white/5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">About</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered h-24 w-full bg-[#2b2d31] border-white/5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600 resize-none"
                    placeholder="Short description of the resource..."
                  ></textarea>
                </div>

                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                    {activeTab === 'link' ? 'Website URL' : 'Attachment'}
                  </label>

                  {activeTab === 'link' ? (
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="input input-bordered w-full pl-10 bg-[#2b2d31] border-white/5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        className="file-input file-input-bordered w-full bg-[#2b2d31] border-white/5 text-gray-300 file-input-primary focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-2 ml-1">Supported: PDF, DOCX, TXT (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-actions justify-end mt-8">
                <button className="btn btn-ghost hover:bg-white/5 text-gray-400" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary bg-gradient-to-r from-secondary to-accent border-none" onClick={handleSubmit}>
                  {editMode ? 'Save Changes' : 'Upload Resource'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Resource Modal */}
      {isViewModalOpen && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-2xl bg-[#1e2124] shadow-2xl border border-white/10 animate-scale-in">
            <div className="card-body">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${selectedResource.url.startsWith('/uploads') ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {selectedResource.url.startsWith('/uploads') ? <DocumentTextIcon className="w-8 h-8" /> : <LinkIcon className="w-8 h-8" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedResource.title}</h2>
                    <div className="flex gap-2">
                      {selectedResource.tags.map((tag, i) => (
                        <span key={i} className="badge badge-outline text-gray-400 text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-white">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-[#2b2d31] p-6 rounded-xl mb-6">
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">About this resource</h4>
                <p className="text-gray-300 leading-relaxed">
                  {selectedResource.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button className="btn btn-ghost text-gray-400" onClick={() => setIsViewModalOpen(false)}>Close</button>
                <button
                  className="btn btn-primary gap-2"
                  onClick={() => openResourceLink(selectedResource.url)}
                >
                  {selectedResource.url.startsWith('/uploads') ? (
                    <>
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" /> Open / Download
                    </>
                  ) : (
                    <>
                      <GlobeAltIcon className="w-5 h-5" /> Visit Website
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
