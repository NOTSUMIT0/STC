import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { PrivacyPolicyModal, TermsModal } from './LegalModals';

const Footer = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const handleLinkClick = (path: string) => {
    if (user) {
      if (path === 'dashboard') {
        // const dashboardElement = document.getElementById('dashboard-view'); // Or specific tab logic if handled via params/state
        // Since dashboard uses state for tabs, we might just route to /dashboard and let user navigate or pass state
        navigate('/dashboard');
        // Note: If you want deep linking to tabs (e.g. /dashboard/roadmaps), the Dashboard component needs to handle URL params. 
        // For now, simple redirect to dashboard is safe, or we can stay consistent with current app structure.
      } else {
        // Assuming these are just sections within dashboard for now, or new pages?
        // Based on previous code, they are tabs in Dashboard.
        // If they are tabs, we can't easily deep link without refactoring Dashboard to use URL params.
        // However, the prompt implies "take them on these particular pages". 
        // I'll assume they meant the dashboard interface where these live.
        // A better UX would be passing state: navigate('/dashboard', { state: { tab: 'Roadmaps' } })
        navigate('/dashboard', { state: { activeTab: path } });
      }
    } else {
      navigate('/signup');
    }
  };

  return (
    <footer className="bg-base-200 text-base-content pt-20 pb-10 border-t border-base-content/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <span className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6 block">
            StudentPlatform
          </span>
          <p className="text-base-content/60 leading-relaxed mb-6 text-sm">
            Empowering students worldwide with the tools they need to succeed in the modern era. We bridge the gap between theory and real-world application, fostering a collaborative environment where every learner can innovate and grow.
          </p>
          <div className="flex gap-4">
            <a href="https://x.com/NOT_SUMIT_" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-xs btn-ghost hover:bg-primary hover:text-white transition-all">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="https://github.com/NOTSUMIT0" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-xs btn-ghost hover:bg-primary hover:text-white transition-all">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/sumit-kumar010/" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-xs btn-ghost hover:bg-primary hover:text-white transition-all">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Discord: not_sumit"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText("not_sumit");
                toast.success("Discord username 'not_sumit' copied to clipboard!");
              }}
              className="btn btn-circle btn-xs btn-ghost hover:bg-primary hover:text-white transition-all"
            >
              <i className="fa-brands fa-discord"></i>
            </a>
          </div>
        </div>

        {/* Links Column 1 - Platform */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-primary">Platform</h4>
          <ul className="space-y-3 text-base-content/70 cursor-pointer">
            <li><a onClick={() => handleLinkClick('Roadmaps')} className="hover:text-primary transition-colors">Roadmaps</a></li>
            <li><a onClick={() => handleLinkClick('Resources')} className="hover:text-primary transition-colors">Resources</a></li>
            <li><a onClick={() => handleLinkClick('Community')} className="hover:text-primary transition-colors">Community</a></li>
            <li><a onClick={() => handleLinkClick('Overview')} className="hover:text-primary transition-colors">Dashboard</a></li>
          </ul>
        </div>

        {/* Links Column 2 - Company */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-primary">Company</h4>
          <ul className="space-y-3 text-base-content/70">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Me</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

      </motion.div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-base-content/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-base-content/50">
        <p>© 2026 StudentPlatform Industries Ltd. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <button onClick={() => setActiveModal('privacy')} className="hover:text-base-content transition-colors">Privacy Policy</button>
          <button onClick={() => setActiveModal('terms')} className="hover:text-base-content transition-colors">Terms of Service</button>
        </div>
      </div>
      <PrivacyPolicyModal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} />
      <TermsModal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} />

    </footer>
  );
};

export default Footer;
