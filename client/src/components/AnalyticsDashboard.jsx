const AnalyticsDashboard = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    byStatus: {
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': tasks.filter(t => t.status === 'Done').length
    },
    byPriority: {
      'High': tasks.filter(t => t.priority === 'High').length,
      'Medium': tasks.filter(t => t.priority === 'Medium').length,
      'Low': tasks.filter(t => t.priority === 'Low').length
    },
    totalTimeSpent: tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0),
    totalEstimated: tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0),
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) : 0,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length
  };

  const categories = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const StatBox = ({ title, value, subtext, color }) => (
    <div className={`rounded-xl border border-white/10 ${color} p-6`}>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox title="Total Tasks" value={stats.total} color="bg-slate-900/50" />
        <StatBox title="Completion Rate" value={`${stats.completionRate}%`} color="bg-emerald-500/10" />
        <StatBox title="Overdue" value={stats.overdue} color="bg-red-500/10" />
        <StatBox title="In Progress" value={stats.byStatus['In Progress']} color="bg-blue-500/10" />
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats.byStatus).map(([status, count]) => {
          const colors = {
            'To Do': 'border-slate-500/50 bg-slate-500/10 text-slate-300',
            'In Progress': 'border-blue-500/50 bg-blue-500/10 text-blue-300',
            'Done': 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
          };
          return (
            <div key={status} className={`rounded-xl border p-6 ${colors[status]}`}>
              <p className="font-semibold text-lg">{status}</p>
              <p className="text-3xl font-bold mt-2">{count}</p>
              <div className="mt-4 bg-black/20 rounded h-2">
                <div
                  className="h-2 rounded bg-current"
                  style={{ width: `${(count / stats.total) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Priority Distribution */}
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
        <h3 className="font-semibold text-lg mb-4">Priority Distribution</h3>
        <div className="space-y-3">
          {Object.entries(stats.byPriority).map(([priority, count]) => {
            const colors = {
              'High': 'bg-red-500/30',
              'Medium': 'bg-amber-500/30',
              'Low': 'bg-emerald-500/30'
            };
            return (
              <div key={priority}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{priority}</span>
                  <span className="text-sm text-slate-400">{count} tasks</span>
                </div>
                <div className="bg-slate-800 rounded h-3">
                  <div
                    className={`h-3 rounded ${colors[priority]} transition-all`}
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-blue-500/10 p-6">
          <p className="text-slate-400">Time Spent</p>
          <p className="text-3xl font-bold text-blue-300 mt-2">{stats.totalTimeSpent}m</p>
          <p className="text-sm text-slate-400 mt-2">Hours: {(stats.totalTimeSpent / 60).toFixed(1)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-purple-500/10 p-6">
          <p className="text-slate-400">Estimated Total</p>
          <p className="text-3xl font-bold text-purple-300 mt-2">{stats.totalEstimated}m</p>
          <p className="text-sm text-slate-400 mt-2">Hours: {(stats.totalEstimated / 60).toFixed(1)}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
        <h3 className="font-semibold text-lg mb-4">Tasks by Category</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(categories).map(([category, count]) => (
            <div key={category} className="rounded-lg bg-slate-800 px-4 py-2">
              <p className="text-sm">{category}: <span className="font-semibold text-cyan-300">{count}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
