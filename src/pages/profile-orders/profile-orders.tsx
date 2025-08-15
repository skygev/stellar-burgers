import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserPurchases } from '../../services/slices/purchaseHistorySlice';

export const ProfileOrders: FC = () => {
  const storeDispatch = useDispatch();
  const userOrdersList: TOrder[] = useSelector(
    (state) => state.purchaseHistory.purchaseList
  );

  function loadUserOrdersData() {
    storeDispatch(fetchUserPurchases());
  }

  useEffect(loadUserOrdersData, [storeDispatch]);

  return <ProfileOrdersUI orders={userOrdersList} />;
};
