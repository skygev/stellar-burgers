import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { getIsSessionVerified } from '../../services/slices/authenticationSlice';

type ProtectedRouteProps = {
  guestOnly?: boolean; // Флаг "только для гостей" (неавторизованных)
  children: React.ReactElement; // Дочерние элементы для рендера
};

export const ProtectedRoute = ({
  guestOnly,
  children
}: ProtectedRouteProps) => {
  // Получение текущего местоположения для сохранения состояния навигации
  const currentLocation = useLocation();
  // Проверка завершена ли верификация пользовательской сессии
  const isAuthVerified = useSelector(getIsSessionVerified);
  // Получение данных текущего пользователя
  const currentUser = useSelector((state) => state.authentication.data);

  // Показываем загрузку пока идет верификация сессии
  if (!isAuthVerified) {
    return <Preloader />;
  }

  // Для защищенных маршрутов: перенаправляем неавторизованных на логин
  if (!guestOnly && !currentUser) {
    return <Navigate replace to='/login' state={{ from: currentLocation }} />;
  }

  // Для гостевых маршрутов: перенаправляем авторизованных пользователей
  if (guestOnly && currentUser) {
    const redirectPath = currentLocation.state?.from || { pathname: '/' };
    const backgroundLocation = currentLocation.state?.from?.state || null;
    return (
      <Navigate replace to={redirectPath} state={{ backgroundLocation }} />
    );
  }

  return children;
};
