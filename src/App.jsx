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
  Filter
} from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [criticality, setCriticality] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
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

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      console.log("Attempting to add task:", newTask);
      const docRef = await addDoc(collection(db, 'tasks'), {
        text: newTask,
        completed: false,
        criticality: criticality,
        dueDate: dueDate,
        createdAt: serverTimestamp()
      });
      console.log("Task added with ID:", docRef.id);
      setNewTask('');
      setDueDate('');
      setCriticality('Medium');
    } catch (err) {
      console.error("Detailed Error adding task:", err);
      if (err.code === 'permission-denied') {
        alert("Permission denied! Please check your Firestore Security Rules.");
      } else if (err.code === 'unavailable') {
        alert("Firestore is unavailable. Check your internet connection.");
      } else {
        alert(`Failed to add task: ${err.message}. Ensure you have created the Firestore database in the Firebase Console.`);
      }
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', id), {
        completed: !currentStatus
      });
    } catch (err) {
      console.error("Error toggling task:", err);
      alert("Error updating task status. Check console for details.");
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

      <form className="input-group" onSubmit={addTask}>
        <div className="input-row">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit" className="add-btn">
            <Plus size={20} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Add
          </button>
        </div>

        <div className="input-controls">
          <select
            value={criticality}
            onChange={(e) => setCriticality(e.target.value)}
            aria-label="Criticality"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Due Date"
          />
        </div>
      </form>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
            No tasks found in this category.
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
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete Task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
