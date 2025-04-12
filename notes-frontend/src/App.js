import React, { useState, useEffect } from 'react';
import API from './utils/api'; // ✅ Use central API file
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import Login from './components/Login';
import Register from './Register';
import exportToPDF from './utils/exportToPDF';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    // Handle dark mode toggle
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
  
    if (token) {
      setIsLoggedIn(true);
      if (userData) setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false); // If no token, set logged in state to false
    }
  
    // Fetch notes if logged in
    if (isLoggedIn && token) {
      API.get('/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setNotes(res.data))
        .catch((err) => {
          console.error('❌ Error fetching notes:', err);
          if (err.response?.status === 401) logout();
        });
    }
  }, [darkMode, isLoggedIn]); // Re-run when darkMode or isLoggedIn changes
  

  const fetchNotes = (token) => {
    API.get('/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setNotes(res.data))
      .catch((err) => {
        console.error('❌ Error fetching notes:', err);
        if (err.response?.status === 401) logout();
      });
  };

  const handleAddNote = (note) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const url = editingNote ? `/api/notes/${editingNote._id}` : '/api/notes';
    const method = editingNote ? 'put' : 'post';

    API({
      method,
      url,
      data: note,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (editingNote) {
          setNotes((prev) => prev.map((n) => (n._id === editingNote._id ? res.data : n)));
          setEditingNote(null);
        } else {
          setNotes((prev) => [res.data, ...prev]);
        }
      })
      .catch((err) => {
        console.error('❌ Note save error:', err);
      });
  };

  const handleDeleteNote = (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    API.delete(`/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setNotes((prev) => prev.filter((note) => note._id !== id)))
      .catch((err) => console.error(err));
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
  };

  const handleLoginSuccess = (token, userInfo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setIsLoggedIn(true);
    setUser(userInfo);
    fetchNotes(token);
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setNotes([]);
  };

  return (
    <div className="App">
      <div className="toggle-theme">
        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <h1>My Notes</h1>

      {isLoggedIn ? (
        <>
          <NoteForm
            onSubmit={handleAddNote}
            initialData={editingNote || { title: '', content: '' }}
            onCancel={() => setEditingNote(null)}
          />
          <div className="user-info">
            <p>
              Welcome, <strong>{user?.name || 'User'}</strong>
            </p>
            <div className="action-buttons">
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
              <button className="export-btn" onClick={() => exportToPDF(notes)}>
                📄 Export to PDF
              </button>
            </div>
          </div>
          <NoteList notes={notes} onDelete={handleDeleteNote} onEdit={handleEditNote} />
        </>
      ) : showRegister ? (
        <>
          <Register onRegister={() => setShowRegister(false)} />
          <p className="toggle-link">
            Already have an account?{' '}
            <button className="toggle-btn" onClick={() => setShowRegister(false)}>
              Login
            </button>
          </p>
        </>
      ) : (
        <>
          <Login onLogin={handleLoginSuccess} />
          <p className="toggle-link">
            Don’t have an account?{' '}
            <button className="toggle-btn" onClick={() => setShowRegister(true)}>
              Register
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;
