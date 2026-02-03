import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete React Module 3', done: false },
    { id: 2, text: 'Submit System Design Assignment', done: true },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: any) => {
    if (e.key === 'Enter' && newTodo.trim()) {
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

  return (
    <div className="card bg-base-100 shadow-xl h-full border border-white/5">
      <div className="card-body p-5">
        <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
          Your Tasks
          <span className="badge badge-primary">{todos.filter(t => !t.done).length} left</span>
        </h3>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            className="input input-bordered w-full pr-10"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={addTodo}
          />
          <PlusIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
        </div>

        <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {todos.length === 0 && <p className="text-center text-sm text-gray-500 py-4">No tasks yet. Woohoo! 🎉</p>}
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg group transition-colors">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className={`checkbox checkbox-sm ${todo.done ? 'checkbox-success' : 'checkbox-primary'}`}
              />
              <span className={`flex-1 text-sm ${todo.done ? 'line-through text-gray-500' : ''}`}>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)} className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity">
                <TrashIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
