import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import { useState } from 'react'
import Modal from "react-modal"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import addNotesImg from "../../assets/images/add-notes.svg"
import NoDataImg from '../../assets/images/no-data.png'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

 

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch,setIsSearch]=useState(false);

  const navigate = useNavigate();


  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails });
  };


  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: "add",
    message: ""
  });

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type: type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg(prev => ({
      ...prev,
      isShown: false
    }));
  };

  // get user info
  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("Token"); // Replace "Token" with the correct key if different
      const response = await axiosInstance.get("/get-user", {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token format matches server requirements
        },
      });
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const token = localStorage.getItem("Token"); // Retrieve token from localStorage
      if (!token) {
        console.log("User not authenticated. Please log in.");
        return; // If there's no token, return early
      }

      // Send the token in the Authorization header
      const response = await axiosInstance.get("/get-all-notes", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token as Bearer
        },
      });

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again later.");
      console.error(error);
    }
  };

  const deleteNote = async (data) => {
    const noteId = data.id;
    const token = localStorage.getItem("Token"); // Retrieve token
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });
      if (response.data && !response.data.error) {
        showToastMessage("Note deleted successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again later.");
    }
  };
  
  const onSearchNote = async (q) => {
    if (!q) {
      console.error("Query parameter is required.");
      return;
    }
    try {
      const token = localStorage.getItem("Token");
      const response = await axiosInstance.get("/search-notes", {
        headers: { Authorization: `Bearer ${token}` },
        params: { q },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error has occurred. Please try again later.");
      console.error(error); // Log the error for more details
    }
  };
  
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData.id;
  
    try {
      const token = localStorage.getItem("Token");
  
      if (!token) {
        console.error("No auth token found. Please log in.");
        return;
      }
  
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        {
          isPinned: !noteData.isPinned, // Toggle the pinned status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data && response.data.note) {
        // Toggle the pinned status and update UI
        const newPinnedStatus = !noteData.isPinned;
        showToastMessage(
          newPinnedStatus ? "Note pinned successfully" : "Note unpinned successfully",
          "update"
        );
        getAllNotes(); // Update the list of notes after the change
      } else {
        console.error("Failed to update pinned status", response.data);
      }
    } catch (error) {
      console.error("An unexpected error has occurred. Please try again later.");
      console.error(error);
    }
  };
  
  



  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => { }; // Optional: Cleanup function (not required here)
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className='container mx-auto'>
        <div className='grid grid-cols-3 gap-4 mt-8'>

          {allNotes.length > 0 ? (
            <div className='grid grid-cols-3 gap-4 mt-8'>
              {allNotes.map((item, index) => (
                <NoteCard
                  key={item.id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateIsPinned(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard
            imgSrc={isSearch ? NoDataImg : addNotesImg}
            message={isSearch ? `Oops no notes found matching your search.` : `Start creating your first note! Click the 'add' button to jot down your thoughts, ideas, and reminders.`}
          />
          )}

        </div>
      </div>
      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={() => { setOpenAddEditModal({ isShown: true, type: "add", data: null }) }}>
        <MdAdd className='text-[32px] text-white' />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        appElement={document.getElementById('root')}  // Or use any other root element
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => { setOpenAddEditModal({ isShown: false, type: "add", data: null }) }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home