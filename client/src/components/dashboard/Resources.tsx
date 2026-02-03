import { DocumentTextIcon, VideoCameraIcon, LinkIcon } from '@heroicons/react/24/outline';

const resources = [
  { title: 'The Modern JavaScript Tutorial', type: 'link', icon: LinkIcon, tag: 'Javascript' },
  { title: 'CS50: Introduction to Computer Science', type: 'video', icon: VideoCameraIcon, tag: 'CS Basics' },
  { title: 'Designing Data-Intensive Applications', type: 'pdf', icon: DocumentTextIcon, tag: 'System Design' },
  { title: 'You Don\'t Know JS (Book Series)', type: 'pdf', icon: DocumentTextIcon, tag: 'Javascript' },
  { title: 'React Documentation', type: 'link', icon: LinkIcon, tag: 'React' },
];

const Resources = () => {
  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Library & Resources</h2>
        <button className="btn btn-primary btn-sm">+ Add Resource</button>
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
    </div>
  );
};

export default Resources;
