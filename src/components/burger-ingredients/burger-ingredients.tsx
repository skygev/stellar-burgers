import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { getMenuCatalog } from '../../services/slices/menuCatalogSlice';

export const BurgerIngredients: FC = () => {
  // Получение каталога ингредиентов из хранилища
  const menuCatalog = useSelector(getMenuCatalog);

  // Фильтрация ингредиентов по категориям
  const buns = menuCatalog.buns.filter(function filterBuns(item) {
    return item.type === 'bun';
  });
  const mains = menuCatalog.mains.filter(function filterMains(item) {
    return item.type === 'main';
  });
  const sauces = menuCatalog.sauces.filter(function filterSauces(item) {
    return item.type === 'sauce';
  });

  // Состояние активной вкладки
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Ссылки на заголовки секций для прокрутки
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Хуки для отслеживания видимости секций
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Автоматическое переключение вкладок при прокрутке
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик переключения вкладок
  function handleTabClick(tab: string) {
    const tabMode = tab as TTabMode;
    setCurrentTab(tabMode);

    // Прокрутка к соответствующей секции
    switch (tabMode) {
      case 'bun':
        titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'main':
        titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'sauce':
        titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={handleTabClick}
    />
  );
};
