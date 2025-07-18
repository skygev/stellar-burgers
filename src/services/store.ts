import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Объект с редьюсерами
const reducers = {
  ingredients: ingredientsReducer,
  constructor: constructorReducer
};

// Создание Redux-хранилища с отключением serializableCheck
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

// Типы RootState и AppDispatch для typed-хуков
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Кастомные хуки
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// Экспорт хранилища по умолчанию
export default store;
