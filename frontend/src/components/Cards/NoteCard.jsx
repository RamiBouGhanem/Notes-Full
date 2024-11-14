import React from 'react';
import { MdOutlinePushPin, MdDelete, MdCreate } from 'react-icons/md';
import moment from 'moment';

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  return (
    <div className='bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 p-6 rounded-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 ease-in-out'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <h6 className='text-lg font-semibold text-white'>{title}</h6>
          <span className='text-sm text-gray-200'>{moment(date).format("Do MMM YYYY")}</span>
        </div>
        <MdOutlinePushPin
          className={`w-6 h-6 cursor-pointer ${isPinned ? 'text-yellow-300' : 'text-gray-300'}`}
          onClick={onPinNote}
        />
      </div>

      <p className='text-base text-gray-100 mt-3'>{content?.slice(0, 100)}{content?.length > 100 ? '...' : ''}</p>

      <div className='flex justify-between items-center mt-4'>
        <div className='flex flex-wrap gap-2'>
          {tags.map((item, index) => (
            <span key={index} className='text-xs text-white bg-gray-700 rounded-full px-3 py-1'>{`#${item}`}</span>
          ))}
        </div>
        <div className='flex space-x-4'>
          <MdCreate
            className='text-white hover:text-green-400 w-6 h-6 cursor-pointer transition-all duration-200 transform hover:scale-110'
            onClick={onEdit}
          />
          <MdDelete
            className='text-white hover:text-red-400 w-6 h-6 cursor-pointer transition-all duration-200 transform hover:scale-110'
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
