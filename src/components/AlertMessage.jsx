// src/components/AlertMessage.js
import React, { useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeAlert } from '../data/slices/alertSlice';

const AlertMessage = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.alert);

  const handleClose = () => {
    dispatch(closeAlert());
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        handleClose();
      }, 3000); // Auto-close after 3 seconds
    }
  }, [open]);

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
