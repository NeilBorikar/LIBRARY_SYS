// Notification Utils - Utility functions for notifications
import { toast } from 'react-toastify';

// Show success notification
export const showSuccessNotification = (message, options = {}) => {
  return toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

// Show error notification
export const showErrorNotification = (message, options = {}) => {
  return toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

// Show info notification
export const showInfoNotification = (message, options = {}) => {
  return toast.info(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

// Show warning notification
export const showWarningNotification = (message, options = {}) => {
  return toast.warning(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

// Show loading notification
export const showLoadingNotification = (message, options = {}) => {
  return toast.loading(message, {
    position: 'top-right',
    closeOnClick: false,
    closeButton: false,
    ...options
  });
};

// Update existing notification
export const updateNotification = (toastId, message, type = 'info', options = {}) => {
  const updateOptions = {
    render: message,
    type: type,
    isLoading: false,
    ...options
  };
  
  return toast.update(toastId, updateOptions);
};

// Dismiss notification
export const dismissNotification = (toastId) => {
  return toast.dismiss(toastId);
};

// Dismiss all notifications
export const dismissAllNotifications = () => {
  return toast.dismiss();
};

// Show operation result notification
export const showOperationResult = (success, message, data = null) => {
  if (success) {
    showSuccessNotification(message);
  } else {
    showErrorNotification(message);
  }
  
  return { success, message, data };
};

// Show API error notification
export const showApiError = (error, defaultMessage = 'An error occurred') => {
  const message = error?.response?.data?.detail || error?.message || defaultMessage;
  return showErrorNotification(message);
};

// Show success with details
export const showSuccessWithDetails = (message, details) => {
  const detailedMessage = typeof details === 'string' 
    ? `${message}: ${details}`
    : message;
  
  return showSuccessNotification(detailedMessage);
};

// Show progress notification
export const showProgressNotification = (message, progress) => {
  return showInfoNotification(`${message} (${progress}%)`);
};
