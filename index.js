import React, { useState, useEffect } from 'react';
import { Check, Trash2, Edit2, Plus, LogOut, User, Filter, Clock, Star, TrendingUp, Award, Zap } from 'lucide-react';
import { authAPI, taskAPI, userAPI } from './api';

export default function TaskManagerApp() {
  // State Management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('personal');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' });
  const [showWelcome, setShowWelcome] = useState(false);
  const [completedAnimation, setCompletedAnimation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    highPriority: 0
  });

  // Categories Configuration
  const categories = [
    { id: 'personal', name: 'Personal', color: 'bg-purple-100 text-purple-700 border-purple-300' },
    { id: 'work', name: 'Work', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { id: 'shopping', name: 'Shopping', color: 'bg-green-100 text-green-700 border-green-300' },
    { id: 'health', name: 'Health', color: 'bg-red-100 text-red-700 border-red-300' }
  ];

  // Check authentication on mount
  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      loadUserData();
    }
  }, []);

  // Clear completed animation
  useEffect(() => {
    if (completedAnimation) {
      const timer = setTimeout(() => setCompletedAnimation(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [completedAnimation]);

  // Load user data from API
  const loadUserData = async () => {
    try {
      setLoading(true);
      const profileData = await userAPI.getProfile();
      const tasksData = await taskAPI.getTasks();
      
      setCurrentUser(profileData.user);
      setTasks(tasksData.tasks);
      setStats(profileData.stats);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError(error.message);
      authAPI.logout();
    } finally {
      setLoading(false);
    }
  };

  // Handle authentication (login/register)
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (isRegistering) {
        data = await authAPI.register(
          loginForm.name,
          loginForm.email,
          loginForm.password
        );
      } else {
        data = await authAPI.login(loginForm.email, loginForm.password);
      }

      setCurrentUser(data.user);
      setIsLoggedIn(true);
      setShowWelcome(true);
      setLoginForm({ name: '', email: '', password: '' });
      
      await loadUserData();
      
      setTimeout(() => setShowWelcome(false), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTasks([]);
    setStats({ total: 0, active: 0, completed: 0, highPriority: 0 });
  };

  // Add new task
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      setLoading(true);
      const response = await taskAPI.createTask({
        text: newTask,
        priority: newTaskPriority,
        category: newTaskCategory
      });

      setTasks([response.task, ...tasks]);
      setNewTask('');
      setNewTaskPriority('medium');
      setNewTaskCategory('personal');
      
      await loadUserData();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
      await loadUserData();
    } catch (error) {
      setError(error.message);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id) => {
    const task = tasks.find(t => t._id === id);
    
    try {
      const response = await taskAPI.updateTask(id, {
        completed: !task.completed
      });

      setTasks(tasks.map(t => 
        t._id === id ? response.task : t
      ));

      if (!task.completed) {
        setCompletedAnimation(id);
      }

      setCurrentUser(prev => ({
        ...prev,
        totalPoints: response.user.totalPoints,
        streakCount: response.user.streakCount
      }));

      await loadUserData();
    } catch (error) {
      setError(error.message);
    }
  };

  // Save edited task
  const saveEdit = async () => {
    if (!editText.trim()) return;

    try {
      const response = await taskAPI.updateTask(editingId, {
        text: editText
      });

      setTasks(tasks.map(t => 
        t._id === editingId ? response.task : t
      ));
      
      setEditingId(null);
      setEditText('');
    } catch (error) {
      setError(error.message);
    }
  };

  // Get filtered tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    switch(filter) {
      case 'active':
        filtered = filtered.filter(t => !t.completed);
        break;
      case 'completed':
        filtered = filtered.filter(t => t.completed);
        break;
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    return filtered;
  };

  // Login/Register Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            TaskFlow Pro
          </h1>
          <p className="text-center text-gray-600 mb-6">
            {isRegistering ? 'Create your account' : 'Welcome back!'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={loginForm.name}
                  onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
            </button>

            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="w-full text-center text-sm text-gray-600 hover:text-purple-600"
            >
              {isRegistering 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (loading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredTasks = getFilteredTasks();

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      {showWelcome && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl animate-bounce z-50">
          <p className="font-bold text-lg">🎉 Welcome back, {currentUser.name}! 🎉</p>
        </div>
      )}

      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50">
          {error}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header with Gamification */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
              <p className="text-gray-600">Welcome back, {currentUser?.name}! 👋</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Gamification Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-2xl text-center border-2 border-yellow-300">
              <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-yellow-700">{currentUser?.totalPoints || 0}</div>
              <div className="text-sm text-yellow-600">Total Points</div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-2xl text-center border-2 border-orange-300">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-700">{currentUser?.streakCount || 0}</div>
              <div className="text-sm text-orange-600">Streak</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-2xl text-center border-2 border-green-300">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-700">{stats.completed}</div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-2xl text-center border-2 border-red-300">
              <Star className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-red-700">{stats.highPriority}</div>
              <div className="text-sm text-red-600">High Priority</div>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">✨ Create New Task</h2>
          <div className="space-y-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="low">🟢 Low (+5 pts)</option>
                  <option value="medium">🟡 Medium (+10 pts)</option>
                  <option value="high">🔴 High (+15 pts)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={addTask}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-xl p-4 mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Status:</span>
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  filter === f 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            
            <span className="font-semibold text-gray-700 ml-4">Category:</span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                categoryFilter === 'all' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-xl font-medium transition border-2 ${
                  categoryFilter === cat.id 
                    ? cat.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Check className="w-20 h-20 mx-auto" />
              </div>
              <p className="text-xl text-gray-600 font-semibold">No tasks found!</p>
              <p className="text-gray-500">Create a new task to get started 🚀</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <div
                  key={task._id}
                  className={`relative flex items-center gap-3 p-4 rounded-xl hover:shadow-lg transition-all duration-300 border-l-4 ${
                    task.priority === 'high' ? 'border-red-500 bg-red-50' :
                    task.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  } ${completedAnimation === task._id ? 'animate-pulse' : ''}`}
                >
                  {completedAnimation === task._id && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-xl rounded-tr-xl text-sm font-bold">
                      +{task.priority === 'high' ? 15 : task.priority === 'medium' ? 10 : 5} pts! 🎉
                    </div>
                  )}
                  
                  <button
                    onClick={() => toggleComplete(task._id)}
                    className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      task.completed
                        ? 'bg-green-500 border-green-500 shadow-lg'
                        : 'border-gray-400 hover:border-indigo-500'
                    }`}
                  >
                    {task.completed && <Check className="w-5 h-5 text-white" />}
                  </button>

                  {editingId === task._id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      className="flex-1 px-3 py-2 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1">
                      <span
                        className={`block ${
                          task.completed ? 'line-through text-gray-400' : 'text-gray-800 font-medium'
                        }`}
                      >
                        {task.text}
                      </span>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          categories.find(c => c.id === task.category)?.color
                        }`}>
                          {categories.find(c => c.id === task.category)?.name}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {editingId === task._id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(task._id);
                            setEditText(task.text);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
