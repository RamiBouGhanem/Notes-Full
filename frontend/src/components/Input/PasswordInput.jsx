import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function PasswordInput({ value, onChange, placeholder }) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => setIsShowPassword(!isShowPassword);

  return (
    <div className='flex items-center bg-gray-200 border-2 border-gray-300 px-4 rounded-lg mb-4 shadow-lg'>
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? 'text' : 'password'}
        placeholder={placeholder || "Enter your password"}
        className='w-full text-sm bg-gray-200 py-3 px-2 mr-2 rounded-lg outline-none focus:bg-white transition-colors'
      />
      {isShowPassword ? (
        <FaRegEye
          size={20}
          className="text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={20}
          className='text-gray-600 cursor-pointer hover:text-blue-500 transition-colors'
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
}

export default PasswordInput;
