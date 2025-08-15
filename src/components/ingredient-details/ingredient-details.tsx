import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import {
  fetchMenuItems,
  getMenuCatalog
} from '../../services/slices/menuCatalogSlice';
import styles from '../ui/pages/common.module.css';

export const IngredientDetails: FC = () => {
  // Получение ID ингредиента из URL параметров
  const { id } = useParams();
  const storeDispatch = useDispatch();
  const location = useLocation();

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

  // Если это отдельная страница (не модальное окно), добавляем заголовок и центрирование
  const isModalPage = location.state?.background;

  if (!isModalPage) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapCenter}>
          <h1 className={`text text_type_main-large ${styles.title} mb-4`}>
            Детали ингредиента
          </h1>
          <IngredientDetailsUI ingredientData={ingredientData} />
        </div>
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
