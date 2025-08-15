import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addComponent } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    // Получение текущего местоположения для модального окна
    const location = useLocation();
    // Диспетчер для отправки действий в store
    const storeDispatch = useDispatch();

    // Обработчик добавления ингредиента в конструктор
    function handleIngredientAdd() {
      storeDispatch(addComponent(ingredient));
    }

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleIngredientAdd}
      />
    );
  }
);
