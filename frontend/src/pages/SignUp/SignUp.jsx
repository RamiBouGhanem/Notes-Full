import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation checks before making the API call
    if (!name) {
      setError('Please enter your name');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setError(''); // Clear any previous errors

    // Sign-up API call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle register success response
      if (response.data && response.data.accessToken) {
        // Store the accessToken in localStorage to keep the user logged in
        localStorage.setItem("Token", response.data.accessToken);

        // Navigate to the dashboard after successful sign-up
        navigate('/dashboard');
      } else {
        // Handle case where no accessToken is returned
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      // Handle any errors during sign-up
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display API error message
      } else {
        console.error(error);
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className='bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl'>
        <h2 className='text-3xl font-semibold text-center text-white mb-8'>Sign Up</h2>
        <form onSubmit={handleSignUp} className='space-y-6'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-200'>Name</label>
            <input
              type='text'
              id='name'
              placeholder='Enter your name'
              className='w-full p-3 mt-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-700'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-200'>Email</label>
            <input
              type='text'
              id='email'
              placeholder='Enter your email'
              className='w-full p-3 mt-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-700'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-200'>Password</label>
            <PasswordInput
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className='text-red-500 text-xs'>{error}</p>}

          <button
            type='submit'
            className='w-full py-3 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Create Account
          </button>

          <div className='text-center text-sm mt-4'>
            <p className='text-gray-200'>
              Already have an account?{' '}
              <Link to='/login' className='font-medium text-blue-400 hover:underline'>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
