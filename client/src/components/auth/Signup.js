import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, error, clearError, isAuthenticated } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password
    });
    if (result.success) navigate('/');
    setIsSubmitting(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <div className="logo">
            <div className="logo-icon">💰</div>
            <span>SpendWise</span>
          </div>
          <h2>Create Your Account</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-group">
              <User size={20} />
              <input
                type="text"
                id="name"
                {...register('name', { 
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <span className="error">
                <AlertCircle size={14} />
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <Mail size={20} />
              <input
                type="email"
                id="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <span className="error">
                <AlertCircle size={14} />
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error">
                <AlertCircle size={14} />
                {errors.password.message}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
