import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin, register as authRegister, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await getCurrentUser();
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authLogin(email, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        navigate(response.user.role === 'employer' ? '/employer/dashboard' : '/dashboard');
        return { success: true };
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authRegister(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        navigate(response.user.role === 'employer' ? '/employer/dashboard' : '/dashboard');
        return { success: true };
      }
      throw new Error('Registration failed. Please try again.');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isEmployer: user?.role === 'employer',
        isJobSeeker: user?.role === 'jobseeker',
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
