// src/apiCalls.js
import api from './api';

const apiCall = async (method, url, data = {}, params = {}) => {
  try {
    const response = await api({
      method: method,
      url: url,
      data: data,
      params: params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiCall;
