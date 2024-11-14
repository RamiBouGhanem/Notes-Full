import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => setInputValue(e.target.value);
  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") addNewTag();
  };
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      {tags.length > 0 && (
        <div className='flex flex-wrap items-center gap-2 mt-2'>
          {tags.map((tag, index) => (
            <span key={index} className='flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-md'>
              {tag}
              <MdClose
                className='text-blue-500 cursor-pointer hover:text-blue-800'
                onClick={() => handleRemoveTag(tag)}
              />
            </span>
          ))}
        </div>
      )}
      <div className='flex items-center gap-2 mt-4'>
        <input
          type='text'
          className='w-full bg-gray-100 border-2 border-gray-300 px-3 py-2 rounded-lg outline-none focus:border-blue-500'
          value={inputValue}
          placeholder='Add a tag...'
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className='bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 transition-colors'
          onClick={addNewTag}
        >
          <MdAdd size={20} />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
