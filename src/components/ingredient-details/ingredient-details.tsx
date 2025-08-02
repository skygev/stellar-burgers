import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import {
  fetchMenuItems,
  getMenuCatalog
} from '../../services/slices/menuCatalogSlice';

export const IngredientDetails: FC = () => {
  // Получение ID ингредиента из URL параметров
  const { id } = useParams();
  const storeDispatch = useDispatch();

  // Получение каталога ингредиентов из хранилища
  const menuCatalog = useSelector(getMenuCatalog);

  // Поиск ингредиента во всех категориях
  const allIngredients = [
    ...menuCatalog.buns,
    ...menuCatalog.mains,
    ...menuCatalog.sauces
  ];
  const ingredientData = allIngredients.find(function findById(item) {
    return item._id === id;
  });

  // Загрузка данных при необходимости
  useEffect(
    function loadMenuData() {
      const hasData = menuCatalog.buns.length > 0;
      if (!hasData) {
        storeDispatch(fetchMenuItems());
      }
    },
    [storeDispatch, menuCatalog.buns.length]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
