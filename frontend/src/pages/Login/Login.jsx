import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("Token", response.data.accessToken);
        navigate('/dashboard');
      }
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">R@mi Notes</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-700"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>

          <div className="text-center text-sm mt-4">
            <p className="text-gray-200">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-400 hover:underline">
                Create an Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
