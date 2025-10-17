import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, DollarSign } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      // Mock API call - will be replaced with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: data.email,
        name: 'John Doe'
      }));
      
      onLogin();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <DollarSign size={32} />
            <span>SpendWise</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
          <Mail size={20} />
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <input
                type="email"
                id="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <a href="#" className="auth-link">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

const Register = ({ onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock API call - will be replaced with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      localStorage.setItem('user', JSON.stringify({
        id: Date.now(),
        email: data.email,
        name: data.name
      }));
      
      onRegister();
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <DollarSign size={32} />
            <span>SpendWise</span>
          </div>
          <h2>Create Account</h2>
          <p>Sign up to start managing your finances</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-group">
              <User size={20} />
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Full name is required' })}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <span className="error">{errors.name.message}</span>}
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
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <span className="error">{errors.email.message}</span>}
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
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-group">
              <Lock size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...register('confirmPassword', { required: 'Please confirm your password' })}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="#" className="auth-link">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export { Login, Register };
