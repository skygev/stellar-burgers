import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FC, ReactElement } from 'react';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();

  const user = useSelector((state: any) => state.user.user);

  const isAuth = !!user;

  if (!isAuth && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (isAuth && onlyUnAuth) {
    return <Navigate to='/' replace />;
  }

  return children;
};
