import api from './api';

const getRewards = () => api.get('/rewards');
const createReward = (data) => api.post('/rewards', data);
const updateReward = (id, data) => api.put(`/rewards/${id}`, data);
const deleteReward = (id) => api.delete(`/rewards/${id}`);
const redeemReward = (id, userId) => api.post(`/rewards/${id}/redeem?userId=${userId}`);
const getUserRedemptions = (userId) => api.get(`/rewards/redemptions/user/${userId}`);

// TODO: Connect to backend endpoint when available.
// Expected endpoint: GET /api/v1/rewards/redemptions (all redemptions, admin only)
// This should return a list of all redemptions from all users.
const getAllRedemptions = () => api.get('/rewards/redemptions');

const rewardService = {
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  redeemReward,
  getUserRedemptions,
  getAllRedemptions,
};

export default rewardService;
