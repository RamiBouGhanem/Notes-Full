import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, onClose, getAllNotes, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || " ");
  const [content, setContent] = useState(noteData?.content || " ");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Add Note
  const addNewNote = async () => {
    try {
      const token = localStorage.getItem("Token"); // Get the token from localStorage

      if (!token) {
        return; // Prevent sending request if token is not available
      }

      const response = await axiosInstance.post(
        "/add-note",
        {
          title,
          content,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );

      if (response.data && response.data.note) {
        showToastMessage("Note added successfully");
        getAllNotes();  // Refresh the list of notes
        onClose();  // Close the modal
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const editNewNote = async () => {
    const noteId = noteData.id;
    try {
      const token = localStorage.getItem("Token"); // Get the token from localStorage

      if (!token) {
        return; // Prevent sending request if token is not available
      }

      const response = await axiosInstance.put(
        "/edit-note/" + noteId,
        {
          title,
          content,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );

      if (response.data && response.data.note) {
        showToastMessage("Note updated successfully");
        getAllNotes();  // Refresh the list of notes
        onClose();  // Close the modal
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError('Please enter a title');
      return;
    }
    if (!content) {
      setError('Please enter content');
      return;
    }
    setError(null); // Clear the error message when all fields are filled
    if (type === "edit") {
      editNewNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative flex justify-center items-center w-full max-w-lg mx-auto bg-gray-800 p-7 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        onClick={onClose}
      >
        <MdClose className="text-2xl" />
      </button>
      <form className="w-full text-white">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-300">Title</label>
          <input
            type="text"
            className="w-full mt-1 p-3 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white shadow-md focus:shadow-lg transition-shadow"
            placeholder="Note Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-300">Content</label>
          <textarea
            type="text"
            className="w-full mt-1 p-3 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white shadow-md focus:shadow-lg transition-shadow"
            rows={6}
            placeholder="Note Content"
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <div className="flex justify-center mt-6">
          <button
            type="button"
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            onClick={handleAddNote}
          >
            {type === 'edit' ? 'Update Note' : 'Add Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditNotes;
