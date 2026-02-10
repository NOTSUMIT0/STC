import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  EnvelopeIcon,
  MapPinIcon,
  CodeBracketSquareIcon
} from '@heroicons/react/24/outline'; // Using CodeBracketSquareIcon as a GitHub alternative if specific brand icon is needed, or just generic code icon. 
// Note: Heroicons doesn't have brand icons like GitHub. 
// For brand icons, we usually stick with FontAwesome or SVGs. 
// IF the user specifically asked to fix "icons here which is not hsowing", it's likely because standard fa- classes need FontAwesome loaded.
// Since I was asked to use libraries for better designs, I'll use Heroicons for the contact info which looks cleaner, 
// and for the social/brand icon, I'll see if I can use a generic icon or keep using a class if I can verify FontAwesome is loaded (it might not be).
// Given the prompt "add icons here which is not hsowing", I should probably use SVG icons directly or Heroicons to be safe.
// I will use Heroicons `CommandLineIcon` or similar for the "GitHub" / developer profile representation.

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, formData);
      toast.success('Message sent successfully!');
      setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-6 pt-24 font-sans relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-base-100 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/5 relative z-10"
      >

        {/* Left Side - Info */}
        <div className="p-10 bg-gradient-to-br from-primary/90 to-accent/90 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-6">Let's Talk</h2>
            <p className="text-white/80 text-lg mb-12">
              Have a question, suggestion, or just want to say hi? We'd love to hear from you.
              Fill out the form and we'll get back to you as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <span>contact@studentplatform.com</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <span>Global Remote</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {/* Fallback for GitHub icon using generic code icon */}
                  <CodeBracketSquareIcon className="w-6 h-6" />
                </div>
                <span>@NOTSUMIT0</span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="font-bold text-xl">S</span>
              </div>
              {/* Decor shapes */}
              <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
              <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 bg-base-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">First Name</span>
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  placeholder="John"
                  className="input input-bordered w-full focus:input-primary transition-all"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Doe"
                  className="input input-bordered w-full focus:input-primary transition-all"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="john@example.com"
                className="input input-bordered w-full focus:input-primary transition-all"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Subject</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="select select-bordered w-full focus:select-primary transition-all"
              >
                <option>General Inquiry</option>
                <option>Support</option>
                <option>Feedback</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Message</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="textarea textarea-bordered h-32 w-full focus:textarea-primary transition-all"
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1 transition-all"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : 'Send Message'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-base-content/50 hover:text-primary transition-colors">Back to Home</Link>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Contact;
