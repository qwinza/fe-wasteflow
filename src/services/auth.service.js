import api from './api';

const signup = (nama, email, password, alamat, role, locationId) => {
  return api.post('/auth/signup', {
    nama,
    email,
    password,
    alamat,
    role,
    locationId
  });
};

const login = async (email, password) => {
  const response = await api.post('/auth/signin', {
    email,
    password
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default authService;
