import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { resetBuilder } from '../../services/slices/constructorSlice';
import {
  closePurchaseModal,
  createNewPurchase
} from '../../services/slices/purchaseHistorySlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получение данных из состояния приложения
  const currentUser = useSelector((state) => state.authentication.data);
  const constructorData = useSelector((state) => state.foodBuilder);
  const isOrderProcessing = useSelector(
    (state) => state.purchaseHistory.isProcessingPurchase
  );
  const modalData = useSelector(
    (state) => state.purchaseHistory.selectedPurchase
  );

  // Инициализация при монтировании компонента
  useEffect(
    function componentInitialization() {
      dispatch(closePurchaseModal());
    },
    [dispatch]
  );

  // Очистка конструктора при успешном создании заказа
  useEffect(
    function clearConstructorOnSuccess() {
      if (modalData && !isOrderProcessing) {
        dispatch(resetBuilder());
      }
    },
    [modalData, isOrderProcessing, dispatch]
  );

  // Функция для обработки клика по кнопке заказа
  function handleOrderClick() {
    const hasRequiredItems = constructorData.bun && !isOrderProcessing;
    if (!hasRequiredItems) return;

    // Формирование списка ингредиентов для заказа
    const orderIngredients = [
      constructorData.bun!._id, // булка дважды - верх
      ...constructorData.ingredients.map((ingredient) => ingredient._id),
      constructorData.bun!._id // булка дважды - низ
    ];

    // Проверка авторизации и создание заказа
    currentUser
      ? dispatch(createNewPurchase(orderIngredients))
      : navigate('/login', { replace: true });
  }

  // Функция закрытия модального окна
  function handleModalClose() {
    dispatch(closePurchaseModal());
  }

  // Вычисление итоговой стоимости
  const totalPrice = useMemo(
    function calculatePrice() {
      const bunPrice = constructorData.bun ? constructorData.bun.price * 2 : 0;
      const ingredientsPrice = constructorData.ingredients.reduce(
        function addIngredientPrice(sum: number, item: TConstructorIngredient) {
          return sum + item.price;
        },
        0
      );
      return bunPrice + ingredientsPrice;
    },
    [constructorData]
  );

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={isOrderProcessing}
      constructorItems={constructorData}
      orderModalData={modalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleModalClose}
    />
  );
};
