import { useState } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SupportModal = ({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user?: any }) => {
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/support`, {
        topic,
        message,
        userEmail: user?.email,
        userId: user?._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Message sent successfully! We will get back to you at kumarsumeet683@gmail.com.');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl scale-100 animate-pop-in border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-base-200/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Contact Support</h2>
            <p className="text-sm opacity-70 mt-1">We are here to help you 24/7.</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Email Info */}
          <div className="alert alert-info py-2 text-xs flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Replies will be sent to <strong>kumarsumeet683@gmail.com</strong> (Admin) and your email.</span>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Topic</span>
            </label>
            <select
              className="select select-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option>General Inquiry</option>
              <option>Report a Bug</option>
              <option>Account Issue</option>
              <option>Feature Request</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Message</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-40 resize-none bg-base-200 focus:bg-base-100 transition-colors leading-relaxed"
              placeholder="Describe your issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-base-200/50 flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button
            className="btn btn-primary gap-2"
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
          >
            {loading ? <span className="loading loading-spinner loading-xs"></span> : <PaperAirplaneIcon className="w-4 h-4" />}
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
