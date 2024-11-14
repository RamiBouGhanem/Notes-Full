import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { IoMdClose } from 'react-icons/io';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className='flex items-center bg-transparent border-2 border-gray-500 rounded-lg px-3 py-1'>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search..."
        className='w- bn bg-transparent text-sm text-gray-100 py-2 outline-none placeholder-gray-400'
      />
      {value && (
        <IoMdClose
          className='text-gray-300 text-lg cursor-pointer mx-2 hover:text-white'
          onClick={onClearSearch}
        />
      )}
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="text-gray-300 cursor-pointer hovwdftyer:text-white"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
