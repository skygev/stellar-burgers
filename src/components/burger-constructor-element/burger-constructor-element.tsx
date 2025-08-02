import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  removeComponent,
  repositionComponent
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    // Диспетчер для отправки действий в store
    const dispatch = useDispatch();

    // Обработчик перемещения элемента вниз
    const handleMoveDown = () => {
      dispatch(repositionComponent({ index, direction: 'down' }));
    };

    // Обработчик перемещения элемента вверх
    const handleMoveUp = () => {
      dispatch(repositionComponent({ index, direction: 'up' }));
    };

    // Обработчик удаления элемента из конструктора
    const handleClose = () => {
      dispatch(removeComponent(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
