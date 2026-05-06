import { useState } from 'react';

const TaskModal = ({ task, onClose, onUpdate, onAddNote, onDelete }) => {
  const [newNote, setNewNote] = useState('');

  const handleStatusChange = (newStatus) => {
    onUpdate(task.id, { status: newStatus });
  };

  const handleTimeUpdate = (newTime) => {
    onUpdate(task.id, { timeSpent: newTime });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(task.id, newNote);
      setNewNote('');
    }
  };

  const statusColors = {
    'To Do': 'bg-slate-500/20 text-slate-300',
    'In Progress': 'bg-blue-500/20 text-blue-300',
    'Done': 'bg-emerald-500/20 text-emerald-300'
  };

  const progressPercent = (task.timeSpent / task.estimatedTime) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 px-6 py-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{task.title}</h2>
            <p className="text-slate-400 text-sm mt-1">ID: {task.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Status</label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full mt-2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400">Priority</label>
              <p className="mt-2 px-3 py-2 rounded-lg bg-slate-950 text-sm font-medium">{task.priority}</p>
            </div>
          </div>

          {/* Time Tracking */}
          <div>
            <label className="text-sm text-slate-400">Time Tracking</label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Spent</p>
                  <input
                    type="number"
                    value={task.timeSpent}
                    onChange={(e) => handleTimeUpdate(parseInt(e.target.value))}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Estimated</p>
                  <p className="px-3 py-2 rounded-lg bg-slate-950 text-sm">{task.estimatedTime}m</p>
                </div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <div className="flex justify-between text-xs mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="bg-slate-800 rounded h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded transition-all"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category and Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Category</p>
              <p className="mt-1 font-medium">{task.category}</p>
            </div>
            <div>
              <p className="text-slate-400">Due Date</p>
              <p className="mt-1 font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="font-semibold mb-3">Notes ({task.notes.length})</h3>
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {task.notes.map((note, i) => (
                <div key={i} className="bg-slate-950 rounded-lg p-3 text-sm">
                  <p className="text-slate-400 text-xs mb-1">{note.author} • {new Date(note.timestamp).toLocaleString()}</p>
                  <p>{note.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                placeholder="Add a note..."
                className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleAddNote}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
              >
                Add
              </button>
            </div>
          </div>

          {/* Delete Button */}
          <div className="flex gap-2 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="flex-1 rounded-lg bg-red-500/20 text-red-300 px-4 py-2 font-medium hover:bg-red-500/30 transition"
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
