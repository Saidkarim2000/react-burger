import ProtectedRoute from '@/components/protected-route/protected-route';
import FeedPage from '@/pages/feed/feedPage';
import ForgotPasswordPage from '@/pages/forgot-password/forgotPasswordPage';
import HomePage from '@/pages/home/homePage';
import IngredientModal from '@/pages/ingredient-modal/ingredient-modal';
import Layout from '@/pages/layout/layout';
import LoginPage from '@/pages/login/loginPage';
import NotFoundPage from '@/pages/not-found/notFoundPage';
import ProfileLayout from '@/pages/profile/profileLayout';
import ProfileOrderPage from '@/pages/profile/profileOrderPage';
import ProfilePage from '@/pages/profile/profilePage';
import RegisterPage from '@/pages/register/registerPage';
import ResetPasswordPage from '@/pages/reset-password/resetPasswordPage';
import { useLazyGetUserQuery } from '@/utils/api/api';
import { setIsAuthChecked, setUser } from '@/utils/userSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        children: [
          {
            path: 'ingredients/:id',
            element: <IngredientModal />,
          },
        ],
      },
      {
        path: 'login',
        element: <ProtectedRoute onlyUnAuth component={<LoginPage />} />,
      },
      {
        path: 'register',
        element: <ProtectedRoute onlyUnAuth component={<RegisterPage />} />,
      },
      {
        path: 'forgot-password',
        element: <ProtectedRoute onlyUnAuth component={<ForgotPasswordPage />} />,
      },
      {
        path: 'reset-password',
        element: <ProtectedRoute onlyUnAuth component={<ResetPasswordPage />} />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute component={<ProfileLayout />} />,
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
          {
            path: 'orders',
            element: <ProfileOrderPage />,
          },
        ],
      },
      {
        path: 'feed',
        element: <FeedPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const [getUser] = useLazyGetUserQuery();

  useEffect(() => {
    async function checkUserAuth(): Promise<void> {
      try {
        const hasToken =
          localStorage.getItem('accessToken') ?? localStorage.getItem('refreshToken');

        if (!hasToken) {
          dispatch(setUser(null));
          return;
        }

        await getUser().unwrap();
      } catch {
        dispatch(setUser(null));
      } finally {
        dispatch(setIsAuthChecked(true));
      }
    }

    void checkUserAuth();
  }, [dispatch, getUser]);

  return <RouterProvider router={router} />;
};

export default App;
