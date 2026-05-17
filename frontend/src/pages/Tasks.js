import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import Toast from '../components/Toast';
import { CalendarDays, CheckSquare, Edit2, Filter, Plus, Trash2, UserRound, X } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    project: '',
    status: '',
    assignedTo: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const projectParam = searchParams.get('project');
    if (projectParam) {
      setFilters({ ...filters, project: projectParam });
    }
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, [searchParams]);

  const fetchTasks = async () => {
    try {
      const queryParams = {};
      if (filters.project) queryParams.project = filters.project;
      if (filters.status) queryParams.status = filters.status;
      if (filters.assignedTo) queryParams.assignedTo = filters.assignedTo;

      const data = await api.getTasks(queryParams);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getApiError = (response, fallback) => {
    return response?.message || response?.errors?.[0]?.msg || fallback;
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', project: '', assignedTo: '', priority: 'medium', dueDate: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const response = await api.updateTask(editingTask._id, formData);
        if (response?.message || response?.errors) {
          setToast({ type: 'error', title: 'Task not updated', message: getApiError(response, 'Please check the task details.') });
          return;
        }
        setToast({ type: 'success', title: 'Task updated', message: `${response.title} has been updated.` });
      } else {
        const response = await api.createTask(formData);
        if (response?.message || response?.errors) {
          setToast({ type: 'error', title: 'Task not created', message: getApiError(response, 'Please check the task details.') });
          return;
        }
        setToast({ type: 'success', title: 'Task created', message: `${response.title} has been added to the work queue.` });
      }
      setShowModal(false);
      setEditingTask(null);
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      setToast({ type: 'error', title: 'Task not saved', message: 'Something went wrong while saving this task.' });
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      project: task.project?._id || '',
      assignedTo: task.assignedTo?._id || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(id);
        setToast({ type: 'success', title: 'Task deleted', message: 'The task was removed from the board.' });
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        setToast({ type: 'error', title: 'Task not deleted', message: 'Please try again.' });
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      setToast({ type: 'success', title: 'Task status updated', message: `Status changed to ${newStatus}.` });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      setToast({ type: 'error', title: 'Status not updated', message: 'Please try again.' });
    }
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';
  };

  const selectedProject = projects.find((project) => project._id === formData.project);
  const assignableUsers = selectedProject?.members?.length ? selectedProject.members : users;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-[#fbecee] text-[#B22234] ring-1 ring-[#f0b6bf]';
      case 'in-progress': return 'bg-[#eef2ff] text-[#243a73] ring-1 ring-[#c7d2fe]';
      case 'pending': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      case 'overdue': return 'bg-red-50 text-red-700 ring-1 ring-red-200';
      default: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 ring-1 ring-red-200';
      case 'medium': return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200';
      case 'low': return 'bg-[#f7f1eb] text-[#6f4e37] ring-1 ring-[#dfcab8]';
      default: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="panel px-6 py-4 text-sm font-medium text-slate-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="page-container">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="page-kicker">
              <CheckSquare size={14} />
              Tasks
            </div>
            <h1 className="section-title">Task command center</h1>
            <p className="muted-text mt-2">Prioritize delivery work, update status, and inspect due dates.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="secondary-button"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
            <button
              onClick={() => {
                setEditingTask(null);
                setFormData({ title: '', description: '', project: filters.project || '', assignedTo: '', priority: 'medium', dueDate: '' });
                setShowModal(true);
              }}
              className="primary-button"
            >
              <Plus size={20} />
              <span>New task</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="panel mb-6 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-950">Filters</h3>
                <p className="muted-text">Narrow the list by project or status.</p>
              </div>
              <button onClick={() => setShowFilters(false)} className="icon-button" aria-label="Close filters">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="field-label">Project</label>
                <select
                  value={filters.project}
                  onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                  className="field-input"
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="field-input"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="field-label">Assigned to</label>
                <select
                  value={filters.assignedTo}
                  onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                  className="field-input"
                >
                  <option value="">Anyone</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>{user.username}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchTasks}
                  className="primary-button w-full"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Task</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Project</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Assigned</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Due date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {tasks.map((task) => (
                <tr key={task._id} className="transition hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="max-w-sm">
                      <div className="text-sm font-semibold text-slate-950">{task.title}</div>
                      {task.description && (
                        <div className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{task.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{task.project?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {task.assignedTo ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#17213f] text-[11px] font-black text-white">
                          {getInitials(task.assignedTo.username)}
                        </span>
                        <span className="font-semibold">{task.assignedTo.username}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-slate-400">
                        <UserRound size={15} />
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`rounded-md border-0 px-2.5 py-1 text-xs font-bold capitalize outline-none ${getStatusColor(task.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} className="text-slate-400" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="icon-button"
                        aria-label={`Edit ${task.title}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="danger-icon-button"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {tasks.length === 0 && (
            <div className="py-16 text-center">
              <CheckSquare size={48} className="mx-auto text-slate-300" />
              <p className="mt-4 font-semibold text-slate-800">No tasks found.</p>
              <p className="muted-text">Create your first task to start tracking delivery.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17213f]/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-2xl shadow-stone-950/20">
          <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/70 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              {editingTask ? 'Edit task' : 'New task'}
            </h2>
            <p className="muted-text">Define scope, priority, and timeline.</p>
          </div>

          <button type="button" 
          onClick={() => {setShowModal(false); setEditingTask(null); resetForm();}} className="icon-button" aria-label="Close">
            <X size={17} />
      </button>
    </div>

    {/* SCROLLABLE FORM */}
    <form
      onSubmit={handleSubmit}
      className="flex-1 overflow-y-auto space-y-4 p-6"
    >
      <div>
        <label className="field-label">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="field-input"
          required
        />
      </div>

      <div>
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="field-input"
          rows="3"
        />
      </div>

      <div>
        <label className="field-label">Project</label>
        <select
          value={formData.project}
          onChange={(e) => setFormData({ ...formData, project: e.target.value })}
          className="field-input"
          required
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label">Assign member</label>
        <select
          value={formData.assignedTo}
          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          className="field-input"
        >
          <option value="">Unassigned</option>
          {assignableUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="field-input"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="field-label">Due date</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="field-input"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setShowModal(false);
            setEditingTask(null);
            resetForm();
          }}
          className="secondary-button flex-1"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button flex-1"
        >
          {editingTask ? 'Update task' : 'Create task'}
        </button>
      </div>
    </form>
  </div>
</div>
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Tasks;
