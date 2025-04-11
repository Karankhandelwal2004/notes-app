import React, { useState, useEffect } from 'react';

const NoteForm = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }

    onSubmit({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">{initialData?._id ? 'Update' : 'Add'} Note</button>
      {initialData?._id && <button onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default NoteForm;
