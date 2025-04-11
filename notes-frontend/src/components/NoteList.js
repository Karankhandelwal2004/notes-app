import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NoteList = ({ onEdit }) => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔁 Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/notes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("📄 Notes fetched:", res.data);
        setNotes(res.data);
      } catch (err) {
        console.error('❌ Error fetching notes:', err.response?.data?.message || err.message);
      }
    };

    fetchNotes();
  }, []);

  // 🗑 Delete note
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🗑️ Delete response:", res.data);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error('❌ Error deleting note:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  // 🔍 Filter notes safely (prevents crash on undefined)
  const filteredNotes = notes.filter((note) =>
    (note?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="note-list">
      <h2>All Notes</h2>

      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />

      {filteredNotes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        filteredNotes.map((note) => (
          <div className="note-card" key={note._id}>
            <h3>{note.title || 'Untitled'}</h3>
            <p>{note.content || 'No content'}</p>
            <div className="note-buttons">
              <button onClick={() => onEdit(note)}>Edit</button>
              <button onClick={() => handleDelete(note._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteList;
