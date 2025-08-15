import { FC, memo, useMemo } from 'react';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { getMenuCatalog } from '../../services/slices/menuCatalogSlice';
import { useSelector } from '../../services/store';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  // Получение каталога ингредиентов из хранилища
  const catalogData = useSelector(getMenuCatalog);

  // Объединение всех типов ингредиентов в единый массив
  const ingredients: TIngredient[] = [
    ...catalogData.buns,
    ...catalogData.mains,
    ...catalogData.sauces
  ];

  // Вычисление информации о заказе
  const orderInfo = useMemo(
    function calculateOrderInfo() {
      if (!ingredients.length) return null;

      // Получение полной информации об ингредиентах заказа
      const ingredientsInfo = order.ingredients.reduce(
        function collectIngredientData(acc: TIngredient[], itemId: string) {
          const foundIngredient = ingredients.find(
            function findIngredient(ing) {
              return ing._id === itemId;
            }
          );
          if (foundIngredient) return [...acc, foundIngredient];
          return acc;
        },
        []
      );

      // Подсчет общей стоимости
      const total = ingredientsInfo.reduce(function sumPrice(acc, item) {
        return acc + item.price;
      }, 0);

      // Ограничение количества отображаемых ингредиентов
      const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

      // Подсчет оставшихся скрытых ингредиентов
      const remains =
        ingredientsInfo.length > maxIngredients
          ? ingredientsInfo.length - maxIngredients
          : 0;

      // Форматирование даты заказа
      const date = new Date(order.createdAt);

      return {
        ...order,
        ingredientsInfo,
        ingredientsToShow,
        remains,
        total,
        date
      };
    },
    [order, ingredients]
  );

  if (!orderInfo) return null;

  return <OrderCardUI orderInfo={orderInfo} maxIngredients={maxIngredients} />;
});
