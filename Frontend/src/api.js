// API Configuration
const API_URL = 'http://localhost:5000/api';

// ============================================
// TOKEN MANAGEMENT
// ============================================

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem('token');

// ============================================
// API CALL HELPER
// ============================================

// API call helper with authentication
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  // Register new user
  register: async (name, email, password) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setToken(data.token);
    return data;
  },

  // Login existing user
  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  // Logout user
  logout: () => {
    removeToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getToken();
  }
};

// ============================================
// TASK API
// ============================================

export const taskAPI = {
  // Get all tasks for logged-in user
  getTasks: async () => {
    return await apiCall('/tasks');
  },

  // Create new task
  createTask: async (taskData) => {
    return await apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update existing task
  updateTask: async (taskId, updates) => {
    return await apiCall(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete task
  deleteTask: async (taskId) => {
    return await apiCall(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  // Get user profile and statistics
  getProfile: async () => {
    return await apiCall('/user/profile');
  }
};
