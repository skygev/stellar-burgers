import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // добавляем uuid

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(addIngredient({ ...ingredient, id: uuidv4() })); //добавляем уникальный id
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
