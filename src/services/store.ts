import { configureStore } from '@reduxjs/toolkit';

// Импорты редьюсеров слайсов
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';
import orderReducer from './orderSlice';

// Типизированные хуки
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Объект с редьюсерами
const reducers = {
  ingredients: ingredientsReducer,
  constructor: constructorReducer,
  order: orderReducer
};

// Создание Redux-хранилища
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

// Типы RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Кастомные хуки с типами
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// Экспорт по умолчанию
export default store;
