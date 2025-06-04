import { TConstructorIngredient } from '@utils-types';
import { TIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
};

export type { TIngredient };
