import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Sun,
  Moon,
  Plus,
  Trash2,
  Check,
  Circle,
  Filter,
  Pencil,
  X
} from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [criticality, setCriticality] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [priorityFilter, setPriorityFilter] = useState('all'); // all, High, Medium, Low
  const [dateFilter, setDateFilter] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Firestore Subscription
  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      if (editingId) {
        // Update existing task
        await updateDoc(doc(db, 'tasks', editingId), {
          text: newTask,
          description: description,
          criticality: criticality,
          dueDate: dueDate
        });
        setEditingId(null);
      } else {
        // Add new task
        await addDoc(collection(db, 'tasks'), {
          text: newTask,
          description: description,
          completed: false,
          criticality: criticality,
          dueDate: dueDate,
          createdAt: serverTimestamp()
        });
      }
      resetForm();
    } catch (err) {
      console.error("Error saving task:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const resetForm = () => {
    setNewTask('');
    setDescription('');
    setCriticality('Medium');
    setDueDate('');
    setEditingId(null);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setNewTask(task.text);
    setDescription(task.description || '');
    setCriticality(task.criticality || 'Medium');
    setDueDate(task.dueDate || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', id), {
        completed: !currentStatus
      });
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Status Filter
    const matchesStatus = filter === 'all' ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed);

    // Priority Filter
    const matchesPriority = priorityFilter === 'all' || task.criticality === priorityFilter;

    // Date Filter
    const matchesDate = !dateFilter || task.dueDate === dateFilter;

    return matchesStatus && matchesPriority && matchesDate;
  });

  const hasActiveFilters = priorityFilter !== 'all' || dateFilter !== '';

  return (
    <>
      <nav className="navbar">
        <div className="nav-content">
          <h1>ToDo Mate</h1>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </nav>

      <div className="app-container">
        <form className="input-group" onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              required
            />
            <button type="submit" className="add-btn">
              {editingId ? <Check size={20} /> : <Plus size={20} />}
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button type="button" className="theme-toggle" onClick={resetForm}>
                <X size={20} />
              </button>
            )}
          </div>

          <textarea
            placeholder="Add a description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="input-controls">
            <select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value)}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </form>

        <div className="filter-section">
          <div className="filter-header">
            <div className="status-filters">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({tasks.length})
              </button>
              <button
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({tasks.filter(t => !t.completed).length})
              </button>
              <button
                className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed ({tasks.filter(t => t.completed).length})
              </button>
            </div>

            <button
              className={`advanced-toggle-btn ${showAdvancedFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              aria-label="Toggle advanced filters"
            >
              <Filter size={18} />
              <span>Filters</span>
              {hasActiveFilters && <span className="filter-dot"></span>}
            </button>
          </div>

          {showAdvancedFilters && (
            <div className="advanced-filters">
              <div className="filter-control">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="filter-control">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                {dateFilter && (
                  <button className="clear-filter" onClick={() => setDateFilter('')}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks match your filters.</p>
              {(priorityFilter !== 'all' || dateFilter) && (
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setPriorityFilter('all');
                    setDateFilter('');
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <div className="task-main">
                    <div
                      className={`checkbox ${task.completed ? 'completed' : ''}`}
                      onClick={() => toggleTask(task.id, task.completed)}
                    >
                      {task.completed && <Check size={14} />}
                    </div>
                    <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                      {task.text}
                    </span>
                  </div>

                  {task.description && (
                    <p className={`task-desc ${task.completed ? 'completed' : ''}`}>
                      {task.description}
                    </p>
                  )}

                  <div className="task-meta">
                    <span className={`badge ${task.criticality?.toLowerCase() || 'medium'}`}>
                      {task.criticality || 'Medium'}
                    </span>
                    {task.dueDate && (
                      <span className="due-date">
                        <Filter size={12} /> {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="action-btns">
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(task)}
                    aria-label="Edit Task"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete Task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
