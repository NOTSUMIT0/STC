import { XMarkIcon } from '@heroicons/react/24/outline';

const SupportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl scale-100 animate-pop-in border border-white/10">
        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="card-title text-2xl">Contact Support</h2>
              <p className="text-sm opacity-70">We are here to help you 24/7.</p>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">Topic</label>
              <select className="select select-bordered w-full">
                <option disabled selected>Select an issue...</option>
                <option>General Inquiry</option>
                <option>Report a Bug</option>
                <option>Account Issue</option>
                <option>Feature Request</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">Message</label>
              <textarea className="textarea textarea-bordered h-32" placeholder="Describe your issue in detail..."></textarea>
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button className="btn btn-primary" onClick={() => { alert('Support request sent!'); onClose(); }}>Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
