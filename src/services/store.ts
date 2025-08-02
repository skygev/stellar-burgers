import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { menuCatalogReducer } from './slices/menuCatalogSlice';
import { activityFeedReducer } from './slices/activityFeedSlice';
import { authenticationReducer } from './slices/authenticationSlice';
import { purchaseHistoryReducer } from './slices/purchaseHistorySlice';
import { builderReducer } from './slices/constructorSlice';

// Типизированные хуки React-Redux
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Объединение всех редюсеров в корневой редюсер
const rootReducer = combineReducers({
  menuCatalog: menuCatalogReducer,
  activityFeed: activityFeedReducer,
  authentication: authenticationReducer,
  purchaseHistory: purchaseHistoryReducer,
  foodBuilder: builderReducer
});

// Создание store с настройками
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production' // DevTools только в разработке
});

// Типы для корректной типизации состояния и dispatch
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки для безопасного использования в компонентах
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
