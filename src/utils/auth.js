import api from './api';

export const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

export const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserType = () => {
  return localStorage.getItem('auth_token');
};


export const fetchUserType = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await api.get('profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.user_type || null;
  } catch (error) {
    console.error('Failed to fetch user type', error);
    return null;
  }
};

