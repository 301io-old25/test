const setAuthData = (userDetails: any) => {
  localStorage.setItem('userDetails', JSON.stringify(userDetails));
};

const getUserDetails = (): any => {
  // This function can have a try-catch for robustness, especially if the JSON is malformed
  try {
    const userDetails = localStorage.getItem('userDetails');
    return userDetails ? JSON.parse(userDetails) : null;
  } catch (error) {
    console.error('Could not parse userDetails from localStorage', error);
    // Clear corrupted data
    localStorage.removeItem('userDetails');
    return null;
  }
};

const setUserDetails = (userDetails: any) => {
  const key = 'userDetails';
  const value = JSON.stringify(userDetails);

  // 1. Set the data in localStorage
  localStorage.setItem(key, value);

  // 2. Manually dispatch a 'storage' event.
  // This is crucial to notify the AuthProvider in the SAME TAB immediately.
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: key,
      newValue: value
    })
  );
};

// Add a function to clear details on logout
const clearUserDetails = () => {
  const key = 'userDetails';

  // 1. Remove the data
  localStorage.removeItem(key);

  // 2. Dispatch event to notify other components/tabs of logout
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: key,
      newValue: null // Signal that the value is now null
    })
  );
};

const removeAuthData = () => {
  localStorage.removeItem('userDetails');
};

export {
  setAuthData,
  setUserDetails,
  getUserDetails,
  removeAuthData,
  clearUserDetails
};
