import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

function Navbar({ userInfo, onSearchNote, handleClearSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) onSearchNote(searchQuery);
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className='px-16 sticky top-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 p-4 flex items-center justify-between shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out rounded-b-lg'>
      <h2 className='text-lg font-semibold text-gray-100'>R@mi Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo onLogout={onLogout} userInfo={userInfo} />
    </div>
  );
}

export default Navbar;
