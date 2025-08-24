import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { menuCatalogReducer } from './slices/menuCatalogSlice';
import { activityFeedReducer } from './slices/activityFeedSlice';
import { authenticationReducer } from './slices/authenticationSlice';
import { purchaseHistoryReducer } from './slices/purchaseHistorySlice';
import { builderReducer } from './slices/constructorSlice';

describe('Тесты на Jest: Проверяют правильную настройку и работу rootReducer', () => {
  it('должен вернуть корректное начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const rootReducer = combineReducers({
      menuCatalog: menuCatalogReducer,
      activityFeed: activityFeedReducer,
      authentication: authenticationReducer,
      purchaseHistory: purchaseHistoryReducer,
      foodBuilder: builderReducer
    });

    // Вызываем rootReducer с undefined состоянием и экшеном с типом 'UNKNOWN_ACTION'
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние содержит все необходимые ветки
    expect(initialState).toHaveProperty('menuCatalog');
    expect(initialState).toHaveProperty('activityFeed');
    expect(initialState).toHaveProperty('authentication');
    expect(initialState).toHaveProperty('purchaseHistory');
    expect(initialState).toHaveProperty('foodBuilder');

    // Проверяем корректность начального состояния каждого редьюсера
    expect(initialState.menuCatalog).toEqual({
      buns: [],
      mains: [],
      sauces: [],
      loading: false,
      error: null
    });
    expect(initialState.activityFeed).toEqual({
      errorMessage: null,
      isLoading: false,
      activityData: null
    });
    expect(initialState.authentication).toEqual({
      error: null,
      statusRequest: 'Idle',
      data: null,
      isAuth: false
    });
    expect(initialState.purchaseHistory).toEqual({
      errorMessage: null,
      isLoading: false,
      isProcessingPurchase: false,
      selectedPurchase: null,
      purchaseList: []
    });
    expect(initialState.foodBuilder).toEqual({ ingredients: [], bun: null });
  });
});
