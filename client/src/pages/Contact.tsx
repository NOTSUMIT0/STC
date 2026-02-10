import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Contact = () => {
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
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <span>contact@studentplatform.com</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <span>Global Remote</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fa-brands fa-github"></i>
                </div>
                <span>@NOTSUMIT0</span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
              <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
              <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 bg-base-100">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">First Name</span>
                </label>
                <input type="text" placeholder="John" className="input input-bordered w-full focus:input-primary transition-all" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </label>
                <input type="text" placeholder="Doe" className="input input-bordered w-full focus:input-primary transition-all" />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input type="email" placeholder="john@example.com" className="input input-bordered w-full focus:input-primary transition-all" />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Subject</span>
              </label>
              <select className="select select-bordered w-full focus:select-primary transition-all">
                <option disabled selected>Select a topic</option>
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
              <textarea className="textarea textarea-bordered h-32 w-full focus:textarea-primary transition-all" placeholder="How can we help you?"></textarea>
            </div>

            <button type="button" className="btn btn-primary w-full btn-lg shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1 transition-all">
              Send Message
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
