const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // Auth
  signup: async (userData) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Projects
  getProjects: async () => {
    const response = await fetch(`${API_URL}/projects`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getProject: async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  createProject: async (projectData) => {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    return response.json();
  },

  updateProject: async (id, projectData) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    return response.json();
  },

  deleteProject: async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  addProjectMember: async (projectId, userId) => {
    const response = await fetch(`${API_URL}/projects/${projectId}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  // Tasks
  getTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/tasks${queryParams ? `?${queryParams}` : ''}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  createTask: async (taskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return response.json();
  },

  updateTask: async (id, taskData) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return response.json();
  },

  assignTask: async (id, userId) => {
    const response = await fetch(`${API_URL}/tasks/${id}/assign`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  deleteTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};
