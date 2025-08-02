import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { signOutUser } from '../../services/slices/authenticationSlice';
import { useNavigate } from 'react-router-dom';

export const ProfileMenu: FC = () => {
  // Получение текущего пути для подсветки активного пункта
  const { pathname } = useLocation();
  // Диспетчер для отправки действий в store
  const storeDispatch = useDispatch();
  // Хук для программной навигации
  const router = useNavigate();

  // Обработчик выхода из системы
  function handleUserLogout() {
    storeDispatch(signOutUser()).then(function redirectToHome() {
      router('/');
    });
  }

  return <ProfileMenuUI handleLogout={handleUserLogout} pathname={pathname} />;
};
