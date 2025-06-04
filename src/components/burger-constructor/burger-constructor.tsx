import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '../ui/burger-constructor';
import { TConstructorIngredient } from '@utils-types';
import {
  clearConstructor,
  setOrderRequest,
  setOrderModalData
} from '../../services/slices/constructor';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const { constructorItems, orderRequest, orderModalData } = useSelector(
    (state) => state.constructor
  );

  const onOrderClick = () => {
    if (!constructorItems || !constructorItems.bun || orderRequest) return;
    dispatch(setOrderRequest(true));
    // dispatch(sendOrder({ ingredients: [...] }));
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
    dispatch(clearConstructor());
  };

  const price = useMemo(() => {
    if (!constructorItems) return 0;

    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice =
      constructorItems.ingredients?.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ) || 0;

    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  if (
    !constructorItems?.ingredients ||
    !Array.isArray(constructorItems.ingredients)
  ) {
    return <p>Загрузка конструктора...</p>;
  }

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

export default BurgerConstructor;
