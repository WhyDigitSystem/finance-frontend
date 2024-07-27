export const handleSessionExpiration = (setSessionExpired) => {
  // Set state to show the session expired popup
  setTimeout(() => {
    setSessionExpired(true);
  }, 1000);
};
