import { RouterProvider } from '@tanstack/react-router';
import { Slide, ToastContainer } from 'react-toastify';

import { router } from '@/lib/tanstack-router';

import { AppProvider } from './provider';

// This component needs to be inside AuthProvider to access auth context
function Router() {
  return <RouterProvider router={router} />;
}

export const App = () => {
  return (
    <AppProvider>
      <Router />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
        transition={Slide}
        limit={3}
        toastStyle={{
          fontSize: '14px',
          padding: '8px 12px',
          minHeight: 'auto',
          maxWidth: '300px',
        }}
      />
    </AppProvider>
  );
};
