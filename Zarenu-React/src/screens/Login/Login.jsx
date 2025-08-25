import React, { useState, useEffect } from "react";
import "./login.css";
import { signInUser, isAuthenticated, getStoredUser } from '../../lib/api'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
    apple: false
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    // Debug logging
    console.log('=== GOOGLE SIGN-IN DEBUG ===');
    console.log('Client ID:', GOOGLE_CLIENT_ID);
    console.log('Is Client ID set?', !!GOOGLE_CLIENT_ID);
    console.log('Is placeholder?', GOOGLE_CLIENT_ID === 'your_actual_google_client_id_here');
    
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        console.log('Google SDK found, initializing...');
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false, // Disable FedCM to ensure popup shows
          });
          
          // Render the official Google Sign-In button
          const buttonDiv = document.getElementById('google-signin-button');
          if (buttonDiv) {
            window.google.accounts.id.renderButton(buttonDiv, {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              width: '100%',
              logo_alignment: 'left'
            });
            console.log('Google button rendered successfully');
          } else {
            console.error('google-signin-button div not found');
          }
          
          console.log('Google Sign-In initialized successfully');
        } catch (error) {
          console.error('Error initializing Google Sign-In:', error);
        }
      } else {
        console.log('Google Identity Services not loaded yet');
      }
    };

    // Load Google Identity Services script if not already loaded
    if (!window.google) {
      console.log('Loading Google SDK...');
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google SDK script loaded');
        initializeGoogleSignIn();
      };
      script.onerror = () => {
        console.error('Failed to load Google SDK script');
      };
      document.head.appendChild(script);
    } else {
      console.log('Google SDK already loaded');
      initializeGoogleSignIn();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");
    
    try {
      const result = await signInUser(formData.email, formData.password);
      console.log('Login successful!', result);
      
      setSuccessMessage("Login successful! Redirecting...");
      
      // Redirect to dashboard or home page
      setTimeout(() => {
        window.location.href = "/dashboard"; 
      }, 1500);
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ general: error.message });
    }
    
    setIsLoading(false);
  };

  // Helper function to decode JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return {};
    }
  };

  // Backend authentication function
  const authenticateWithBackend = async (authData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/social/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.success) {
        // Store authentication data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('isNewUser', data.data.is_new_user.toString());
        localStorage.setItem('provider', data.data.provider);
        
        return {
          success: true,
          token: data.data.token,
          user: data.data.user,
          isNewUser: data.data.is_new_user,
          provider: data.data.provider,
          message: data.message
        };
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Backend authentication error:', error);
      throw error;
    }
  };

  // Real Google Sign-In handler
  const handleGoogleSignIn = async (credentialResponse) => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    setErrors({});
    setSuccessMessage("");
    
    try {
      console.log('Google credential response:', credentialResponse);
      
      // Decode the JWT token to get user info
      const userInfo = parseJwt(credentialResponse.credential);
      console.log('User info from token:', userInfo);
      
      
      const authData = {
        provider: 'google',
        access_token: credentialResponse.credential,
        user_data: {
          email: userInfo.email,
          first_name: userInfo.given_name,
          last_name: userInfo.family_name,
          picture: userInfo.picture,
          id: userInfo.sub
        }
      };
      
      const result = await authenticateWithBackend(authData);
      
      if (result.success) {
        const userName = result.user.user?.first_name || result.user.first_name || 'User';
        const welcomeMessage = result.isNewUser 
          ? `Welcome to Zare Nu, ${userName}! Your account has been created.`
          : `Welcome back, ${userName}!`;
        
        setSuccessMessage(welcomeMessage);
        console.log('Google login successful:', result);
        
        // Redirect based on whether user is new or returning
        const redirectPath = result.isNewUser ? "/onboarding" : "/dashboard";
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 2000);
      }
      
    } catch (error) {
      console.error('Google login failed:', error);
      setErrors({ 
        general: `Google sign-in failed. ${error.message || 'Please try again.'}` 
      });
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  // Trigger Google Sign-In popup
  const handleGoogleButtonClick = () => {
    if (window.google && window.google.accounts) {
      setSocialLoading(prev => ({ ...prev, google: true }));
      
      // Clear any errors
      setErrors({});
      
      // Create a temporary div for the Google button
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);
      
      // Render Google Sign-In button and auto-click it
      window.google.accounts.id.renderButton(tempDiv, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: 300
      });
      
      // Auto-click the rendered button to show popup
      setTimeout(() => {
        const googleButton = tempDiv.querySelector('div[role="button"]');
        if (googleButton) {
          googleButton.click();
        } else {
          // Fallback: try prompt method
          window.google.accounts.id.prompt((notification) => {
            console.log('Google prompt notification:', notification);
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              setSocialLoading(prev => ({ ...prev, google: false }));
              setErrors({ general: 'Google Sign-In popup was blocked. Please allow popups and try again.' });
            }
          });
        }
        // Clean up temp div
        document.body.removeChild(tempDiv);
      }, 100);
      
    } else {
      setErrors({ general: 'Google Sign-In is not available. Please refresh the page and try again.' });
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };
  
  const handleSocialLogin = async (provider) => {
    if (provider === 'Google') {
      handleGoogleButtonClick();
      return;
    }
    
    // Keep your existing logic for Facebook and Apple
    const providerLower = provider.toLowerCase();
    
    setSocialLoading(prev => ({
      ...prev,
      [providerLower]: true
    }));
    
    setErrors({});
    setSuccessMessage("");
    
    try {
      console.log(`${provider} login not implemented yet - using mock data for now`);
      // You can implement Facebook and Apple login later
      throw new Error(`${provider} login coming soon!`);
      
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setErrors({ 
        general: `${provider} sign-in failed. ${error.message || 'Please try again.'}` 
      });
    } finally {
      setSocialLoading(prev => ({
        ...prev,
        [providerLower]: false
      }));
    }
  };

  return (
    <div className="login-container">
        {/* Background Elements */}
        <div className="background-pattern">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>

        <div className="login-wrapper">
          {/* Left Side - Branding */}
          <div className="branding-section">
            <div className="brand-header">
              <a href="/" className="brand-logo-link">
                <img
                  className="brand-logo-img"
                  alt="Zare Nu Logo"
                  src="/img/logo-3.png"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="brand-logo-fallback">
                  <span>ZN</span>
                </div>
              </a>
              <h1 className="brand-title">Welcome to Zare Nu</h1>
              <p className="brand-subtitle">
                Connect with meaningful volunteer opportunities across Ethiopia
              </p>
            </div>
            
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon feature-icon-red">
                  <span>🤝</span>
                </div>
                <div className="feature-content">
                  <h3>Connect & Volunteer</h3>
                  <p>Find opportunities that match your skills</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon feature-icon-blue">
                  <span>🌍</span>
                </div>
                <div className="feature-content">
                  <h3>Make an Impact</h3>
                  <p>Create positive change in communities</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon feature-icon-green">
                  <span>📈</span>
                </div>
                <div className="feature-content">
                  <h3>Track Progress</h3>
                  <p>Monitor your volunteer journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="form-section">
            <div className="form-card">
              {/* Mobile Logo */}
              <div className="mobile-header">
                <a href="/" className="mobile-logo-link">
                  <img
                    className="mobile-logo-img"
                    alt="Zare Nu Logo"
                    src="/img/logo-3.png"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="mobile-logo-fallback">
                    <span>ZN</span>
                  </div>
                </a>
                <h2>Welcome Back</h2>
              </div>

              <div className="desktop-header">
                <h2>Log In</h2>
                <p>Welcome back! Please sign in to your account</p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div style={{
                  color: '#10B981',
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: '#D1FAE5',
                  border: '1px solid #A7F3D0',
                  marginBottom: '16px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  ✅ {successMessage}
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="social-buttons">
                {/* Google Sign-In Button */}
                <div id="google-signin-button"></div>
                
                <button
                  onClick={() => handleSocialLogin('Google')}
                  className="social-btn social-btn-google"
                  type="button"
                  disabled={socialLoading.google || isLoading}
                  style={{ display: 'none' }} 
                >
                  {socialLoading.google ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Connecting to Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="social-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSocialLogin('Facebook')}
                  className="social-btn social-btn-facebook"
                  type="button"
                  disabled={socialLoading.facebook || isLoading}
                >
                  {socialLoading.facebook ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Connecting to Facebook...</span>
                    </>
                  ) : (
                    <>
                      <svg className="social-icon" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>Continue with Facebook</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSocialLogin('Apple')}
                  className="social-btn social-btn-apple"
                  type="button"
                  disabled={socialLoading.apple || isLoading}
                >
                  {socialLoading.apple ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Connecting to Apple...</span>
                    </>
                  ) : (
                    <>
                      <svg className="social-icon" fill="#000000" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <span>Continue with Apple</span>
                    </>
                  )}
                </button>
              </div>

              
              <div className="divider">
                <span>Or continue with email</span>
              </div>

              <div className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={isLoading || Object.values(socialLoading).some(loading => loading)}
                  />
                  {errors.email && (
                    <div className="error-message">
                      <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input password-input ${errors.password ? 'form-input-error' : ''}`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoading || Object.values(socialLoading).some(loading => loading)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isLoading || Object.values(socialLoading).some(loading => loading)}
                    >
                      {showPassword ? (
                        <svg className="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="error-message">
                      <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="form-options">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-label">Remember me</span>
                  </label>
                  <a href="/forgot-password" className="forgot-password">
                    Forgot password?
                  </a>
                </div>
                
                {errors.general && (
                  <div style={{
                    color: '#ef4444',
                    padding: '12px',
                    borderRadius: '6px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    marginBottom: '16px',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {errors.general}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || Object.values(socialLoading).some(loading => loading)}
                  className="login-btn"
                >
                  {isLoading ? (
                    <>
                      <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="signup-link">
                <p>
                  Don&apos;t have an account?{' '}
                  <a href="/sign-up">Create account</a>
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="trust-indicator">
              <p>🔒 Secured by 256-bit SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    
  );
}