import { useState } from 'react';
import { useProblems, useUpdateProblemStatus, useDeleteProblem } from '../../hooks/useProblems';
import { PlusIcon, TrashIcon, ArrowTopRightOnSquareIcon, CheckCircleIcon, PlayIcon } from '@heroicons/react/24/outline';
import AddProblemModal from './AddProblemModal';
import { toast } from 'react-toastify';

const ProblemList = () => {
  const { data: problems, isLoading } = useProblems();
  const updateStatus = useUpdateProblemStatus();
  const deleteProblem = useDeleteProblem();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatus.mutate({ id, status: newStatus }, {
      onSuccess: () => toast.success(`Status updated to ${newStatus}`)
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      deleteProblem.mutate(id, {
        onSuccess: () => toast.success('Problem deleted')
      });
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'In Progress': return 'badge-warning';
      default: return 'badge-error';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'Hard': return 'text-error';
      default: return 'text-gray-400';
    }
  };

  const safeProblems = Array.isArray(problems) ? problems : [];
  const filteredProblems = filter === 'All'
    ? safeProblems
    : safeProblems.filter((p: any) => p.status === filter);

  if (isLoading) return <div className="skeleton h-64 w-full"></div>;

  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden border border-white/5">
      <div className="card-body p-0">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-base-200/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-lg">My Code Problems</h3>
            <div className="join">
              {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
                <button
                  key={status}
                  className={`join-item btn btn-xs ${filter === status ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-sm btn-primary gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Problem
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
          <table className="table table-pin-rows">
            <thead>
              <tr className="bg-base-200/50 text-gray-400">
                <th>Topic / Problem</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">
                    No problems found. Start tracking your progress!
                  </td>
                </tr>
              ) : (
                filteredProblems?.map((problem: any) => (
                  <tr key={problem._id} className="hover:bg-base-200/50 transition-colors group">
                    <td>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base-content">{problem.title}</span>
                          {problem.link && (
                            <a href={problem.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                              <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 badge badge-ghost badge-xs mt-1">{problem.topic}</span>
                      </div>
                    </td>
                    <td className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                    <td>
                      <div className={`badge ${getBadgeColor(problem.status)} badge-sm gap-1`}>
                        {problem.status}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        {problem.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(problem._id, 'In Progress')}
                            className="btn btn-square btn-xs btn-ghost text-warning tooltip tooltip-left"
                            data-tip="Start"
                          >
                            <PlayIcon className="w-4 h-4" />
                          </button>
                        )}
                        {problem.status !== 'Completed' && (
                          <button
                            onClick={() => handleStatusChange(problem._id, 'Completed')}
                            className="btn btn-square btn-xs btn-ghost text-success tooltip tooltip-left"
                            data-tip="Mark Complete"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(problem._id)}
                          className="btn btn-square btn-xs btn-ghost text-error tooltip tooltip-left"
                          data-tip="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddProblemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProblemList;
