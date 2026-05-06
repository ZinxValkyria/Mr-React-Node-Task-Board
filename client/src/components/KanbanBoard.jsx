import { useState } from 'react';

const KanbanBoard = ({ tasks, onUpdateTask, onSelectTask }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = {
    'To Do': tasks.filter(t => t.status === 'To Do'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Done': tasks.filter(t => t.status === 'Done')
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      onUpdateTask(draggedTask.id, { status });
      setDraggedTask(null);
    }
  };

  const priorityColors = {
    High: 'border-red-500/50 bg-red-500/10',
    Medium: 'border-amber-500/50 bg-amber-500/10',
    Low: 'border-emerald-500/50 bg-emerald-500/10'
  };

  const ColumnHeader = ({ title, count }) => {
    const headerColors = {
      'To Do': 'text-slate-400',
      'In Progress': 'text-blue-400',
      'Done': 'text-emerald-400'
    };

    return (
      <div className={`font-semibold mb-4 flex items-center justify-between ${headerColors[title]}`}>
        <span>{title}</span>
        <span className="bg-white/10 rounded-full px-3 py-1 text-sm">{count}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(columns).map(([status, statusTasks]) => (
        <div
          key={status}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
          className="rounded-xl border border-white/10 bg-slate-900/30 p-4 min-h-96"
        >
          <ColumnHeader title={status} count={statusTasks.length} />

          <div className="space-y-3">
            {statusTasks.map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onClick={() => onSelectTask(task)}
                className={`rounded-lg border p-4 cursor-move transition hover:shadow-lg ${priorityColors[task.priority]} hover:scale-105 transform`}
              >
                <h4 className="font-medium text-sm mb-2">{task.title}</h4>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="text-xs bg-white/10 px-2 py-1 rounded text-slate-300">
                    {task.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {task.priority}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>{task.timeSpent}m / {task.estimatedTime}m</span>
                  {task.notes.length > 0 && (
                    <span className="text-yellow-400">📝 {task.notes.length}</span>
                  )}
                </div>
                {task.dueDate && (
                  <div className="mt-2 text-xs text-slate-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
