import { RouterProvider } from 'react-router-dom';
import AlertMessage from './components/AlertMessage';
import { fetchAdminCounts } from './data/slices/notificationSlice';
import { getNotificationCount } from './data/slices/notificationSlice';
import { viewProfile } from './data/slices/authSlice';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';





// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  const dispatch = useDispatch()




  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && typeof token === "string" && token.trim().length > 0) {
      // dispatch(viewProfile());
      dispatch(getNotificationCount());
    }
  }, []);

  return (
    <ThemeCustomization>
      <AlertMessage />
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
