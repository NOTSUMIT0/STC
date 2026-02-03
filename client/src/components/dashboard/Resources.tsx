import { useState } from 'react';
import { DocumentTextIcon, VideoCameraIcon, LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';

const resources = [
  { title: 'The Modern JavaScript Tutorial', type: 'link', icon: LinkIcon, tag: 'Javascript' },
  { title: 'CS50: Introduction to Computer Science', type: 'video', icon: VideoCameraIcon, tag: 'CS Basics' },
  { title: 'Designing Data-Intensive Applications', type: 'pdf', icon: DocumentTextIcon, tag: 'System Design' },
  { title: 'You Don\'t Know JS (Book Series)', type: 'pdf', icon: DocumentTextIcon, tag: 'Javascript' },
  { title: 'React Documentation', type: 'link', icon: LinkIcon, tag: 'React' },
  { title: 'FreeCodeCamp Legacy Certifications', type: 'link', icon: LinkIcon, tag: 'Full Stack' },
  { title: 'Clean Code by Robert C. Martin', type: 'pdf', icon: DocumentTextIcon, tag: 'Best Practices' },
  { title: 'NeetCode 150 - Algorithms', type: 'video', icon: VideoCameraIcon, tag: 'DSA' },
  { title: 'Docker for Beginners', type: 'video', icon: VideoCameraIcon, tag: 'DevOps' },
  { title: 'MDN Web Docs', type: 'link', icon: LinkIcon, tag: 'Web Reference' },
];

const Resources = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Library & Resources</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>+ Add Resource</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {resources.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-base-100 rounded-xl border border-white/5 hover:bg-base-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-base-300 rounded-lg text-primary">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <div className="badge badge-ghost badge-xs mt-1">{item.tag}</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm">Access</button>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="card w-full max-w-lg bg-[#1e2124] shadow-2xl border border-white/5 animate-pop-in">
              <div className="card-body p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-white">Add New Resource</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label text-xs font-bold text-gray-300 uppercase">Resource Name</label>
                    <input type="text" placeholder="e.g. Advanced System Design" className="input input-bordered bg-[#2b2d31] border-none text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-bold text-gray-300 uppercase">Tags</label>
                    <input type="text" placeholder="e.g. System Design, Backend" className="input input-bordered bg-[#2b2d31] border-none text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-bold text-gray-300 uppercase">About</label>
                    <textarea className="textarea textarea-bordered h-24 bg-[#2b2d31] border-none text-white focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Short description of the resource..."></textarea>
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-bold text-gray-300 uppercase">Attachment</label>
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-primary/50 hover:bg-[#2b2d31] transition-all cursor-pointer">
                      <DocumentTextIcon className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                      <p className="text-sm text-gray-400">Click to upload PDF or DOCX</p>
                      <p className="text-xs text-gray-600 mt-1">Max file size: 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button className="btn btn-ghost hover:bg-[#2b2d31] text-gray-300" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={() => setIsModalOpen(false)}>Upload Resource</button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Resources;
