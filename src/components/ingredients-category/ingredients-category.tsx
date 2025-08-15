import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Получение данных конструктора из хранилища
  const constructorState = useSelector((state) => state.foodBuilder);

  // Вычисление счетчиков ингредиентов
  const ingredientsCounters = useMemo(
    function calculateCounters() {
      const { bun, ingredients } = constructorState;
      const counters: { [key: string]: number } = {};
      ingredients.forEach(function countIngredient(ingredient: TIngredient) {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
      if (bun) counters[bun._id] = 2;
      return counters;
    },
    [constructorState]
  );

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
