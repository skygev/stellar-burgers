import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { menuCatalogReducer } from './slices/menuCatalogSlice';
import { activityFeedReducer } from './slices/activityFeedSlice';
import { authenticationReducer } from './slices/authenticationSlice';
import { purchaseHistoryReducer } from './slices/purchaseHistorySlice';
import { builderReducer } from './slices/constructorSlice';

describe('Тесты на Jest: Проверяют правильную инициализацию rootReducer.', () => {
  it('Проверяют правильную инициализацию rootReducer.', () => {
    const rootReducer = combineReducers({
      menuCatalog: menuCatalogReducer,
      activityFeed: activityFeedReducer,
      authentication: authenticationReducer,
      purchaseHistory: purchaseHistoryReducer,
      foodBuilder: builderReducer
    });

    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();

    expect(state).toHaveProperty('menuCatalog');
    expect(state).toHaveProperty('activityFeed');
    expect(state).toHaveProperty('authentication');
    expect(state).toHaveProperty('purchaseHistory');
    expect(state).toHaveProperty('foodBuilder');

    expect(state.menuCatalog).toEqual({
      buns: [],
      mains: [],
      sauces: [],
      loading: false,
      error: null
    });
    expect(state.activityFeed).toEqual({
      errorMessage: null,
      isLoading: false,
      activityData: null
    });
    expect(state.authentication).toEqual({
      error: null,
      statusRequest: 'Idle',
      data: null,
      isAuth: false
    });
    expect(state.purchaseHistory).toEqual({
      errorMessage: null,
      isLoading: false,
      isProcessingPurchase: false,
      selectedPurchase: null,
      purchaseList: []
    });
    expect(state.foodBuilder).toEqual({ ingredients: [], bun: null });
  });
});
