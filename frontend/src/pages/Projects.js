import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Toast from '../components/Toast';
import { CalendarDays, Edit2, FolderKanban, Plus, Trash2, UserPlus, Users, X } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    endDate: '',
    members: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
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
    setFormData({ name: '', description: '', status: 'active', endDate: '', members: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const response = await api.updateProject(editingProject._id, formData);
        if (response?.message || response?.errors) {
          setToast({ type: 'error', title: 'Project not updated', message: getApiError(response, 'Please check the project details.') });
          return;
        }
        setToast({ type: 'success', title: 'Project updated', message: `${response.name} is ready with the selected members.` });
      } else {
        const response = await api.createProject(formData);
        if (response?.message || response?.errors) {
          setToast({ type: 'error', title: 'Project not created', message: getApiError(response, 'Please check the project details.') });
          return;
        }
        setToast({ type: 'success', title: 'Project created', message: `${response.name} has been added to the portfolio.` });
      }
      setShowModal(false);
      setEditingProject(null);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      setToast({ type: 'error', title: 'Project not saved', message: 'Something went wrong while saving this project.' });
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      status: project.status,
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      members: project.members?.map((member) => member._id || member) || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.deleteProject(id);
        setToast({ type: 'success', title: 'Project deleted', message: 'The project was removed from your portfolio.' });
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        setToast({ type: 'error', title: 'Project not deleted', message: 'Please try again.' });
      }
    }
  };

  const toggleMember = (userId) => {
    setFormData((current) => ({
      ...current,
      members: current.members.includes(userId)
        ? current.members.filter((id) => id !== userId)
        : [...current.members, userId]
    }));
  };

  const projectThemes = [
    { bg: '#B22234', soft: '#fbecee', text: '#B22234' },
    { bg: '#243a73', soft: '#eef2ff', text: '#243a73' },
    { bg: '#6f4e37', soft: '#f7f1eb', text: '#6f4e37' },
    { bg: '#7c2d12', soft: '#fff7ed', text: '#7c2d12' },
    { bg: '#334155', soft: '#f1f5f9', text: '#334155' }
  ];

  const getProjectTheme = (project, index) => {
    const source = project._id || project.name || `${index}`;
    const score = source.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return projectThemes[score % projectThemes.length];
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-[#fbecee] text-[#B22234] ring-1 ring-[#f0b6bf]';
      case 'completed': return 'bg-[#eef2ff] text-[#243a73] ring-1 ring-[#c7d2fe]';
      case 'on-hold': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      default: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="panel px-6 py-4 text-sm font-medium text-slate-600">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="page-container">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="page-kicker">
              <FolderKanban size={14} />
              Projects
            </div>
            <h1 className="section-title">Project portfolio</h1>
            <p className="muted-text mt-2">Create, organize, and review every active delivery stream.</p>
          </div>
          <button
            onClick={() => {
              setEditingProject(null);
              resetForm();
              setShowModal(true);
            }}
            className="primary-button"
          >
            <Plus size={20} />
            <span>New project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const theme = getProjectTheme(project, index);
            return (
            <div key={project._id} className="panel relative flex min-h-80 flex-col overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-300/60">
              <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: theme.bg }} />
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-15" style={{ backgroundColor: theme.bg }} />
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-lg font-black text-white shadow-lg" style={{ backgroundColor: theme.bg }}>
                    {getInitials(project.name)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-950">{project.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: theme.text }}>Delivery stream</p>
                  </div>
                </div>
                <span className={`badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <p className="mb-6 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                {project.description || 'No project description added yet.'}
              </p>

              <div className="mb-4 flex min-h-8 items-center">
                <div className="flex -space-x-2">
                  {(project.members || []).slice(0, 4).map((member) => (
                    <span
                      key={member._id || member}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-black text-white shadow-sm"
                      style={{ backgroundColor: theme.bg }}
                      title={member.username || 'Member'}
                    >
                      {getInitials(member.username || 'U')}
                    </span>
                  ))}
                </div>
                {(project.members?.length || 0) > 4 && (
                  <span className="ml-3 text-xs font-bold text-slate-500">+{project.members.length - 4} more</span>
                )}
              </div>

              <div className="surface mt-auto grid gap-3 p-4 text-sm text-slate-600" style={{ backgroundColor: theme.soft }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2"><Users size={16} /> Members</span>
                  <span className="font-semibold text-slate-900">{project.members?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2"><CalendarDays size={16} /> End date</span>
                  <span className="font-semibold text-slate-900">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/tasks?project=${project._id}`)}
                  className="secondary-button h-10 flex-1"
                >
                  View tasks
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="icon-button"
                  aria-label={`Edit ${project.name}`}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="danger-icon-button"
                  aria-label={`Delete ${project.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
          })}
        </div>

        {projects.length === 0 && (
          <div className="panel py-16 text-center">
            <FolderKanban size={48} className="mx-auto text-slate-300" />
            <p className="mt-4 font-semibold text-slate-800">No projects found.</p>
            <p className="muted-text">Create your first project to start organizing work.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17213f]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-2xl shadow-stone-950/20 flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/70 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {editingProject ? 'Edit project' : 'New project'}
                </h2>
                <p className="muted-text">Keep portfolio details current.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingProject(null);
                  resetForm();
                }}
                className="icon-button"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 p-6">
              <div>
                <label className="field-label">Project name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <label className="field-label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="field-input"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="field-label">Project members</label>
                <div className="grid max-h-44 gap-2 overflow-y-auto rounded-md border border-stone-200 bg-stone-50 p-2">
                  {users.map((user) => (
                    <label key={user._id} className="flex cursor-pointer items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm shadow-sm">
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#17213f] text-xs font-black text-white">
                          {getInitials(user.username)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-bold text-slate-800">{user.username}</span>
                          <span className="block truncate text-xs text-slate-500">{user.email}</span>
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={formData.members.includes(user._id)}
                        onChange={() => toggleMember(user._id)}
                        className="h-4 w-4 accent-[#B22234]"
                      />
                    </label>
                  ))}
                  {users.length === 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
                      <UserPlus size={16} />
                      No users found.
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="field-label">End date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="field-input"
                />
              </div>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProject(null);
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
                  {editingProject ? 'Update project' : 'Create project'}
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

export default Projects;
