import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { getActivityFeed } from '../../services/slices/activityFeedSlice';

// Вспомогательная функция для получения номеров заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получение данных активности из хранилища
  const activityFeedData = useSelector(getActivityFeed);

  // Извлечение списка заказов с проверкой на существование
  const ordersList = activityFeedData.activityData?.orders || [];

  // Получение готовых и ожидающих заказов
  const readyOrders = getOrders(ordersList, 'done');
  const pendingOrders = getOrders(ordersList, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={activityFeedData.activityData}
    />
  );
};
