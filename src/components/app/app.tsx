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
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'profile',
        element: <ProfileLayout />,
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
  return <RouterProvider router={router} />;
};

export default App;
