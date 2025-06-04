import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Импорт редьюсеров
import ingredientsReducer from './slices/ingredients';
import constructorReducer from './slices/constructor';
//import userReducer from './slices/user';
//import orderReducer from './slices/order';
// import feedReducer from './slices/feed';               // WebSocket: лента заказов
// import profileOrdersReducer from './slices/profileOrders'; // WebSocket: заказы пользователя

// Комбинируем редьюсеры
const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: constructorReducer
  //user: userReducer,
  //order: orderReducer,
  // feed: feedReducer,
  // profileOrders: profileOrdersReducer,
});

// Создаём store
//const store = configureStore({
//  reducer: rootReducer,
//  devTools: process.env.NODE_ENV !== 'production'
//});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // ⚠️ отключает проверку сериализуемости
    })
});

// Типизация стора и хуков
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
