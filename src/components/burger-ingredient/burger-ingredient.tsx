import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from '../../services/store';
import { addIngredient, setBun } from '../../services/slices/constructor';
import { BurgerIngredientUI } from '../ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(setBun({ ...ingredient, _uid: uuidv4() }));
      } else {
        dispatch(addIngredient({ ...ingredient, _uid: uuidv4() }));
      }
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
