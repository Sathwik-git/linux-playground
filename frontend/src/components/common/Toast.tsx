import toast, { Toaster } from 'react-hot-toast';

// Toast notification system
export const notifySuccess = (message: string) =>
  toast.success(message, {
    style: {
      background: '#1a1a1a',
      color: '#fff',
      border: '1px solid #38a169',
    },
    iconTheme: {
      primary: '#38a169',
      secondary: '#fff',
    },
  });

export const notifyError = (message: string) =>
  toast.error(message, {
    style: {
      background: '#1a1a1a',
      color: '#fff',
      border: '1px solid #e53e3e',
    },
    iconTheme: {
      primary: '#e53e3e',
      secondary: '#fff',
    },
  });

export const notifyWarning = (message: string) =>
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#1a1a1a',
      color: '#fff',
      border: '1px solid #d69e2e',
    },
  });

export const notifyInfo = (message: string) =>
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#1a1a1a',
      color: '#fff',
      border: '1px solid #4299e1',
    },
  });

// Toaster component to be included in the app
export const ToastContainer = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 5000,
      className: 'bg-terminal-darker text-white',
    }}
  />
);