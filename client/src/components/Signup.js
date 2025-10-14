import React, { useState } from 'react';
import api from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await api.post('/signup', {
        user: { name, email, password, password_confirmation: passwordConfirmation }
      });
      setSuccess('Signup successful! You can now log in.');
    } catch (err) {
      setError('Signup failed. Please check your details.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={passwordConfirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
