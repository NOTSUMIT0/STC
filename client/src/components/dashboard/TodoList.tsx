import { useState } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete React Module 3', done: false },
    { id: 2, text: 'Submit System Design Assignment', done: true },
    { id: 3, text: 'Review Pull Requests', done: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e?: any) => {
    if ((!e || e.key === 'Enter') && newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, done: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const activeCount = todos.filter(t => !t.done).length;

  return (
    <div className="card bg-base-100 shadow-xl h-full border border-white/5 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-gradient-to-r from-base-100 to-base-200">
        <h3 className="font-bold text-lg flex justify-between items-center text-primary">
          <span className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            <span>Tasks</span>
          </span>
          <span className={`badge ${activeCount > 0 ? 'badge-primary' : 'badge-success'} badge-sm font-mono`}>
            {activeCount > 0 ? `${activeCount} Remaining` : 'All Done!'}
          </span>
        </h3>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 max-h-[300px]">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center opacity-50">
            <CheckCircleIcon className="w-12 h-12 mb-2 text-primary/20" />
            <p className="text-sm">No tasks yet. Enjoy your day!</p>
          </div>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border border-transparent ${todo.done ? 'bg-base-200/50 opacity-60' : 'bg-base-200 hover:border-primary/20 hover:shadow-md'}`}
            >
              <label className="swap swap-rotate text-primary">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                />
                <div className="swap-on w-5 h-5 border-2 border-primary rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="swap-off w-5 h-5 border-2 border-primary/50 rounded-full hover:border-primary transition-colors"></div>
              </label>

              <span className={`flex-1 text-sm font-medium transition-all ${todo.done ? 'line-through decoration-2 decoration-gray-500 text-gray-500' : 'text-base-content'}`}>
                {todo.text}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="btn btn-ghost btn-xs btn-square text-error opacity-0 group-hover:opacity-100 transition-all hover:bg-error/10"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-base-200/50 border-t border-white/5">
        <div className="join w-full shadow-sm">
          <input
            type="text"
            placeholder="Add new task..."
            className="input input-sm join-item w-full bg-base-100 focus:outline-none border-white/10 focus:border-primary"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={addTodo}
          />
          <button
            className="btn btn-sm btn-primary join-item px-4"
            onClick={() => addTodo()}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
