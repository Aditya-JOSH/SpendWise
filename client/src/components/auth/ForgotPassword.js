import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful password reset request
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <div className="logo-icon">💰</div>
              <span>SpendWise</span>
            </div>
            <h2>Check Your Email</h2>
            <p>We've sent password reset instructions to your email address</p>
          </div>

          <div className="success-message">
            <CheckCircle size={48} />
            <h3>Reset Email Sent</h3>
            <p>
              Please check your email inbox and follow the instructions to reset your password. 
              The link will expire in 1 hour.
            </p>
          </div>

          <div className="auth-footer">
            <p>
              Didn't receive the email? 
              <button 
                className="auth-link"
                onClick={() => setIsSubmitted(false)}
              >
                Try again
              </button>
            </p>
            <p>
              <Link to="/login" className="auth-link">
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <div className="logo-icon">💰</div>
            <span>SpendWise</span>
          </div>
          <h2>Forgot Password?</h2>
          <p>No worries! Enter your email and we'll send you reset instructions</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

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

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner small"></div>
                Sending reset email...
              </>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password? 
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
          <p>
            Don't have an account? 
            <Link to="/register" className="auth-link">
              Create one here
            </Link>
          </p>
        </div>

        <div className="help-text">
          <h4>Need Help?</h4>
          <p>
            If you're having trouble accessing your account, please contact our support team. 
            We're here to help you get back on track with your financial goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
