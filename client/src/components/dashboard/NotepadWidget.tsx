import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface NotepadWidgetProps {
  selectedDate: Date;
}

const NotepadWidget = ({ selectedDate }: NotepadWidgetProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const dateKey = selectedDate.toDateString();

  useEffect(() => {
    // Load tasks for the selected date
    const savedTasks = localStorage.getItem(`tasks_${dateKey}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([]);
    }
  }, [dateKey]);

  useEffect(() => {
    // Save tasks whenever they change
    if (tasks.length > 0) {
      localStorage.setItem(`tasks_${dateKey}`, JSON.stringify(tasks));
    } else {
      // Clean up empty entries to keep local storage tidy, unless we just cleared items
      // Actually, better to just save empty array or remove it. 
      // If we want to persist "empty state" vs "never visited", we can decide.
      // For now, removing key if empty is fine.
      localStorage.removeItem(`tasks_${dateKey}`);
    }
  }, [tasks, dateKey]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full flex flex-col">
      <div className="card-body p-4 flex flex-col h-full">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <span className="text-secondary">Notepad</span>
          <span className="text-xs font-normal opacity-50 block mt-1">
            {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </h3>

        <div className="flex-1 overflow-y-auto min-h-[150px] space-y-2 custom-scrollbar pr-1">
          {tasks.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm italic opacity-50">
              No tasks for this day.
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="group flex items-center gap-2 p-2 rounded-lg hover:bg-base-200 transition-colors">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="checkbox checkbox-xs checkbox-secondary rounded-sm"
                />
                <span className={`text-sm flex-1 truncate ${task.completed ? 'line-through text-gray-500 opacity-50' : ''}`}>
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="btn btn-ghost btn-xs btn-circle text-error opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={addTask} className="mt-4 relative">
          <input
            type="text"
            placeholder="Add a note..."
            className="input input-sm input-bordered w-full pr-10 bg-base-200 focus:bg-base-100 transition-colors"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newTask.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle text-primary disabled:bg-transparent disabled:text-gray-600"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotepadWidget;
