import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserProfile } from '../../services/slices/authenticationSlice';

export const AppHeader: FC = () => {
  // Получение данных пользователя из глобального состояния
  const user = useSelector(getUserProfile);

  // Передача имени пользователя в UI компонент
  return <AppHeaderUI userName={user?.name || ''} />;
};
