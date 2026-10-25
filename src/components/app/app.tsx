import HomePage from '@/pages/home/homePage';
import Layout from '@/pages/layout/layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

export const App = (): React.JSX.Element => {
  return <RouterProvider router={router} />;
};

export default App;
