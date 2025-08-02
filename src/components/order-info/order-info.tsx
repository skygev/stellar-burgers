import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { fetchPurchaseByNumber } from '../../services/slices/purchaseHistorySlice';
import { getActivityFeed } from '../../services/slices/activityFeedSlice';
import { getMenuCatalog } from '../../services/slices/menuCatalogSlice';
import { useSelector, useDispatch } from '../../services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const storeDispatch = useDispatch();

  // Получение каталога ингредиентов из хранилища
  const catalogData = useSelector(getMenuCatalog);

  // Объединение всех категорий ингредиентов для поиска
  const ingredients: TIngredient[] = [
    ...catalogData.buns,
    ...catalogData.mains,
    ...catalogData.sauces
  ];

  // Получение данных ленты активности
  const activityData = useSelector(getActivityFeed).activityData?.orders || [];
  const completedOrders = activityData.filter((item) => item.status === 'done');
  const orderData = completedOrders.find(
    (item) => item.number === Number(number)
  );

  // Загрузка данных о заказе при монтировании
  useEffect(
    function loadOrderData() {
      storeDispatch(fetchPurchaseByNumber(Number(number)));
    },
    [storeDispatch, number]
  );

  /* Готовим данные для отображения */
  const orderInfo = useMemo(
    function calculateOrderData() {
      if (!orderData || !ingredients.length) return null;

      // Форматирование даты создания заказа
      const orderDate = new Date(orderData.createdAt);

      // Тип для хранения ингредиентов с подсчетом количества
      type IngredientsWithQuantity = {
        [key: string]: TIngredient & { count: number };
      };

      // Подсчет количества каждого ингредиента в заказе
      const ingredientsInfo = orderData.ingredients.reduce(
        function countIngredients(acc: IngredientsWithQuantity, itemId) {
          if (!acc[itemId]) {
            const foundIngredient = ingredients.find(
              function findIngredient(ing) {
                return ing._id === itemId;
              }
            );
            if (foundIngredient) {
              acc[itemId] = {
                ...foundIngredient,
                count: 1
              };
            }
          } else {
            acc[itemId].count++;
          }

          return acc;
        },
        {}
      );

      // Вычисление общей стоимости заказа
      const totalPrice = Object.values(ingredientsInfo).reduce(
        function calculateTotal(acc, ingredient) {
          return acc + ingredient.price * ingredient.count;
        },
        0
      );

      return {
        ...orderData,
        ingredientsInfo,
        date: orderDate,
        total: totalPrice
      };
    },
    [orderData, ingredients]
  );

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
