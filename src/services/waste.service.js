import api from './api';

// Categories
const getCategories = () => api.get('/categories');
const createCategory = (data) => api.post('/categories', data);

// Locations
const getLocations = () => api.get('/locations');
const createLocation = (data) => api.post('/locations', data);

// Deposits
const createDeposit = (userId, categoryId, locationId, berat, namaSampah) => {
  return api.post('/deposits', {
    userId,
    categoryId,
    locationId,
    berat,
    namaSampah
  });
};
const getDepositsByUser = (userId) => api.get(`/deposits/user/${userId}`);
const getDepositsByLocation = (locationId) => api.get(`/deposits/filter/tps/${locationId}`);
const getAllDeposits = () => api.get('/deposits');

// Reports & Recommendations
const getCapacityReport = (locationId) => api.get(`/reports/capacity/${locationId}`);
const getRecommendations = (userId) => api.get(`/recommendations/${userId}`);

// Feedback
const createFeedback = (data) => api.post('/feedbacks', data);
const getAllFeedbacks = () => api.get('/feedbacks');

// Outbound
const createOutbound = (data) => api.post('/outbounds', data);

const wasteService = {
  getCategories,
  createCategory,
  getLocations,
  createLocation,
  createDeposit,
  getDepositsByUser,
  getDepositsByLocation,
  getAllDeposits,
  getCapacityReport,
  getRecommendations,
  createFeedback,
  getAllFeedbacks,
  createOutbound
};

export default wasteService;
