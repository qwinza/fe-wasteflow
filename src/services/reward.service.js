import api from './api';

const getRewards = () => api.get('/rewards');
const createReward = (data) => api.post('/rewards', data);
const updateReward = (id, data) => api.put(`/rewards/${id}`, data);
const deleteReward = (id) => api.delete(`/rewards/${id}`);
const redeemReward = (id, userId) => api.post(`/rewards/${id}/redeem?userId=${userId}`);
const getUserRedemptions = (userId) => api.get(`/rewards/redemptions/user/${userId}`);

const rewardService = {
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  redeemReward,
  getUserRedemptions
};

export default rewardService;
