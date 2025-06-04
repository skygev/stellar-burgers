import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { fetchIngredients } from '../../services/middlewares/ingredients';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    console.log('dispatching fetchIngredients');
    dispatch(fetchIngredients())
      .unwrap()
      .catch((error) => console.error('Ошибка при загрузке:', error));
  }, [dispatch]);

  const isIngredientsLoading = status === 'loading';

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          {error && (
            <p className='text text_type_main-default text_color_error pl-5'>
              Ошибка: {error}
            </p>
          )}
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
