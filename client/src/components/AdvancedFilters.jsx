const AdvancedFilters = ({ filters, setFilters }) => {
  const statuses = ['To Do', 'In Progress', 'Done'];
  const priorities = ['High', 'Medium', 'Low'];
  const categories = ['General', 'Frontend', 'DevOps', 'UI', 'Testing'];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="text-sm text-slate-400">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            placeholder="Search tasks..."
            className="w-full mt-2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm text-slate-400">Status</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={!filters.status}
                onChange={() => setFilters({...filters, status: null})}
                className="w-4 h-4"
              />
              <span className="text-sm">All</span>
            </label>
            {statuses.map(status => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={filters.status === status}
                  onChange={() => setFilters({...filters, status})}
                  className="w-4 h-4"
                />
                <span className="text-sm">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-sm text-slate-400">Priority</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="priority"
                checked={!filters.priority}
                onChange={() => setFilters({...filters, priority: null})}
                className="w-4 h-4"
              />
              <span className="text-sm">All</span>
            </label>
            {priorities.map(priority => (
              <label key={priority} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  checked={filters.priority === priority}
                  onChange={() => setFilters({...filters, priority})}
                  className="w-4 h-4"
                />
                <span className="text-sm">{priority}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm text-slate-400">Category</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => setFilters({...filters, category: null})}
                className="w-4 h-4"
              />
              <span className="text-sm">All</span>
            </label>
            {categories.map(category => (
              <label key={category} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => setFilters({...filters, category})}
                  className="w-4 h-4"
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.status || filters.priority || filters.category || filters.search) && (
          <button
            onClick={() => setFilters({status: null, priority: null, category: null, search: ''})}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-700 transition"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilters;
