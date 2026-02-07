import { useState, useEffect } from 'react';
import { DocumentTextIcon, LinkIcon, XMarkIcon, EllipsisVerticalIcon, GlobeAltIcon, ArrowTopRightOnSquareIcon, FolderIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { FolderIcon as FolderIconSolid } from '@heroicons/react/24/solid';

interface Resource {
  _id: string;
  title: string;
  type: 'link' | 'pdf' | 'video' | 'file' | 'folder';
  description: string;
  url: string;
  tags: string[];
  parentId: string | null;
}

interface Breadcrumb {
  id: string | null;
  name: string;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation State
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ id: null, name: 'Library' }]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // For viewing details
  const [modalType, setModalType] = useState<'create_folder' | 'add_resource' | 'edit'>('add_resource');

  // Form State
  const [activeTab, setActiveTab] = useState<'link' | 'file'>('link');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchResources(currentFolderId);
  }, [currentFolderId]);

  const fetchResources = async (parentId: string | null) => {
    setLoading(true);
    try {
      const query = parentId ? `?parentId=${parentId}` : '?parentId=null';
      const res = await fetch(`${API_URL}/api/resources${query}`);
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error('Failed to fetch resources', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (folderId: string | null, folderName: string) => {
    if (folderId === null) {
      setBreadcrumbs([{ id: null, name: 'Library' }]);
      setCurrentFolderId(null);
    } else {
      // If clicking a breadcrumb, truncate path
      const existingIndex = breadcrumbs.findIndex(b => b.id === folderId);
      if (existingIndex !== -1) {
        setBreadcrumbs(breadcrumbs.slice(0, existingIndex + 1));
        setCurrentFolderId(folderId);
      } else {
        // pushing new folder
        setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
        setCurrentFolderId(folderId);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setTags('');
    setDescription('');
    setLinkUrl('');
    setFile(null);
    setCurrentId(null);
    setActiveTab('link');
  };

  const handleOpenModal = (type: 'create_folder' | 'add_resource' | 'edit', resource?: Resource) => {
    setModalType(type);
    if (type === 'edit' && resource) {
      setCurrentId(resource._id);
      setTitle(resource.title);
      setTags(resource.tags.join(', '));
      setDescription(resource.description || '');
      if (resource.type === 'folder') {
        setModalType('create_folder'); // Re-use folder UI
      } else {
        if (resource.url && resource.url.startsWith('/uploads')) {
          setActiveTab('file');
        } else {
          setActiveTab('link');
          setLinkUrl(resource.url || '');
        }
      }
    } else {
      resetForm();
    }
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      await fetch(`${API_URL}/api/resources/${id}`, { method: 'DELETE' });
      fetchResources(currentFolderId);
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

    // Always append parentId
    if (currentFolderId) formData.append('parentId', currentFolderId);
    else formData.append('parentId', 'null');

    // Pass user ID
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) formData.append('user', user.id);

    if (modalType === 'create_folder' || (modalType === 'edit' && currentId && resources.find(r => r._id === currentId)?.type === 'folder')) {
      formData.append('type', 'folder');
    } else {
      formData.append('type', activeTab === 'file' ? 'file' : 'link');
      if (activeTab === 'link') {
        formData.append('url', linkUrl);
      } else if (file) {
        formData.append('file', file);
      }
    }

    try {
      const isEdit = modalType === 'edit';
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_URL}/api/resources/${currentId}` : `${API_URL}/api/resources`;

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchResources(currentFolderId);
        resetForm();
      } else {
        alert('Failed to save resource');
      }
    } catch (err) {
      console.error('Error saving resource', err);
    }
  };

  const openResourceLink = (url: string) => {
    if (!url) return;
    const finalUrl = url.startsWith('/') ? `${API_URL}${url}` : url;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  // Separate data
  const folders = resources.filter(r => r.type === 'folder');
  const files = resources.filter(r => r.type !== 'folder');

  return (
    <div className="animate-fade-in-up pb-20">

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Library & Resources</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRightIcon className="w-4 h-4" />}
                <button
                  onClick={() => handleNavigate(crumb.id, crumb.name)}
                  className={`hover:text-white transition-colors ${index === breadcrumbs.length - 1 ? 'font-bold text-white' : ''}`}
                >
                  {index === 0 ? <HomeIcon className="w-4 h-4" /> : crumb.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-outline btn-secondary btn-sm gap-2"
            onClick={() => handleOpenModal('create_folder')}
          >
            <FolderIcon className="w-4 h-4" /> New Folder
          </button>
          <button
            className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20"
            onClick={() => handleOpenModal('add_resource')}
          >
            <span>+</span> Add Resource
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
      ) : (
        <div className="space-y-8">

          {resources.length === 0 && (
            <div className="text-center py-16 text-gray-500 bg-base-100/50 rounded-xl border border-white/5 border-dashed">
              <FolderIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg font-medium">This folder is empty</p>
              <p className="text-sm">Create a folder or add a resource to get started.</p>
            </div>
          )}

          {/* Folders Section */}
          {folders.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Folders</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <div
                    key={folder._id}
                    className="group relative flex items-center p-4 bg-[#1e2124] rounded-xl border border-white/5 hover:border-white/10 hover:bg-[#25282c] transition-all duration-200 cursor-pointer"
                    onClick={() => handleNavigate(folder._id, folder.title)}
                  >
                    <FolderIconSolid className="w-10 h-10 text-yellow-500/80 mr-4" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-200 truncate group-hover:text-white transition-colors">{folder.title}</h4>
                      <p className="text-xs text-gray-500">{folder.tags.length > 0 ? folder.tags[0] : 'Folder'}</p>
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === folder._id ? null : folder._id)}
                        className="btn btn-ghost btn-circle btn-xs text-gray-400 hover:text-white"
                      >
                        <EllipsisVerticalIcon className="w-4 h-4" />
                      </button>
                      {openDropdownId === folder._id && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-[#2b2d31] rounded-lg shadow-xl border border-white/10 z-10 overflow-hidden">
                          <button onClick={() => handleOpenModal('edit', folder)} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5">Rename</button>
                          <button onClick={() => handleDelete(folder._id, 'folder')} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Section */}
          {files.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Resources</h3>
              <div className="grid grid-cols-1 gap-3">
                {files.map((item) => (
                  <div key={item._id} className="group relative flex items-center justify-between p-3 bg-[#1e2124] rounded-xl border border-white/5 hover:border-white/10 hover:bg-[#25282c] transition-all duration-200 shadow-sm">
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => { setSelectedResource(item); setIsViewModalOpen(true); }}>
                      <div className={`p-2 rounded-lg ${item.url && item.url.startsWith('/uploads') ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {item.url && item.url.startsWith('/uploads') ? <DocumentTextIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{item.title}</h3>
                        <div className="flex gap-2">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openResourceLink(item.url)}
                        className="btn btn-ghost btn-xs text-gray-400 hover:text-white hidden sm:flex"
                      >
                        Access
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === item._id ? null : item._id)}
                          className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:bg-white/5"
                        >
                          <EllipsisVerticalIcon className="w-4 h-4" />
                        </button>
                        {openDropdownId === item._id && (
                          <div className="absolute right-0 top-full mt-2 w-32 bg-[#2b2d31] rounded-lg shadow-xl border border-white/10 z-10 overflow-hidden">
                            <button onClick={() => handleOpenModal('edit', item)} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5">Edit</button>
                            <button onClick={() => handleDelete(item._id, 'resource')} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Unified Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg bg-[#1e2124] shadow-2xl border border-white/10 animate-pop-in">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-white">
                  {modalType === 'create_folder' ? 'Create New Folder' : (modalType === 'edit' ? 'Edit Item' : 'Add New Resource')}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {modalType !== 'create_folder' && (
                  <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-lg mb-4">
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
                      <DocumentTextIcon className="w-4 h-4 mr-2" /> File
                    </button>
                  </div>
                )}

                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                    {modalType === 'create_folder' ? 'Folder Name' : 'Title'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={modalType === 'create_folder' ? "e.g. Mathematics" : "e.g. Advanced Calculus Note"}
                    className="input input-bordered w-full bg-[#2b2d31] border-white/5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Tags (Optional)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. Math, Exam Prep"
                    className="input input-bordered w-full bg-[#2b2d31] border-white/5 text-white focus:outline-none focus:border-primary/50"
                  />
                </div>

                {modalType !== 'create_folder' && (
                  <>
                    <div className="form-control w-full">
                      <label className="label text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea textarea-bordered h-20 w-full bg-[#2b2d31] border-white/5 text-white focus:outline-none focus:border-primary/50 resize-none"
                        placeholder="Brief description..."
                      ></textarea>
                    </div>

                    <div className="form-control w-full">
                      <label className="label text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                        {activeTab === 'link' ? 'URL' : 'Upload File'}
                      </label>
                      {activeTab === 'link' ? (
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="input input-bordered w-full pl-10 bg-[#2b2d31] border-white/5 text-white focus:outline-none focus:border-primary/50"
                          />
                        </div>
                      ) : (
                        <input
                          type="file"
                          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                          className="file-input file-input-bordered w-full bg-[#2b2d31] border-white/5 text-gray-300 file-input-primary focus:outline-none"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="card-actions justify-end mt-8">
                <button className="btn btn-ghost hover:bg-white/5 text-gray-400" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary bg-gradient-to-r from-secondary to-accent border-none" onClick={handleSubmit}>
                  {modalType === 'edit' ? 'Save Changes' : (modalType === 'create_folder' ? 'Create Folder' : 'Add Resource')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Resource Modal (Simple View) */}
      {isViewModalOpen && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-2xl bg-[#1e2124] shadow-2xl border border-white/10 animate-scale-in">
            <div className="card-body">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${selectedResource.url && selectedResource.url.startsWith('/uploads') ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {selectedResource.url && selectedResource.url.startsWith('/uploads') ? <DocumentTextIcon className="w-8 h-8" /> : <LinkIcon className="w-8 h-8" />}
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
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Description</h4>
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
                  Open Resource <ArrowTopRightOnSquareIcon className="w-4 h-4" />
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
