// lib/api.js - Django backend integration
import axios from 'axios'

// Django backend URL (will update when we deploy Django)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

//  auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Token ${token}` 
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Contact form submission

export const submitContactForm = async (formData) => {
  try {
    console.log('=== CONTACT FORM DEBUG ===');
    console.log('Form data received:', formData);
    
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      message: formData.message
    };
    
    console.log('Payload being sent:', payload);
    console.log('API URL:', `${API_BASE_URL}/contact/`);

    const response = await fetch(`${API_BASE_URL}/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      // Get response as text first to see what we actually received
      const responseText = await response.text();
      console.log('Error response text:', responseText);
      
      // Try to parse as JSON if it looks like JSON, otherwise use the text
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.log('Error response data (parsed JSON):', errorData);
      } catch (parseError) {
        console.log('Response is not JSON, using text instead');
        errorData = { error: responseText };
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Success response:', data);
    return data;
  } catch (error) {
    console.error('Contact form submission error:', error);
    throw error;
  }
};

// User signup
export const signUpUser = async (userData) => {
  try {
    console.log('Signing up user:', userData);
    
    const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        first_name: userData.name.split(' ')[0] || '',
        last_name: userData.name.split(' ').slice(1).join(' ') || '',
        phone: userData.phone,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    // Store auth token
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// User login
export const signInUser = async (email, password) => {
  try {
    console.log('Signing in user:', { email });

    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store auth token
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Updated Social login function
export const signInWithProvider = async (provider) => {
  try {
    const providerName = provider.toLowerCase();
    
    // Handle different providers
    switch (providerName) {
      case 'google':
        return await handleGoogleSignIn();
      case 'facebook':
        return await handleFacebookSignIn();
      case 'apple':
        return await handleAppleSignIn();
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`${provider} login error:`, error);
    throw error;
  }
};

// Google Sign-In handler
const handleGoogleSignIn = async () => {
  return new Promise((resolve, reject) => {
    // Check if Google API is loaded
    if (typeof google === 'undefined' || !google.accounts) {
      // For testing/demo, use mock data
      console.log('Google SDK not loaded, using mock data for testing');
      const mockData = {
        provider: 'google',
        access_token: 'mock_google_token_' + Date.now(),
        user_data: {
          email: 'user@gmail.com',
          first_name: 'John',
          last_name: 'Doe',
          picture: 'https://via.placeholder.com/150',
          id: 'google_' + Date.now()
        }
      };
      authenticateWithBackend(mockData).then(resolve).catch(reject);
      return;
    }
    
    // Real Google Sign-In implementation
    try {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id',
        callback: async (response) => {
          try {
            const authData = {
              provider: 'google',
              access_token: response.credential,
              user_data: {} // Will be extracted from JWT on backend
            };
            
            const result = await authenticateWithBackend(authData);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      });
      
      google.accounts.id.prompt();
    } catch (error) {
      reject(new Error('Google Sign-In initialization failed: ' + error.message));
    }
  });
};

// Facebook Sign-In handler
const handleFacebookSignIn = async () => {
  return new Promise((resolve, reject) => {
    // Check if Facebook SDK is loaded
    if (typeof FB === 'undefined') {
      // For testing/demo, use mock data
      console.log('Facebook SDK not loaded, using mock data for testing');
      const mockData = {
        provider: 'facebook',
        access_token: 'mock_facebook_token_' + Date.now(),
        user_data: {
          email: 'user@facebook.com',
          first_name: 'Jane',
          last_name: 'Smith',
          picture: 'https://via.placeholder.com/150',
          id: 'facebook_' + Date.now()
        }
      };
      authenticateWithBackend(mockData).then(resolve).catch(reject);
      return;
    }
    
    // Real Facebook Sign-In implementation
    FB.login((response) => {
      if (response.authResponse) {
        FB.api('/me', { fields: 'name,email,picture,first_name,last_name' }, async (userInfo) => {
          try {
            const authData = {
              provider: 'facebook',
              access_token: response.authResponse.accessToken,
              user_data: {
                ...userInfo,
                picture: userInfo.picture?.data?.url || ''
              }
            };
            
            const result = await authenticateWithBackend(authData);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      } else {
        reject(new Error('Facebook login was cancelled'));
      }
    }, { scope: 'email' });
  });
};

// Apple Sign-In handler
const handleAppleSignIn = async () => {
  return new Promise((resolve, reject) => {
    // Check if Apple ID is available
    if (typeof AppleID === 'undefined') {
      // For testing/demo, use mock data
      console.log('Apple SDK not loaded, using mock data for testing');
      const mockData = {
        provider: 'apple',
        access_token: 'mock_apple_token_' + Date.now(),
        user_data: {
          email: 'user@icloud.com',
          first_name: 'Alex',
          last_name: 'Johnson',
          id: 'apple_' + Date.now()
        }
      };
      authenticateWithBackend(mockData).then(resolve).catch(reject);
      return;
    }
    
    // Real Apple Sign-In implementation
    AppleID.auth.signIn()
      .then(async (data) => {
        try {
          const authData = {
            provider: 'apple',
            access_token: data.authorization.id_token,
            user_data: {
              first_name: data.user?.name?.firstName || '',
              last_name: data.user?.name?.lastName || '',
              email: data.user?.email || ''
            }
          };
          
          const result = await authenticateWithBackend(authData);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      })
      .catch((error) => {
        reject(new Error('Apple Sign-In failed: ' + error));
      });
  });
};

// Authenticate with Django backend
const authenticateWithBackend = async (authData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/social/login/`, {
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

// Sign out
export const signOut = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      await fetch(`${API_BASE_URL}/auth/social/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    //  clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isNewUser');
    localStorage.removeItem('provider');
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get user info');
    }
    
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.data));
      return data.data;
    } else {
      throw new Error(data.error || 'Failed to get user profile');
    }
  } catch (error) {
    console.error('Get current user error:', error);
    // Clear invalid token
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    throw error;
  }
}

// Get volunteer opportunities
export const getOpportunities = async () => {
  try {
    const response = await api.get('/profiles/opportunities/')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch opportunities')
  }
}

// Helper functions for authentication state
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Initialize social SDKs (call this in your main App component)
export const initializeSocialSDKs = () => {
  // Initialize Google Sign-In
  const initGoogle = () => {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id',
      });
    }
  };
  
  // Initialize Facebook SDK
  const initFacebook = () => {
    if (typeof FB !== 'undefined') {
      FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID || 'your_facebook_app_id',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    }
  };
  
  // Initialize Apple Sign-In
  const initApple = () => {
    if (typeof AppleID !== 'undefined') {
      AppleID.auth.init({
        clientId: import.meta.env.VITE_APPLE_SERVICE_ID || 'your_apple_service_id',
        scope: 'name email',
        redirectURI: window.location.origin,
        usePopup: true
      });
    }
  };
  
  // Try to initialize, but don't fail if SDKs aren't loaded
  try {
    initGoogle();
  } catch (error) {
    console.log('Google SDK not available, using mock data for testing');
  }
  
  try {
    initFacebook();
  } catch (error) {
    console.log('Facebook SDK not available, using mock data for testing');
  }
  
  try {
    initApple();
  } catch (error) {
    console.log('Apple SDK not available, using mock data for testing');
  }
};

export default api