import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: LegalModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-base-100 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl shadow-2xl border border-base-content/10"
          >
            <div className="sticky top-0 bg-base-100/90 backdrop-blur-md p-6 border-b border-base-content/10 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-base-content">{title}</h3>
              <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 text-base-content/80 prose prose-sm md:prose-base max-w-none">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const PrivacyPolicyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
    <p className="lead">
      At StudentPlatform, your privacy is our top priority. We are committed to protecting your personal information and ensuring you have complete control over your data.
    </p>

    <h4>1. Data Protection & Security</h4>
    <p>
      All user data is encrypted using industry-standard protocols. We utilize robust security measures to prevent unauthorized access, alteration, disclosure, or destruction of your personal information. Your data is stored securely on protected servers.
    </p>

    <h4>2. Information We Collect</h4>
    <p>
      We collect only the information necessary to provide you with a personalized learning experience. This includes your name, email address, and learning progress. We do not sell your personal data to third parties.
    </p>

    <h4>3. User Rights</h4>
    <p>
      You have the right to access, correct, or delete your personal information at any time. You can manage your privacy settings directly from your dashboard or contact our support team for assistance.
    </p>

    <div className="alert alert-info shadow-sm mt-6">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>Your trust matters to us. We are transparent about how we handle your data.</span>
    </div>
  </Modal>
);

export const TermsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
    <p className="lead">
      Welcome to StudentPlatform. By accessing or using our website, you agree to be bound by these Terms of Service.
    </p>

    <h4>1. Acceptance of Terms</h4>
    <p>
      By registering for and using StudentPlatform, you agree to comply with all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
    </p>

    <h4>2. Code of Conduct</h4>
    <p>
      Our community is built on respect and collaboration. Harassment, hate speech, or any form of abusive behavior will not be tolerated and may result in the termination of your account.
    </p>

    <h4>3. Intellectual Property</h4>
    <p>
      All content provided on StudentPlatform, including roadmaps, resources, and code snippets, is for educational purposes. You may not redistribute or claim ownership of our proprietary content without explicit permission.
    </p>

    <h4>4. Account Responsibilities</h4>
    <p>
      You are responsible for maintaining the confidentiality of your account credentials. StudentPlatform is not liable for any loss or damage arising from your failure to protect your login information.
    </p>

    <div className="mt-8 pt-6 border-t border-base-content/10 text-sm opacity-70">
      Last updated: February 2026
    </div>
  </Modal>
);
