import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, onClose, getAllNotes,showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || " ");
  const [content, setContent] = useState(noteData?.content || " ");
  const [tags, setTags] = useState(noteData?.tags || [ ]);
  const [error, setError] = useState(null);

  //add Note
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
        showToastMessage("note added successfully");
        getAllNotes();  // Refresh the list of notes
        onClose();  // Close the modal
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };
  

  const editNewNote = async () => { 
    const noteId = noteData.id
    try {
      const token = localStorage.getItem("Token"); // Get the token from localStorage
      
      if (!token) {
        return; // Prevent sending request if token is not available
      }
  
      const response = await axiosInstance.put(
        "/edit-note/ "+ noteId, 
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
        showToastMessage("note updated successfully");
        getAllNotes();  // Refresh the list of notes
        onClose();  // Close the modal
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
      editNewNote()
    }
    else {
      addNewNote()
    }
  };

  return (
    <div className='relative' >
      <button
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500'
        onClick={onClose}
      >
        <MdClose className='text-xl text-slate-400' />
      </button>
      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input
          type='text'
          className='text-2xl text-slate-950 outline-none'
          placeholder='Go to the Gym at 5'
          value={title}
          onChange={({ target }) => setTitle(target.value)} // Update the title state variable
        />
      </div>
      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea
          type='text'
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          rows={10}
          placeholder='Content'
          value={content}
          onChange={({ target }) => setContent(target.value)} // Update the content state variable
        />
      </div>
      <div className='mt-3'>
        <label className='input-label'>TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
      <button
        className='btn-primary font-medium mt-5 p-3'
        onClick={handleAddNote}
      >
        {type === 'edit' ? 'Update': "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;