// utils/authUtils.js
import apiCalls from 'apicall';
import { handleSessionExpiration } from './sessionUtils';
// Import your session expiration handler

export const refreshToken = async (tokenId, userName) => {
  try {
    const result = await apiCalls('get', `/user/getRefreshToken?tokenId=${tokenId}&userName=${userName}`);
    const { newToken } = result.data.paramObjectsMap.refreshToken.token;

    // Update the token in localStorage
    localStorage.setItem('token', newToken);

    console.log('RefreshToken Called:');
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    // If refresh token request fails, handle session expiration
    handleSessionExpiration();
    throw error;
  }
};
