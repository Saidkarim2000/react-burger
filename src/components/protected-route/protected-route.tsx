import { selectIsAuthChecked, selectUser } from '@/utils/userSlice';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, type Location } from 'react-router-dom';

type TProtectedRouteProps = {
  component: React.JSX.Element;
  onlyUnAuth?: boolean;
};

export default function ProtectedRoute({
  component,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location } | null)?.from ?? '/';

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return component;
}
