import React from 'react';
import { getInitials } from '../../utils/helper';

const ProfileInfo = ({ onLogout, userInfo }) => {
  return (
    <>
      {userInfo ? (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
            {getInitials(userInfo.fullName)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">{userInfo.fullName}</p>
            <button className="text-sm text-gray-300 underline" onClick={onLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-700">Loading...</p>
      )}
    </>
  );
};

export default ProfileInfo;
