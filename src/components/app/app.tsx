import HomePage from '@/pages/home/homePage';
import IngredientModal from '@/pages/ingredient-modal/ingredient-modal';
import Layout from '@/pages/layout/layout';
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
    ],
  },
]);

export const App = (): React.JSX.Element => {
  return <RouterProvider router={router} />;
};

export default App;
