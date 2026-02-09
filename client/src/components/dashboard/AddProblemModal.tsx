import { useState } from 'react';
import { useCreateProblem } from '../../hooks/useProblems';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const AddProblemModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Medium',
    topic: '',
    link: ''
  });

  const createProblem = useCreateProblem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.topic) {
      toast.error('Title and Topic are required');
      return;
    }

    try {
      await createProblem.mutateAsync(formData);
      toast.success('Problem added to your list!');
      onClose();
      setFormData({ title: '', difficulty: 'Medium', topic: '', link: '' }); // Reset
    } catch (err: any) {
      toast.error(err.response?.data?.msg || 'Failed to add problem');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl border border-white/10 animate-scale-in">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-white">Add New Problem</h3>
            <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-white">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Problem Title</span></label>
              <input
                type="text"
                placeholder="e.g. Two Sum"
                className="input input-bordered w-full bg-base-200"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Difficulty</span></label>
                <select
                  className="select select-bordered w-full bg-base-200"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Topic</span></label>
                <input
                  type="text"
                  placeholder="e.g. Arrays"
                  className="input input-bordered w-full bg-base-200"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Problem Link (Optional)</span></label>
              <input
                type="url"
                placeholder="https://leetcode.com/problems/..."
                className="input input-bordered w-full bg-base-200"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>

            <div className="modal-action mt-6">
              <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
              <button
                type="submit"
                className={`btn btn-primary ${createProblem.isPending ? 'loading' : ''}`}
                disabled={createProblem.isPending}
              >
                Add Problem
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProblemModal;
