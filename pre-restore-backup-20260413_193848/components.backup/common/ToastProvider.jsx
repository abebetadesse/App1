import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = {
  success: (msg) => toast.success(msg, { position: 'top-right', autoClose: 3000 }),
  error: (msg) => toast.error(msg, { position: 'top-right', autoClose: 5000 }),
  info: (msg) => toast.info(msg, { position: 'top-right', autoClose: 3000 }),
  warning: (msg) => toast.warning(msg, { position: 'top-right', autoClose: 4000 }),
};

export const ToastProvider = () => <ToastContainer />;
