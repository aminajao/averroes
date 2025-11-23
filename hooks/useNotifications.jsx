import { useState } from 'react';

export function useNotifications() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const showSuccess = (message) => {
    showNotification(message, 'success');
  };

  const showError = (message) => {
    showNotification(message, 'error');
  };

  const showInfo = (message) => {
    showNotification(message, 'info');
  };

  const showWarning = (message) => {
    showNotification(message, 'warning');
  };

  const hideNotification = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    snackbar,
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideNotification,
  };
}
