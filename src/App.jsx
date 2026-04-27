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
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>ToDo Mate</h1>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

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

      <div className="filters">
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

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
            No tasks found.
          </p>
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
  );
}

export default App;
