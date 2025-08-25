import React, { useState, useEffect } from "react";
import "./signup.css";
import { signUpUser } from "../../lib/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
    apple: false
  });
  const [errors, setErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize social sign-in when component mounts
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        console.log('Google SDK found, initializing for signup...');
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignUp,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false,
          });
          
          // Render the official Google Sign-Up button
          const buttonDiv = document.getElementById('google-signup-button');
          if (buttonDiv) {
            window.google.accounts.id.renderButton(buttonDiv, {
              theme: 'outline',
              size: 'large',
              text: 'signup_with',
              width: '100%',
              logo_alignment: 'left'
            });
            console.log('Google signup button rendered successfully');
          }
          
        } catch (error) {
          console.error('Error initializing Google Sign-Up:', error);
        }
      }
    };

    // Load Google Identity Services script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
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
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+251[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Ethiopian phone number";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
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
      const result = await signUpUser(formData);
      console.log('Signup successful!', result);
      
      setSuccessMessage("Account created successfully! Redirecting...");
      
      // Redirect to onboarding page
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1500);
      
    } catch (error) {
      console.error('Signup failed:', error);
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

  // Real Google Sign-Up handler
  const handleGoogleSignUp = async (credentialResponse) => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    setErrors({});
    setSuccessMessage("");
    
    try {
      console.log('Google credential response:', credentialResponse);
      
      // Decode the JWT token to get user info
      const userInfo = parseJwt(credentialResponse.credential);
      console.log('User info from token:', userInfo);
      
      // Send to your backend
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
          : `Welcome back, ${userName}! You already have an account.`;
        
        setSuccessMessage(welcomeMessage);
        console.log('Google signup successful:', result);
        
        // Always redirect to onboarding for signup page
        setTimeout(() => {
          window.location.href = "/onboarding";
        }, 2000);
      }
      
    } catch (error) {
      console.error('Google signup failed:', error);
      setErrors({ 
        general: `Google sign-up failed. ${error.message || 'Please try again.'}` 
      });
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleSocialSignUp = async (provider) => {
    const providerLower = provider.toLowerCase();
    
    if (provider === 'Google') {
      // Google signup is handled by the GoogleLogin component now
      return;
    }
    
    // Set loading state for other providers
    setSocialLoading(prev => ({
      ...prev,
      [providerLower]: true
    }));
    
    setErrors({});
    setSuccessMessage("");
    
    try {
      console.log(`${provider} signup not implemented yet`);
      throw new Error(`${provider} sign-up coming soon!`);
      
    } catch (error) {
      console.error(`${provider} signup failed:`, error);
      setErrors({ 
        general: `${provider} sign-up failed. ${error.message || 'Please try again.'}` 
      });
    } finally {
      // Clear loading state for specific provider
      setSocialLoading(prev => ({
        ...prev,
        [providerLower]: false
      }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Remove any non-digit characters except +
    value = value.replace(/[^\d+]/g, '');
    
    // If user starts typing without +251, add it
    if (value && !value.startsWith('+251')) {
      if (value.startsWith('251')) {
        value = '+' + value;
      } else if (value.startsWith('0')) {
        value = '+251' + value.substring(1);
      } else if (!value.startsWith('+')) {
        value = '+251' + value;
      }
    }
    
    // Limit length to +251 + 9 digits = 13 characters
    if (value.length > 13) {
      value = value.substring(0, 13);
    }
    
    setFormData(prev => ({ ...prev, phone: value }));
    
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const levels = [
      { strength: 0, text: "", color: "" },
      { strength: 1, text: "Very Weak", color: "#ef4444" },
      { strength: 2, text: "Weak", color: "#f97316" },
      { strength: 3, text: "Fair", color: "#eab308" },
      { strength: 4, text: "Good", color: "#22c55e" },
      { strength: 5, text: "Strong", color: "#16a34a" }
    ];
    
    return levels[score];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="signup-container">
      {/* Background Elements */}
      <div className="background-pattern">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="signup-wrapper">
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
            <h1 className="brand-title">Join Zare Nu Today</h1>
            <p className="brand-subtitle">
              Start your volunteer journey and make a meaningful impact in Ethiopian communities
            </p>
          </div>
          
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon feature-icon-red">
                <span>🚀</span>
              </div>
              <div className="feature-content">
                <h3>Quick Setup</h3>
                <p>Get started in minutes with our simple registration</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon feature-icon-blue">
                <span>🤝</span>
              </div>
              <div className="feature-content">
                <h3>Find Your Match</h3>
                <p>Connect with opportunities that fit your skills and interests</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon feature-icon-green">
                <span>🏆</span>
              </div>
              <div className="feature-content">
                <h3>Track Impact</h3>
                <p>Monitor your contributions and celebrate achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
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
              <h2>Create Account</h2>
            </div>

            <div className="desktop-header">
              <h2>Sign Up</h2>
              <p>Create your account to start volunteering</p>
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

            {/* Social Sign Up Buttons */}
            <div className="social-buttons">
              {/* Google Sign-Up Button - Using real Google button */}
              <div id="google-signup-button"></div>
              
              <button
                onClick={() => handleSocialSignUp('Facebook')}
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
                    <span>Sign up with Facebook</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSocialSignUp('Apple')}
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
                    <span>Sign up with Apple</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="divider">
              <span>Or sign up with email</span>
            </div>

            {/* Sign Up Form */}
            <div className="signup-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={isLoading || Object.values(socialLoading).some(loading => loading)}
                />
                {errors.name && (
                  <div className="error-message">
                    <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </div>
                )}
              </div>

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
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <div className="phone-input-wrapper">
                  <div className="country-code">
                    <img 
                      src="https://flagcdn.com/w20/et.png" 
                      alt="Ethiopia" 
                      className="country-flag"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                    <span className="flag-fallback" style={{ display: 'none' }}>🇪🇹</span>
                    <span className="country-text">+251</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`form-input phone-input ${errors.phone ? 'form-input-error' : ''}`}
                    placeholder="+251 9XX XXX XXX"
                    autoComplete="tel"
                    disabled={isLoading || Object.values(socialLoading).some(loading => loading)}
                  />
                </div>
                {errors.phone && (
                  <div className="error-message">
                    <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phone}
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
                    placeholder="Create a strong password"
                    autoComplete="new-password"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          backgroundColor: passwordStrength.color 
                        }}
                      ></div>
                    </div>
                    <span className="strength-text" style={{ color: passwordStrength.color }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
                
                {errors.password && (
                  <div className="error-message">
                    <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input password-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={isLoading || Object.values(socialLoading).some(loading => loading)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    disabled={isLoading || Object.values(socialLoading).some(loading => loading)}
                  >
                    {showConfirmPassword ? (
                      <svg className="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0--8.268-2.943-9.542-7z" />
                     </svg>
                   )}
                 </button>
               </div>
               {errors.confirmPassword && (
                 <div className="error-message">
                   <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                   {errors.confirmPassword}
                 </div>
               )}
             </div>

             <div className="form-options">
               <label className="checkbox-wrapper">
                 <input
                   type="checkbox"
                   checked={agreeToTerms}
                   onChange={(e) => setAgreeToTerms(e.target.checked)}
                   className="checkbox-input"
                   disabled={isLoading || Object.values(socialLoading).some(loading => loading)}
                 />
                 <span className="checkbox-label">
                   I agree to the{' '}
                   <a href="/terms" className="terms-link">Terms of Service</a>
                   {' '}and{' '}
                   <a href="/privacy" className="terms-link">Privacy Policy</a>
                 </span>
               </label>
               {errors.terms && (
                 <div className="error-message">
                   <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                   {errors.terms}
                 </div>
               )}
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
               className="signup-btn"
             >
               {isLoading ? (
                 <>
                   <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Creating Account...
                 </>
               ) : (
                 'Create Account'
               )}
             </button>
           </div>

           {/* Sign In Link */}
           <div className="signin-link">
             <p>
               Already have an account?{' '}
               <a href="/login">Sign in</a>
             </p>
           </div>
         </div>

         {/* Trust Indicators */}
         <div className="trust-indicator">
           <p>🔒 Your information is secure and encrypted</p>
         </div>
       </div>
     </div>
   </div>
 );
};